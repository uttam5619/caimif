"use client";

import React, { useState } from "react";
import RecordDetailModal from "./RecordDetailModal";
import ResearchDomainCard from "./ResearchDomainCard";
import type { DetailModalField, ResearchDomainPageItem } from "./types";

interface ResearchDomainsGridClientProps {
  items: ResearchDomainPageItem[];
}

/**
 * Builds the non-image attribute list for the selected `ResearchDomain` record.
 */
function buildDomainDetailFields(
  domain: ResearchDomainPageItem
): DetailModalField[] {
  const fields: DetailModalField[] = [
    { key: "title", label: "TITLE", value: domain.title },
    {
      key: "shortDescription",
      label: "SHORT DESCRIPTION",
      value: domain.shortDescription,
    },
    { key: "description", label: "DESCRIPTION", value: domain.description },
  ];

  for (const customField of domain.customFields) {
    fields.push({
      key: `custom-${customField.label}`,
      label: customField.label,
      value: customField.value,
      isWeblink: customField.isUrl,
    });
  }

  return fields;
}

/**
 * ResearchDomainsGridClient Component
 *
 * Renders clickable `ResearchDomainCard` items in a responsive grid and opens
 * `RecordDetailModal` outside card transform boundaries to show every non-image
 * attribute of the clicked Research Domain.
 */
export default function ResearchDomainsGridClient({
  items,
}: ResearchDomainsGridClientProps) {
  const [selectedDomain, setSelectedDomain] =
    useState<ResearchDomainPageItem | null>(null);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {items.map((domain) => (
          <ResearchDomainCard
            key={domain.id}
            domain={domain}
            onSelect={setSelectedDomain}
          />
        ))}
      </div>

      <RecordDetailModal
        isOpen={Boolean(selectedDomain)}
        badgeLabel="Research Domain"
        title={selectedDomain?.title ?? "Research Domain"}
        fields={selectedDomain ? buildDomainDetailFields(selectedDomain) : []}
        onClose={() => setSelectedDomain(null)}
      />
    </>
  );
}
