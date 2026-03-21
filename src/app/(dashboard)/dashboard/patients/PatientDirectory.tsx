"use client";

import { useState, useMemo } from "react";

interface PatientRow {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  date_of_birth: string | null;
  insurance_provider: string | null;
  created_at: string;
}

function formatDate(isoStr: string | null): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PatientDirectory({ patients }: { patients: PatientRow[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PatientRow | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.insurance_provider?.toLowerCase().includes(q) ?? false)
    );
  }, [patients, search]);

  const initials = (p: PatientRow) =>
    `${p.first_name[0]}${p.last_name[0]}`.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold font-heading text-neutral-800">
          Patients
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {patients.length} patients in directory
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left: Patient List */}
        <div
          className={`bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden ${
            selected ? "w-[380px] shrink-0" : "flex-1"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-neutral-200">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-md pl-9 pr-3.5 py-2.5 text-sm text-neutral-700
                  placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none
                  transition-colors duration-150"
              />
            </div>
            <p className="mt-2 text-xs text-neutral-400">{filtered.length} patients</p>
          </div>

          {/* Patient rows */}
          <ul className="max-h-[600px] overflow-y-auto divide-y divide-neutral-200">
            {filtered.map((patient) => (
              <li
                key={patient.id}
                onClick={() => setSelected(patient)}
                className={`px-6 py-4 cursor-pointer transition-colors duration-150
                  ${
                    selected?.id === patient.id
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "border-l-4 border-l-transparent hover:bg-neutral-50"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral-700">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{patient.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-neutral-400">Added</p>
                    <p className="text-xs text-neutral-600">{formatDate(patient.created_at)}</p>
                  </div>
                </div>
                {patient.insurance_provider && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-accent/10 text-accent text-[11px] font-semibold">
                      {patient.insurance_provider}
                    </span>
                  </div>
                )}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-neutral-400">
                No patients found
              </li>
            )}
          </ul>
        </div>

        {/* Right: Detail Panel */}
        {selected && (
          <div className="flex-1 bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            {/* Profile header */}
            <div className="px-8 py-6 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold font-heading">
                  {initials(selected)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-heading text-neutral-800">
                    {selected.first_name} {selected.last_name}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {selected.phone}
                    {selected.email && ` · ${selected.email}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 transition-colors"
                aria-label="Close patient detail"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contact info grid */}
            <div className="p-8">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-4">
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: `${selected.first_name} ${selected.last_name}` },
                  { label: "Date of Birth", value: formatDate(selected.date_of_birth) },
                  { label: "Phone", value: selected.phone },
                  { label: "Email", value: selected.email ?? "—" },
                  { label: "Insurance", value: selected.insurance_provider ?? "—" },
                  { label: "Patient Since", value: formatDate(selected.created_at) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-neutral-50 rounded-md p-3 border border-neutral-200"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {item.label}
                    </p>
                    <p className="text-sm text-neutral-700 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
