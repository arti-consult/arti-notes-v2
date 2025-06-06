export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          meeting_type: 'live' | 'google-meets' | 'microsoft-teams';
          created_at: string;
          updated_at: string;
          start_time?: string;
          end_time?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          meeting_type: 'live' | 'google-meets' | 'microsoft-teams';
          created_at?: string;
          updated_at?: string;
          start_time?: string;
          end_time?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          meeting_type?: 'live' | 'google-meets' | 'microsoft-teams';
          created_at?: string;
          updated_at?: string;
          start_time?: string;
          end_time?: string;
        };
      };
      transcriptions: {
        Row: {
          id: string;
          meeting_id: string;
          status: string;
          language: string;
          text?: string;
          error?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          status: string;
          language: string;
          text?: string;
          error?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          status?: string;
          language?: string;
          text?: string;
          error?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 