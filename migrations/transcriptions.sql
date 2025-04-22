-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop dependent views first
DROP VIEW IF EXISTS users_summary CASCADE;

-- Drop existing table if it exists
DROP TABLE IF EXISTS transcriptions CASCADE;

-- Create the transcriptions table
CREATE TABLE transcriptions (
    -- Primary key and relationships
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID,
    user_id UUID NOT NULL,
    
    -- Status and metadata
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'error')) DEFAULT 'processing',
    language TEXT NOT NULL DEFAULT 'nb',
    
    -- Transcription content
    content JSONB NOT NULL CHECK (
        jsonb_typeof(content->'transcription') = 'string' AND
        jsonb_typeof(content->'segments') = 'array' AND
        jsonb_typeof(content->'metadata') = 'object' AND
        (
            content->>'transcription' IS NOT NULL AND
            content->>'transcription' != ''
        )
    ),
    
    -- Summary and analysis
    summary_text TEXT,
    summary_topics JSONB DEFAULT '[]'::jsonb CHECK (jsonb_typeof(summary_topics) = 'array'),
    action_items JSONB DEFAULT '[]'::jsonb CHECK (jsonb_typeof(action_items) = 'array'),
    
    -- Statistics
    speaker_count INTEGER DEFAULT 1,
    confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
    word_count INTEGER GENERATED ALWAYS AS (
        jsonb_array_length(
            CASE 
                WHEN jsonb_typeof(content->'segments') = 'array' 
                THEN content->'segments' 
                ELSE '[]'::jsonb 
            END
        )
    ) STORED,
    
    -- External API references
    api_job_id TEXT,
    api_recording_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- Add foreign key constraints with specific names
    CONSTRAINT transcriptions_recording_id_fkey FOREIGN KEY (recording_id)
        REFERENCES public.recordings(id) ON DELETE CASCADE,
    CONSTRAINT transcriptions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_transcriptions_recording_id ON transcriptions(recording_id);
CREATE INDEX idx_transcriptions_user_id ON transcriptions(user_id);
CREATE INDEX idx_transcriptions_status ON transcriptions(status);
CREATE INDEX idx_transcriptions_created_at ON transcriptions(created_at);

-- Full text search index on transcription content and summary
CREATE INDEX idx_transcriptions_fts ON transcriptions 
USING gin((
    setweight(to_tsvector('english', COALESCE(content->>'transcription', '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(summary_text, '')), 'B')
));

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_transcription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transcriptions_updated_at
    BEFORE UPDATE ON transcriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_transcription_updated_at();

-- Add function to validate transcription content structure
CREATE OR REPLACE FUNCTION validate_transcription_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate metadata structure
    IF NOT (
        NEW.content ? 'metadata' AND
        NEW.content->'metadata' ? 'version' AND
        NEW.content->'metadata' ? 'language' AND
        NEW.content->'metadata' ? 'speaker_count' AND
        NEW.content->'metadata' ? 'status'
    ) THEN
        RAISE EXCEPTION 'Invalid metadata structure in content';
    END IF;

    -- Validate segments structure
    IF NOT (
        NEW.content ? 'segments' AND
        jsonb_typeof(NEW.content->'segments') = 'array'
    ) THEN
        RAISE EXCEPTION 'Invalid segments structure in content';
    END IF;

    -- All validations passed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_transcription_content_trigger
    BEFORE INSERT OR UPDATE ON transcriptions
    FOR EACH ROW
    EXECUTE FUNCTION validate_transcription_content();

-- Add comments
COMMENT ON TABLE transcriptions IS 'Stores transcriptions of audio recordings with metadata and analysis';
COMMENT ON COLUMN transcriptions.content IS 'JSON structure containing transcription text, segments, and metadata';
COMMENT ON COLUMN transcriptions.summary_text IS 'Generated summary of the transcription content';
COMMENT ON COLUMN transcriptions.summary_topics IS 'Array of topics extracted from the transcription';
COMMENT ON COLUMN transcriptions.action_items IS 'Array of action items extracted from the transcription';
COMMENT ON COLUMN transcriptions.word_count IS 'Automatically calculated count of words in the transcription';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON transcriptions TO authenticated;

-- Recreate the users_summary view
CREATE OR REPLACE VIEW users_summary AS
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    COUNT(DISTINCT r.id) as recordings_count,
    COALESCE(SUM(r.file_size), 0) as file_storage,
    COALESCE(
        SUM(
            CASE 
                WHEN t.content IS NOT NULL 
                THEN jsonb_array_length(t.content->'segments')::bigint 
                ELSE 0 
            END
        ), 0
    ) as transcription_storage
FROM auth.users u
LEFT JOIN recordings r ON r.user_id = u.id
LEFT JOIN transcriptions t ON t.recording_id = r.id
GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at; 