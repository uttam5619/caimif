"use client";

import React, { useEffect, useRef, useState } from "react";
import { createTeamMember } from "@/lib/api/team.api";
import StringListField, { mergeListItems } from "./StringListField";
import { TEAM_CATEGORY_OPTIONS } from "./team.data";
import type {
  AddMemberFormProps,
  TeamCategory,
  TeamMemberRecord,
} from "./types";

/**
 * AddMemberForm Component
 *
 * Collects all attributes synchronized with `Team` in `prisma/models/team.prisma`:
 * - category (required TeamCategory enum)
 * - name (required String)
 * - designation (optional String?)
 * - about (optional String? @db.Text)
 * - school (optional String?)
 * - department (optional String?)
 * - email (optional String? @unique)
 * - qualification (optional String? @db.Text)
 * - specializations (optional Json? string array)
 * - certifications (optional Json? string array)
 * - areaOfInterest (optional String? @db.Text)
 * - image (optional photo file persisted as S3 `imageKey`)
 *
 * `id`, `createdAt`, and `updatedAt` are auto-generated on the backend.
 */
export default function AddMemberForm({
  onSubmitMember,
  onSuccess,
}: AddMemberFormProps = {}) {
  const [category, setCategory] = useState<TeamCategory>("PROFESSOR");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [qualification, setQualification] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [about, setAbout] = useState("");

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specializationDraft, setSpecializationDraft] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certificationDraft, setCertificationDraft] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Revoke any active object URL when the form unmounts to avoid memory leaks
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

    if (file && file.type.startsWith("image/")) {
      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);
    }

    setImageFile(file);
  };

  const handleRemoveFile = () => {
    revokePreview();
    setImageFile(null);
  };

  const resetForm = () => {
    setCategory("PROFESSOR");
    setName("");
    setDesignation("");
    setEmail("");
    setSchool("");
    setDepartment("");
    setQualification("");
    setAreaOfInterest("");
    setAbout("");
    setSpecializations([]);
    setSpecializationDraft("");
    setCertifications([]);
    setCertificationDraft("");
    handleRemoveFile();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMsg("Please enter the team member's full name.");
      return;
    }

    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Merge any pending un-committed text in tag inputs so users never lose typed entries on submit
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
    payload.append("name", cleanName);
    if (designation.trim()) payload.append("designation", designation.trim());
    if (cleanEmail) payload.append("email", cleanEmail);
    if (school.trim()) payload.append("school", school.trim());
    if (department.trim()) payload.append("department", department.trim());
    if (qualification.trim()) {
      payload.append("qualification", qualification.trim());
    }
    if (areaOfInterest.trim()) {
      payload.append("areaOfInterest", areaOfInterest.trim());
    }
    if (about.trim()) payload.append("about", about.trim());
    if (finalSpecializations.length > 0) {
      payload.append("specializations", JSON.stringify(finalSpecializations));
    }
    if (finalCertifications.length > 0) {
      payload.append("certifications", JSON.stringify(finalCertifications));
    }
    if (imageFile) {
      payload.append("image", imageFile);
    }

    setIsLoading(true);
    try {
      const created: TeamMemberRecord = onSubmitMember
        ? await onSubmitMember(payload)
        : await createTeamMember(payload);

      resetForm();
      setSuccessMsg("Team member added successfully.");

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add team member.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  const textareaClass = `${inputClass} resize-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`;

  const labelClass =
    "block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5";

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Add Member
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Register a CAIMIF leadership member, faculty professor, PhD scholar, or alumni profile.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Category & Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-category" className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="team-category"
              required
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
            <label htmlFor="team-name" className={labelClass}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="team-name"
              type="text"
              maxLength={191}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dr. Ananya Mukherjee"
              className={inputClass}
            />
          </div>
        </div>

        {/* Designation & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-designation" className={labelClass}>
              Designation
            </label>
            <input
              id="team-designation"
              type="text"
              maxLength={191}
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g., Faculty In-Charge & Convener"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="team-email" className={labelClass}>
              Email
            </label>
            <input
              id="team-email"
              type="email"
              maxLength={191}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., member@sharda.ac.in"
              className={inputClass}
            />
          </div>
        </div>

        {/* School & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-school" className={labelClass}>
              School
            </label>
            <input
              id="team-school"
              type="text"
              maxLength={191}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., School of Engineering & Technology"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="team-department" className={labelClass}>
              Department
            </label>
            <input
              id="team-department"
              type="text"
              maxLength={191}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science & Engineering"
              className={inputClass}
            />
          </div>
        </div>

        {/* Qualification & Area of Interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="team-qualification" className={labelClass}>
              Qualification
            </label>
            <textarea
              id="team-qualification"
              rows={2}
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g., Ph.D. (IIT Delhi), M.Tech"
              className={textareaClass}
            />
          </div>

          <div>
            <label htmlFor="team-area-of-interest" className={labelClass}>
              Area of Interest
            </label>
            <textarea
              id="team-area-of-interest"
              rows={2}
              value={areaOfInterest}
              onChange={(e) => setAreaOfInterest(e.target.value)}
              placeholder="e.g., Electron Microscopy, Thin Films, Nano-characterization"
              className={textareaClass}
            />
          </div>
        </div>

        {/* About */}
        <div>
          <label htmlFor="team-about" className={labelClass}>
            About
          </label>
          <textarea
            id="team-about"
            rows={3}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Short biography, academic background, or facility responsibilities..."
            className={textareaClass}
          />
        </div>

        {/* Specializations & Certifications (Json? string arrays) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StringListField
            id="team-specializations"
            label="Specialization"
            hint="Type a specialization and press Enter or Add"
            items={specializations}
            draftValue={specializationDraft}
            onDraftChange={setSpecializationDraft}
            onItemsChange={setSpecializations}
          />

          <StringListField
            id="team-certifications"
            label="Certifications"
            hint="Type a certification and press Enter or Add"
            items={certifications}
            draftValue={certificationDraft}
            onDraftChange={setCertificationDraft}
            onItemsChange={setCertifications}
          />
        </div>

        {/* Photo Upload (imageKey) */}
        <div>
          <label htmlFor="team-image" className={labelClass}>
            Member Photo
          </label>
          {imageFile ? (
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt="Member photo preview"
                  className="h-16 w-16 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-200/70 text-lg dark:bg-zinc-700">
                  👤
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate block">
                  {imageFile.name}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  {(imageFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <label
              htmlFor="team-image"
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-6 cursor-pointer hover:border-[#172554] dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-400 transition-colors"
            >
              <span className="text-2xl mb-1">👤</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Click to upload member photo
              </span>
              <span className="text-[10px] text-zinc-400 mt-0.5">
                PNG, JPG, WebP, GIF supported (max 5 MB)
              </span>
              <input
                id="team-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center rounded-xl bg-[#172554] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1e3a8a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
