import React from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
}
