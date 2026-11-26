"use client";

import { useEffect, useRef, useState } from "react";
import type { AdminRole, AdminAuthPayload, AuthenticationFormProps } from "./types";

const ROLES: AdminRole[] = ["SecurityAdmin", "SubAdmin"];

/**
 * AuthenticationForm Component
 *
 * Self-contained administrative authentication interface.
 *
 * PROPS CONTRACT:
 * - defaultRole?: AdminRole - Initial role selection ("SecurityAdmin" | "SubAdmin", default: "SecurityAdmin")
 * - endpoint?: string - Target endpoint to POST credentials to (default: "#")
 *
 * AUTHENTICATION FLOW:
 * - Takes user input ({ role, email, password }) and POSTs to the single `endpoint`.
 * - If successful, completes login.
 * - If rejected, displays error message returned by endpoint.
 */
export default function AuthenticationForm({
  defaultRole = "SecurityAdmin",
  endpoint = "#",
}: AuthenticationFormProps = {}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [role, setRole] = useState<AdminRole>(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Close dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: AdminAuthPayload = {
        role,
        email: email.trim(),
        password,
      };

      if (endpoint && endpoint !== "#") {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Authentication failed. Please verify your credentials."
          );
        }
      } else {
        // Placeholder / development mode (when endpoint is "#")
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-xs focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100";

  return (
    <div className="flex h-full items-center justify-center overflow-hidden bg-white p-6 dark:bg-zinc-950 sm:p-10 lg:p-16 lg:col-span-7 xl:col-span-7">
      <div className="w-full max-w-sm">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin Authentication
        </h2>

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className={`${inputClass} flex items-center justify-between font-medium cursor-pointer`}
            >
              {role}
              <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div
                role="listbox"
                className="absolute z-20 mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
              >
                {ROLES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={role === item}
                    onClick={() => {
                      setRole(item);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      role === item
                        ? "bg-blue-50 font-semibold text-[#172554] dark:bg-blue-950/50 dark:text-blue-300"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Email */}
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          {/* Password */}
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
