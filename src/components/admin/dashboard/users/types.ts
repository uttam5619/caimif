import type { AdminRole } from "@/components/admin/authenticationForm/types";

export type AdminDbRole = "SECURITY_ADMIN" | "SUB_ADMIN";
export type AdminAccountStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminDbRole;
  adminRole: AdminRole;
  status: AdminAccountStatus;
  activeSessionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  password: string;
  role: AdminDbRole;
  status?: AdminAccountStatus;
}

export interface UpdateAdminUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: AdminDbRole;
  status?: AdminAccountStatus;
}

export interface EditUserModalProps {
  isOpen: boolean;
  user: AdminUserRecord | null;
  currentUserId?: string;
  onClose: () => void;
  onSave: (
    userId: string,
    payload: UpdateAdminUserPayload
  ) => Promise<void> | void;
}
