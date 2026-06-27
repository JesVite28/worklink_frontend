export type AdminEntityStatus = "active" | "pending" | "inactive" | "draft";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountType: string;
  status: AdminEntityStatus;
  createdAt: string;
  avatar?: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  sector: string;
  location: string;
  jobsOpen: number;
  status: AdminEntityStatus;
  createdAt: string;
  avatar?: string;
}

export interface AdminFreelancer {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  status: AdminEntityStatus;
  createdAt: string;
  avatar?: string;
}

export interface AdminVacancy {
  id: string;
  title: string;
  company: string;
  category: string;
  applications: number;
  status: AdminEntityStatus;
  postedAt: string;
}

export interface AdminServiceItem {
  id: string;
  title: string;
  category: string;
  provider: string;
  requests: number;
  price: string;
  status: AdminEntityStatus;
}

export interface AdminRequestItem {
  id: string;
  subject: string;
  requester: string;
  type: string;
  priority: "high" | "medium" | "low";
  status: AdminEntityStatus;
  createdAt: string;
}

export interface AdminChatItem {
  id: string;
  participants: string;
  preview: string;
  unreadMessages: number;
  status: AdminEntityStatus;
  updatedAt: string;
}

export interface AdminReviewItem {
  id: string;
  author: string;
  subject: string;
  rating: number;
  comment: string;
  status: AdminEntityStatus;
  createdAt: string;
}

export interface AdminReportItem {
  id: string;
  title: string;
  category: string;
  value: string;
  status: AdminEntityStatus;
  updatedAt: string;
}

export interface AdminSettingItem {
  id: string;
  name: string;
  description: string;
  value: string;
  status: AdminEntityStatus;
}

export type AdminEntityCollection =
  | AdminUser
  | AdminCompany
  | AdminFreelancer
  | AdminVacancy
  | AdminServiceItem
  | AdminRequestItem
  | AdminChatItem
  | AdminReviewItem
  | AdminReportItem
  | AdminSettingItem;