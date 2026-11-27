"use client";

import React, { useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import DeleteConfirmModal from "@/components/admin/dashboard/researchDomain/DeleteConfirmModal";
import SearchBar from "@/components/common/SearchBar";
import {
  createAdminUser,
  deleteAdminUser,
  fetchAdminUsers,
  updateAdminUser,
} from "@/lib/api/auth.api";
import EditUserModal from "./EditUserModal";
import type {
  AdminAccountStatus,
  AdminDbRole,
  AdminUserRecord,
  UpdateAdminUserPayload,
} from "./types";

export interface UsersViewProps {
  userRole?: AdminRole;
  currentUserId?: string;
}

/**
 * SecurityAdmin-only RBAC Users & Access management view.
 * Allows Security Admins to inspect active sessions, provision new SecurityAdmin
 * or SubAdmin accounts (Argon2id-hashed server-side), and suspend/activate users.
 */
export default function UsersView({
  userRole = "SecurityAdmin",
  currentUserId,
}: UsersViewProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(userRole === "SecurityAdmin");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  // Create form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminDbRole>("SUB_ADMIN");
  const [isCreating, setIsCreating] = useState(false);

  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUserRecord | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (userRole !== "SecurityAdmin") {
      return;
    }

    let isCancelled = false;

    async function loadUsers() {
      try {
        const result = await fetchAdminUsers({
          search: search.trim() || undefined,
          page: 1,
          limit: 100,
        });
        if (isCancelled) return;
        setUsers(result.items);
        setErrorMsg(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setErrorMsg(
          error instanceof Error ? error.message : "Failed to load admin users."
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadUsers();
    return () => {
      isCancelled = true;
    };
  }, [search, userRole]);

  if (userRole !== "SecurityAdmin") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
        Access Restricted: Only Security Admin accounts can manage users and roles.
      </div>
    );
  }

  const handleCreateUser = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim() || !password) {
      setFeedback({
        type: "error",
        msg: "Name, email, and password are required.",
      });
      return;
    }

    setIsCreating(true);
    try {
      const created = await createAdminUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        status: "ACTIVE",
      });
      setUsers((prev) => [created, ...prev]);
      setName("");
      setEmail("");
      setPassword("");
      setRole("SUB_ADMIN");
      setFeedback({
        type: "success",
        msg: `Created ${created.adminRole} account for ${created.email}.`,
      });
      setActiveTab("list");
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Failed to create admin user.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (
    target: AdminUserRecord,
    nextStatus: AdminAccountStatus
  ) => {
    setFeedback(null);
    setIsMutating(true);
    try {
      const updated = await updateAdminUser(target.id, { status: nextStatus });
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setFeedback({
        type: "success",
        msg: `${updated.email} is now ${updated.status}.`,
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Unable to update account status.",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleRoleChange = async (
    target: AdminUserRecord,
    nextRole: AdminDbRole
  ) => {
    setFeedback(null);
    setIsMutating(true);
    try {
      const updated = await updateAdminUser(target.id, { role: nextRole });
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setFeedback({
        type: "success",
        msg: `Updated role for ${updated.email} to ${updated.adminRole}.`,
      });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Unable to update account role.",
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsMutating(true);
    try {
      await deleteAdminUser(userToDelete.id);
      setUsers((prev) => prev.filter((item) => item.id !== userToDelete.id));
      setFeedback({
        type: "success",
        msg: `Account ${userToDelete.email} deleted.`,
      });
      setUserToDelete(null);
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        msg:
          error instanceof Error
            ? error.message
            : "Failed to delete admin user.",
      });
      setUserToDelete(null);
    } finally {
      setIsMutating(false);
    }
  };

  const handleSaveUserEdit = async (
    userId: string,
    payload: UpdateAdminUserPayload
  ) => {
    const updated = await updateAdminUser(userId, payload);
    setUsers((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setFeedback({
      type: "success",
      msg: `Updated account details for ${updated.email}.`,
    });
    setEditingUser(null);
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100";

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Users &amp; RBAC Access
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          SecurityAdmin-only portal for managing Security Admin and Sub Admin credentials, status, and active session revocations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "list"
              ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
          }`}
        >
          List of Users ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "add"
              ? "border-[#172554] text-[#172554] dark:border-blue-400 dark:text-blue-300"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
          }`}
        >
          Add Admin User
        </button>
      </div>

      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          <span>{feedback.msg}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {activeTab === "add" ? (
        <div className="w-full rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Register Admin Account
          </h2>
          <form onSubmit={handleCreateUser} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rbac-user-name"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rbac-user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Sanju Tiwari"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="rbac-user-email"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rbac-user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sharda.ac.in"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rbac-user-password"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Password (min 8 chars) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="rbac-user-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password (Argon2id hashed)"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="rbac-user-role"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                >
                  Assigned Role <span className="text-rose-500">*</span>
                </label>
                <select
                  id="rbac-user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminDbRole)}
                  className={inputClass}
                >
                  <option value="SUB_ADMIN">Sub Admin</option>
                  <option value="SECURITY_ADMIN">Security Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-xl bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
              >
                {isCreating ? "Creating Account..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Registered Administrators
              </h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Suspending or deactivating an account immediately revokes its active refresh sessions.
              </p>
            </div>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search name or email..."
              ariaLabel="Search admin users"
            />
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3 animate-pulse">
              <div className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-xs text-zinc-500">
              No administrator accounts found.
            </div>
          ) : (
            <div className="p-5 space-y-3">
              {users.map((item) => {
                const isSelf = item.id === currentUserId;
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-zinc-200/80 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {item.name}
                        </h3>
                        {isSelf && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#172554]">
                            You
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "SUSPENDED"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.email} · {item.activeSessionCount ?? 0} active session
                        {(item.activeSessionCount ?? 0) === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        aria-label={`Role for ${item.email}`}
                        disabled={isMutating || isSelf}
                        value={item.role}
                        onChange={(e) =>
                          void handleRoleChange(
                            item,
                            e.target.value as AdminDbRole
                          )
                        }
                        className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        <option value="SECURITY_ADMIN">Security Admin</option>
                        <option value="SUB_ADMIN">Sub Admin</option>
                      </select>

                      <select
                        aria-label={`Status for ${item.email}`}
                        disabled={isMutating || isSelf}
                        value={item.status}
                        onChange={(e) =>
                          void handleStatusChange(
                            item,
                            e.target.value as AdminAccountStatus
                          )
                        }
                        className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>

                      <button
                        type="button"
                        disabled={isMutating}
                        onClick={() => setEditingUser(item)}
                        className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 cursor-pointer"
                      >
                        Edit
                      </button>

                      {!isSelf && (
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => setUserToDelete(item)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      <EditUserModal
        isOpen={editingUser !== null}
        user={editingUser}
        currentUserId={currentUserId}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUserEdit}
      />

      <DeleteConfirmModal
        isOpen={userToDelete !== null}
        title="Delete Admin Account"
        itemName={userToDelete?.email ?? ""}
        description="This administrator and all associated device sessions will be permanently removed."
        isLoading={isMutating}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isMutating) setUserToDelete(null);
        }}
      />
    </div>
  );
}
