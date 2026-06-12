export type UserRole = 'guild_master' | 'guild_secretary' | 'quest_giver' | 'adventurer';

export type DifficultyRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type QuestUrgency = 'Routine' | 'Priority' | 'Emergency' | 'Strategic';

export type QuestStatus = 'Draft' | 'ActiveStar' | 'Active' | 'Hold' | 'Submitted' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled' | 'Aborted';

export type DetailStatus = 'Complete' | 'Detail_Kurang' | 'Critical_Missing';

export type AbortCategory = 'Wrong_Direction' | 'Duplicated_Quest' | 'Client_Situation_Changed' | 'Risk_Too_High' | 'No_Longer_Needed' | 'Reassigned' | 'Emergency_Stop' | 'Other';

export interface User {
  id: string;
  nama: string;
  role: UserRole;
  division?: string | null;
  status: string;
  totalPoints: number;
  avatarUrl?: string | null;
  created_at: string;
}

export interface Arc {
  id: string;
  name: string;
  strategic_objective: string | null;
  status: string;
  owner_id: string;
  created_at: string;
}

export interface Project {
  id: string;
  arc_id: string | null;
  name: string;
  classification: string | null;
  status: string;
  health: string;
  start_date: string | null;
  target_date: string | null;
  scope_summary: string | null;
  owner_id: string;
  created_at: string;
}

export interface VaultItem {
  id: string;
  title: string;
  type: string;
  summary: string | null;
  file_url: string;
  visibility: string;
  arc_id: string | null;
  project_id: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  project_id: string | null;
  assignedTo: string | null; // uuid of User
  createdBy: string; // uuid of User
  approver_id: string | null;
  urgency: QuestUrgency;
  difficulty: DifficultyRank | null;
  deadline: string | null;
  success_parameter: string | null;
  rewardPoints: number | null;
  status: QuestStatus;
  detail_status: DetailStatus;
  rejection_reason: string | null;
  hold_reason: string | null;
  held_by_id: string | null;
  hold_date: string | null;
  expected_resume_date: string | null;
  blocking_party: string | null;
  abort_reason: string | null;
  abort_category: AbortCategory | null;
  gm_note: string | null;
  point_treatment: string | null;
  brief_attachment_url: string | null;
  detailCompleted: boolean;
  detail_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  quest_id: string;
  fileUrl: string;
  fileType: string | null;
  uploadedBy: string; // uuid of User
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
  attachment_url: string | null;
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

export interface EmailLog {
  id: string;
  recipient: string;
  email_type: string;
  quest_id: string | null;
  sent_at: string;
  status: string;
  error_message: string | null;
}

