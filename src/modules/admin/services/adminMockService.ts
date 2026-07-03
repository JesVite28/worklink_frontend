import type {
  AdminChatItem,
  AdminCompany,
  AdminFreelancer,
  AdminRequestItem,
  AdminReportItem,
  AdminReviewItem,
  AdminServiceItem,
  AdminSettingItem,
  AdminUser,
  AdminVacancy,
} from "../models/adminEntities";
import {
  adminChats,
  adminCompanies,
  adminFreelancers,
  adminRequests,
  adminReports,
  adminReviews,
  adminServices,
  adminSettings,
  adminUsers,
  adminVacancies,
} from "../data/adminMockData";

function resolve<T>(data: T[]) {
  return Promise.resolve(data);
}

export function getAdminUsers(): Promise<AdminUser[]> {
  return resolve(adminUsers);
}

export function getAdminCompanies(): Promise<AdminCompany[]> {
  return resolve(adminCompanies);
}

export function getAdminFreelancers(): Promise<AdminFreelancer[]> {
  return resolve(adminFreelancers);
}

export function getAdminVacancies(): Promise<AdminVacancy[]> {
  return resolve(adminVacancies);
}

export function getAdminServices(): Promise<AdminServiceItem[]> {
  return resolve(adminServices);
}

export function getAdminRequests(): Promise<AdminRequestItem[]> {
  return resolve(adminRequests);
}

export function getAdminChats(): Promise<AdminChatItem[]> {
  return resolve(adminChats);
}

export function getAdminReviews(): Promise<AdminReviewItem[]> {
  return resolve(adminReviews);
}

export function getAdminReports(): Promise<AdminReportItem[]> {
  return resolve(adminReports);
}

export function getAdminSettings(): Promise<AdminSettingItem[]> {
  return resolve(adminSettings);
}