import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/utils/calendar/google-calendar';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting Google OAuth flow...');
    
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Supabase auth error:', error);
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    if (!user) {
      console.error('No user found in session');
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    console.log('User authenticated:', { userId: user.id, email: user.email });
    
    // Generate Google OAuth URL
    const authUrl = getGoogleAuthUrl();
    console.log('Generated OAuth URL:', authUrl);
    
    return NextResponse.json(
      { url: authUrl },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error in Google auth route:', error);
    return NextResponse.json(
      { error: 'Failed to generate Google auth URL', details: error instanceof Error ? error.message : String(error) },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 