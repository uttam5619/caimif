"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentArea from "@/components/admin/dashboard/contentArea/ContentArea";
import Sidebar from "@/components/admin/dashboard/sidebar/Sidebar";
import type { AdminUserRecord } from "@/components/admin/dashboard/users/types";
import {
  fetchCurrentUser,
  logoutAllDeviceSessions,
  logoutCurrentSession,
} from "@/lib/api/auth.api";

/**
 * Admin Dashboard Page
 *
 * Verifies live authenticated session via `GET /api/auth/me` (with automatic
 * silent 401 refresh rotation), passes authoritative RBAC role (`SecurityAdmin` | `SubAdmin`)
 * to `Sidebar` and `ContentArea`, and wires single-device & all-device sign out.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("research-domains");
  const [currentUser, setCurrentUser] = useState<AdminUserRecord | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadVerifiedSession() {
      try {
        const result = await fetchCurrentUser();
        if (!isCancelled) {
          setCurrentUser(result.user);
        }
      } catch {
        if (!isCancelled) {
          router.replace("/admin?redirect=/admin/dashboard");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingSession(false);
        }
      }
    }

    void loadVerifiedSession();
    return () => {
      isCancelled = true;
    };
  }, [router]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logoutCurrentSession();
    } catch {
      // Redirect even if cookie cleanup already cleared client state
    } finally {
      router.replace("/admin");
      router.refresh();
    }
  };

  const handleSignOutAll = async () => {
    setIsSigningOut(true);
    try {
      await logoutAllDeviceSessions();
    } catch {
      // Redirect even on session expiry
    } finally {
      router.replace("/admin");
      router.refresh();
    }
  };

  if (isLoadingSession || !currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-xs font-medium text-zinc-500 animate-pulse">
          Loading authenticated admin workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Left Section: Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={{
          name: currentUser.name,
          email: currentUser.email,
          adminRole: currentUser.adminRole,
        }}
        onSignOut={handleSignOut}
        onSignOutAll={handleSignOutAll}
        isSigningOut={isSigningOut}
      />

      {/* Right Section: ContentArea */}
      <ContentArea
        activeTab={activeTab}
        userRole={currentUser.adminRole}
        currentUserId={currentUser.id}
      />
    </div>
  );
}
