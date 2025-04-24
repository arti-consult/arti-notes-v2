import { NextRequest, NextResponse } from 'next/server';
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
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const daysAhead = parseInt(searchParams.get('daysAhead') || '30');
  const hasMeetingLinkOnly = searchParams.get('hasMeetingLinkOnly') === 'true';
  
  // Calculate date range
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  
  // Build query
  let query = supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', now.toISOString())
    .lte('start_time', future.toISOString())
    .order('start_time', { ascending: true });
  
  // Filter by meeting link if requested
  if (hasMeetingLinkOnly) {
    query = query.not('meeting_link', 'is', null);
  }
  
  const { data: events, error: fetchError } = await query;
  
  if (fetchError) {
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ events });
} 