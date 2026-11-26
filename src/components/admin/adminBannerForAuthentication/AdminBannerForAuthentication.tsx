import React from "react";
import Link from "next/link";

/**
 * AdminBannerForAuthentication Component
 *
 * Responsibilities:
 * - Renders the institutional visual anchor on the left side of the authentication screen.
 * - Styled in CAIMIF brand colors (#172554 Navy Blue & #00191E Dark Teal).
 * - Compact vertical rhythm designed to eliminate vertical scrolling across standard screen resolutions.
 */
export default function AdminBannerForAuthentication() {
  return (
    <div
      className="relative hidden lg:flex h-full flex-col justify-between bg-gradient-to-br from-[#172554] via-blue-950 to-[#00191E] p-8 xl:p-10 text-white overflow-hidden select-none lg:col-span-5 xl:col-span-5"
    >
      {/* Subtle Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Top Branding Section */}
      <div className="relative z-10">
        <Link href="#" className="inline-flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-extrabold text-lg shadow-inner border border-white/20 group-hover:bg-white/20 transition-colors">
            C
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-white block">
              CAIMIF
            </span>
            <span className="text-[10px] font-medium tracking-wide text-blue-200/80 block">
              Sharda University
            </span>
          </div>
        </Link>
      </div>

      {/* Center Institutional & Security Information */}
      <div className="relative z-10 my-auto py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-[11px] font-semibold text-blue-200 backdrop-blur-xs mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Administrative &amp; Security Gateway
        </div>

        <h1 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Center for Artificial Intelligence in Medicine, Imaging &amp; Forensics
        </h1>

        <p className="mt-3 text-xs leading-relaxed text-blue-100/80 max-w-md">
          Authorized management console for facility administrators, security auditors,
          and research lab officers overseeing multi-school AI compute clusters and scientific equipment.
        </p>

        
      </div>

      {/* Bottom Trust & Compliance Indicator */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/60">
        <span>Sharda University Research Division</span>
        <span>SSL 256-Bit Encrypted</span>
      </div>
    </div>
  );
}
