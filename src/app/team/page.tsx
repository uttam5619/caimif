import React from "react";
import Link from "next/link";

/**
 * Leadership profiles
 */
const LEADERSHIP = [
  {
    name: "Prof. (Dr.) Rajesh K. Sharma",
    role: "Dean of Research & Advisory Chair",
    qualification: "Ph.D. (IIT Delhi), Postdoc (Max Planck)",
    specialization: "Nanotechnology, Advanced Functional Materials, Policy",
    email: "dean.research@sharda.ac.in",
    office: "Room 301, Research Complex",
  },
  {
    name: "Dr. Ananya Mukherjee",
    role: "Faculty In-Charge & Convener",
    qualification: "Ph.D. (IISc Bangalore)",
    specialization: "Electron Microscopy, Thin Films, Structural Physics",
    email: "caimif.incharge@sharda.ac.in",
    office: "CAIMIF Facility Suite 102",
  },
];

/**
 * Technical and scientific officers
 */
const SCIENTIFIC_STAFF = [
  {
    name: "Dr. Vivek Anand",
    role: "Senior Scientific Officer (Microscopy)",
    specialization: "FE-SEM, HR-TEM, Cryo-Preparation, EDS & EELS Mapping",
    qualification: "Ph.D. in Physics",
    email: "vivek.anand@sharda.ac.in",
    office: "Electron Microscopy Bay, Ground Floor",
  },
  {
    name: "Dr. Sunita Bansal",
    role: "Scientific Officer (Diffraction & Crystallography)",
    specialization: "Powder XRD, GIXRD, Rietveld Refinement, Residual Stress",
    qualification: "Ph.D. in Materials Science",
    email: "sunita.bansal@sharda.ac.in",
    office: "Diffraction Lab 104",
  },
  {
    name: "Er. Rohit Mehrotra",
    role: "Technical Officer (Spectroscopy & NMR)",
    specialization: "500 MHz NMR, 2D Correlation NMR, FTIR, Confocal Raman",
    qualification: "M.Tech in Instrumentation",
    email: "rohit.m@sharda.ac.in",
    office: "Spectroscopy Center 106",
  },
  {
    name: "Mr. Deepak S. Rawat",
    role: "Laboratory Engineer (Thermal & Elemental)",
    specialization: "TGA/DSC, ICP-MS trace metal digestions, Vacuum Systems",
    qualification: "M.Sc. in Analytical Chemistry",
    email: "deepak.rawat@sharda.ac.in",
    office: "Thermal Analysis Unit 108",
  },
  {
    name: "Ms. Neha Parashar",
    role: "Facility Technical Assistant",
    specialization: "Sample Preparation, Sputter Coating, Requisition Processing",
    qualification: "B.Tech in Chemical Engineering",
    email: "neha.p@sharda.ac.in",
    office: "Sample Preparation Bay",
  },
  {
    name: "Mr. Alok Chauhan",
    role: "Administrative & Billing Coordinator",
    specialization: "Slot Booking Registrations, Billing Invoices, Academic Approvals",
    qualification: "MBA (Operations)",
    email: "caimif.admin@sharda.ac.in",
    office: "Reception & Administrative Desk",
  },
];

/**
 * Team Page Component
 */
export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Expertise & Governance
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Our Scientific & Technical Team
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-300">
            Meet the faculty directors, certified instrument specialists, and technical engineers
            maintaining precision calibration and supporting your research at CAIMIF.
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Facility Leadership
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg">
                      {leader.name.charAt(leader.name.indexOf(" ") + 1) || "L"}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {leader.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Credentials:{" "}
                    </span>
                    {leader.qualification}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Domain:{" "}
                    </span>
                    {leader.specialization}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                  <span>📍 {leader.office}</span>
                  <a
                    href={`mailto:${leader.email}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {leader.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Officers & Engineers */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Scientific Officers & Technical Engineers
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCIENTIFIC_STAFF.map((staff) => (
              <div
                key={staff.name}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {staff.name}
                  </h3>
                  <span className="mt-1 inline-block text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {staff.role}
                  </span>
                  <p className="mt-3 text-xs text-zinc-500">
                    {staff.qualification}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {staff.specialization}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 space-y-1">
                  <div>📍 {staff.office}</div>
                  <div>
                    ✉️{" "}
                    <a
                      href={`mailto:${staff.email}`}
                      className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                      {staff.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Assistance Callout */}
        <div className="mt-16 rounded-2xl bg-white border border-zinc-200/90 p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Need Assistance with Experimental Design?
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Our scientific staff provides one-on-one consultations regarding sample preparation protocols, appropriate instrument selection, and advanced spectral/image analysis.
            </p>
          </div>
          <Link
            href="/contectus"
            className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition-colors"
          >
            Contact Facility Office
          </Link>
        </div>
      </div>
    </div>
  );
}
