// List of admin user IDs - you can move this to environment variables or a database later
const ADMIN_USER_IDS = [
  'user-id-1', // Replace with actual admin user IDs
  'user-id-2'
];

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // For now, just check if the user ID is in the admin list
    return ADMIN_USER_IDS.includes(userId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}