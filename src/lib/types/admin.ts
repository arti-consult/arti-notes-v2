export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalMeetings: number;
  totalTranscriptions: number;
  storageUsed: number;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
} 