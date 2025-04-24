// src/app/api/cron/calendar-sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { syncAllUserCalendars } from '@/utils/calendar/background-sync';

// Secret token to protect the cron endpoint
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get('authorization');
  
  if (!CRON_SECRET || !authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const result = await syncAllUserCalendars();
    
    return NextResponse.json({
      success: result.success,
      syncedUsers: result.syncedUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}