

export async function initiateMicrosoftAuth() {
  try {
    console.log('Starting Microsoft auth...');
    
    // Build auth URL manually
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${config.microsoft.clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback/microsoft')}&` +
      `scope=${encodeURIComponent('Calendars.Read OnlineMeetings.ReadWrite offline_access')}&` +
      `response_mode=query`;

    // Redirect directly instead of using popup
    window.location.href = authUrl;
    return true;
  } catch (error) {
    console.error('Microsoft auth error:', error);
    throw error;
  }
}

export async function handleAuthCallback(code: string): Promise<boolean> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('No authenticated user');

    // Store the connection in Supabase
    const { error: storeError } = await supabase
      .from('microsoft_connections')
      .upsert({
        user_id: user.id,
        access_token: code, // Store temporarily, would be exchanged for real token in production
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (storeError) throw storeError;
    return true;
  } catch (error) {
    console.error('Error handling callback:', error);
    return false;
  }
}

export async function disconnectMicrosoft(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('microsoft_connections')
      .delete()
      .eq('user_id', userId);
    return !error;
  } catch (error) {
    console.error('Error disconnecting:', error);
    return false;
  }
}