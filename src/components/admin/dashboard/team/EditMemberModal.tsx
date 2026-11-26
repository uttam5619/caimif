"use client";

import React, { useEffect, useRef, useState } from "react";
import StringListField, { mergeListItems } from "./StringListField";
import { TEAM_CATEGORY_OPTIONS } from "./team.data";
import type {
  EditMemberModalProps,
  TeamCategory,
  TeamMemberRecord,
} from "./types";

interface EditMemberFormInnerProps {
  member: TeamMemberRecord;
  onClose: () => void;
  onSave: (memberId: string, payload: FormData) => Promise<void> | void;
}

/**
 * Inner form initialized via React `key={member.id}` so local fields reset cleanly
 * whenever a different Team member record is opened for editing.
 */
function EditMemberFormInner({
  member,
  onClose,
  onSave,
}: EditMemberFormInnerProps) {
  const [category, setCategory] = useState<TeamCategory>(member.category);
  const [name, setName] = useState(member.name);
  const [designation, setDesignation] = useState(member.designation ?? "");
  const [email, setEmail] = useState(member.email ?? "");
  const [school, setSchool] = useState(member.school ?? "");
  const [department, setDepartment] = useState(member.department ?? "");
  const [qualification, setQualification] = useState(
    member.qualification ?? ""
  );
  const [areaOfInterest, setAreaOfInterest] = useState(
    member.areaOfInterest ?? ""
  );
  const [about, setAbout] = useState(member.about ?? "");

  const [specializations, setSpecializations] = useState<string[]>(
    member.specializations
  );
  const [specializationDraft, setSpecializationDraft] = useState("");
  const [certifications, setCertifications] = useState<string[]>(
    member.certifications
  );
  const [certificationDraft, setCertificationDraft] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const revokePreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    revokePreview();

    if (file) {
      setRemoveImage(false);
    }

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    }

    setSelectedFile(file);
  };

  const handleClearImage = () => {
    revokePreview();
    setSelectedFile(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();

    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    const finalSpecializations = mergeListItems(
      specializations,
      specializationDraft
    );
    const finalCertifications = mergeListItems(
      certifications,
      certificationDraft
    );

    const payload = new FormData();
    payload.append("category", category);
    if (cleanName) {
      payload.append("name", cleanName);
    }
    payload.append("designation", designation.trim());
    payload.append("email", cleanEmail);
    payload.append("school", school.trim());
    payload.append("department", department.trim());
    payload.append("qualification", qualification.trim());
    payload.append("areaOfInterest", areaOfInterest.trim());
    payload.append("about", about.trim());
    payload.append(
      "specializations",
      finalSpecializations.length > 0
        ? JSON.stringify(finalSpecializations)
        : ""
    );
    payload.append(
      "certifications",
      finalCertifications.length > 0 ? JSON.stringify(finalCertifications) : ""
    );
    if (removeImage) {
      payload.append("removeImage", "true");
    }
    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    setIsSaving(true);
    try {
      await onSave(member.id, payload);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update team member.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-900 transition-colors focus:border-[#172554] focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100 dark:focus:border-blue-400";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1";

  const activePreview =
    previewUrl ?? (removeImage ? undefined : member.imageUrl);

  return (
    <>
      <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3
            id="edit-team-member-title"
            className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight"
          >
            Edit Team Member
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Update profile details for {member.name}.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Close dialog"
          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-lg font-bold p-1 rounded-lg transition-colors cursor-pointer leading-none disabled:opacity-50"
        >
          ✕
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-2.5 text-xs font-medium text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="edit-team-category" className={labelClass}>
              Category
            </label>
            <select
              id="edit-team-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TeamCategory)}
              className={inputClass}
            >
              {TEAM_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-team-name" className={labelClass}>
              Name
            </label>
            <input
              id="edit-team-name"
              type="text"
              maxLength={191}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-team-designation" className={labelClass}>
              Designation
            </label>
            <input
              id="edit-team-designation"
              type="text"
              maxLength={191}
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="edit-team-email" className={labelClass}>
              Email
            </label>
            <input
              id="edit-team-email"
              type="email"
              maxLength={191}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-team-school" className={labelClass}>
              School
            </label>
            <input
              id="edit-team-school"
              type="text"
              maxLength={191}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="edit-team-department" className={labelClass}>
              Department
            </label>
            <input
              id="edit-team-department"
              type="text"
              maxLength={191}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="edit-team-qualification" className={labelClass}>
              Qualification
            </label>
            <textarea
              id="edit-team-qualification"
              rows={2}
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="edit-team-area" className={labelClass}>
              Area of Interest
            </label>
            <textarea
              id="edit-team-area"
              rows={2}
              value={areaOfInterest}
              onChange={(e) => setAreaOfInterest(e.target.value)}
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="edit-team-about" className={labelClass}>
              About
            </label>
            <textarea
              id="edit-team-about"
              rows={2}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className={textareaClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StringListField
            id="edit-team-specializations"
            label="Specialization"
            hint="Add specialization"
            items={specializations}
            draftValue={specializationDraft}
            onDraftChange={setSpecializationDraft}
            onItemsChange={setSpecializations}
          />

          <StringListField
            id="edit-team-certifications"
            label="Certifications"
            hint="Add certification"
            items={certifications}
            draftValue={certificationDraft}
            onDraftChange={setCertificationDraft}
            onItemsChange={setCertifications}
          />
        </div>

        <div>
          <label htmlFor="edit-team-image" className={labelClass}>
            Member Photo
          </label>
          {selectedFile || activePreview ? (
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-2 dark:border-zinc-700 dark:bg-zinc-800/60">
              {activePreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activePreview}
                  alt="Member photo preview"
                  className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/70 text-sm dark:bg-zinc-700">
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-100 truncate block">
                  {selectedFile ? selectedFile.name : "Current profile photo"}
                </span>
                <label
                  htmlFor="edit-team-image"
                  className="text-[11px] font-semibold text-[#172554] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Replace photo
                </label>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 cursor-pointer"
              >
                Remove
              </button>
              <input
                id="edit-team-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <label
              htmlFor="edit-team-image"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-3 py-2.5 text-xs font-medium text-zinc-600 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300"
            >
              <span>Upload Photo</span>
              <input
                id="edit-team-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1e3a8a] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}

/**
 * EditMemberModal Component
 *
 * Compact modal dialog for editing an existing Team member record without scrollbars.
 */
export default function EditMemberModal({
  isOpen,
  member,
  onClose,
  onSave,
}: EditMemberModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-team-member-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <EditMemberFormInner
          key={member.id}
          member={member}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
