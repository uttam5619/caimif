import React from "react";
import AdminBannerForAuthentication from "@/components/admin/adminBannerForAuthentication/AdminBannerForAuthentication";
import AuthenticationForm from "@/components/admin/authenticationForm/AuthenticationForm";

/**
 * Admin Authentication Page
 *
 * Layout Structure:
 * - Zero vertical or horizontal scrolling on the page (`h-screen overflow-hidden`).
 * - Divided into two columns:
 *   1. Left (lg:col-span-5): Institutional branding banner (`AdminBannerForAuthentication`).
 *   2. Right (lg:col-span-7): Administrative authentication form (`AuthenticationForm`).
 *
 * Backend Integration:
 * - By default, `<AuthenticationForm />` operates with `endpoint="#"`.
 * - When ready to connect to the backend, pass the single authentication endpoint:
 *   `<AuthenticationForm endpoint="/api/admin/login" />`
 */
export default function AdminPage() {
  return (
    <div className="h-screen max-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Left Column: Dedicated Administrative Banner Component */}
      <AdminBannerForAuthentication />

      {/* Right Column: Dedicated Authentication Form Component */}
      <AuthenticationForm endpoint="/api/auth/login" />
    </div>
  );
}
