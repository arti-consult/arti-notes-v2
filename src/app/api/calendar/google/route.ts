// src/app/api/calendar/google/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isGoogleCalendarConnected } from '@/utils/calendar/google-calendar';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  // Verify user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // Check if Google Calendar is connected
  const connected = await isGoogleCalendarConnected(user.id);
  
  // Get last sync time
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_calendar_sync')
    .eq('id', user.id)
    .single();
  
  return NextResponse.json({
    connected,
    lastSyncTime: profile?.last_calendar_sync || null
  });
}