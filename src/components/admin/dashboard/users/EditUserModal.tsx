"use client";

import React, { useState } from "react";
import type {
  AdminAccountStatus,
  AdminDbRole,
  AdminUserRecord,
  EditUserModalProps,
  UpdateAdminUserPayload,
} from "./types";

interface EditUserFormInnerProps {
  user: AdminUserRecord;
  isSelf: boolean;
  onClose: () => void;
  onSave: (
    userId: string,
    payload: UpdateAdminUserPayload
  ) => Promise<void> | void;
}

function EditUserFormInner({
  user,
  isSelf,
  onClose,
  onSave,
}: EditUserFormInnerProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<AdminDbRole>(user.role);
  const [status, setStatus] = useState<AdminAccountStatus>(user.status);
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      setErrorMsg("Full name must be at least 2 characters.");
      return;
    }

    if (!cleanEmail) {
      setErrorMsg("Email address cannot be empty.");
      return;
    }

    if (password.length > 0 && password.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    const payload: UpdateAdminUserPayload = {};
    if (cleanName !== user.name) {
      payload.name = cleanName;
    }
    if (cleanEmail !== user.email) {
      payload.email = cleanEmail;
    }
    if (!isSelf && role !== user.role) {
      payload.role = role;
    }
    if (!isSelf && status !== user.status) {
      payload.status = status;
    }
    if (password.length > 0) {
      payload.password = password;
    }

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      await onSave(user.id, payload);
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Failed to update user account."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="edit-user-name" className={labelClass}>
          Full Name
        </label>
        <input
          id="edit-user-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-user-email" className={labelClass}>
          Email Address
        </label>
        <input
          id="edit-user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="edit-user-role" className={labelClass}>
            Role
          </label>
          <select
            id="edit-user-role"
            disabled={isSelf}
            value={role}
            onChange={(e) => setRole(e.target.value as AdminDbRole)}
            className={inputClass}
          >
            <option value="SECURITY_ADMIN">Security Admin</option>
            <option value="SUB_ADMIN">Sub Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="edit-user-status" className={labelClass}>
            Account Status
          </label>
          <select
            id="edit-user-status"
            disabled={isSelf}
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminAccountStatus)}
            className={inputClass}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="edit-user-password" className={labelClass}>
          New Password{" "}
          <span className="font-normal text-zinc-400">
            (leave blank to keep current password)
          </span>
        </label>
        <input
          id="edit-user-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          className={inputClass}
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#172554] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a] disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

/**
 * EditUserModal Component
 *
 * SecurityAdmin-only modal for editing an admin user's name, email, role, status,
 * and resetting their password (Argon2id hashed server-side with automatic session revocation).
 */
export default function EditUserModal({
  isOpen,
  user,
  currentUserId,
  onClose,
  onSave,
}: EditUserModalProps) {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <h3
            id="edit-user-modal-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100"
          >
            Edit Admin User
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit user modal"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <EditUserFormInner
          key={user.id}
          user={user}
          isSelf={user.id === currentUserId}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
