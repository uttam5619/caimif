import React from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles?: AdminRole[];
}

export interface SidebarUserSummary {
  name: string;
  email: string;
  adminRole: AdminRole;
}

export interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  user?: SidebarUserSummary | null;
  onSignOut?: () => void;
  onSignOutAll?: () => void;
  isSigningOut?: boolean;
}
