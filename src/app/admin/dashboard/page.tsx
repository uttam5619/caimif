"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/dashboard/sidebar/Sidebar";
import ContentArea from "@/components/admin/dashboard/contentArea/ContentArea";

/**
 * Admin Dashboard Page
 *
 * Structure:
 * - Two distinct sections:
 *   1. Left Section: Sidebar (Navigation for 10 administrative categories)
 *   2. Right Section: ContentArea (Renders the active section form or view)
 * - Zero external scrollbar on container (`h-screen overflow-hidden`).
 */
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("research-domains");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Left Section: Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Right Section: ContentArea */}
      <ContentArea activeTab={activeTab} />
    </div>
  );
}
