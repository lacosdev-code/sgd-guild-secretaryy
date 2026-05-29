export type UserRole = 'guild_master' | 'adventurer';

export type DifficultyRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type QuestUrgency = 'Routine' | 'Priority' | 'Emergency' | 'Strategic';

export type QuestStatus = 'Draft' | 'Active' | 'Submitted' | 'Approved' | 'Revise' | 'Failed';

export interface User {
  id: string;
  nama: string;
  role: UserRole;
  total_points: number;
  avatar_url?: string;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string | null; // uuid of User
  created_by: string; // uuid of User
  urgency: QuestUrgency;
  difficulty: DifficultyRank | null;
  deadline: string | null;
  success_parameter: string | null;
  reward_points: number | null;
  status: QuestStatus;
  brief_attachment_url: string | null;
  detail_completed: boolean;
  detail_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  quest_id: string;
  file_url: string;
  file_type: string | null;
  uploaded_by: string; // uuid of User
  uploaded_at: string;
}

export interface PointLog {
  id: string;
  user_id: string;
  quest_id: string | null;
  delta: number;
  reason: string | null;
  created_at: string;
}

export interface QuestComment {
  id: string;
  quest_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

