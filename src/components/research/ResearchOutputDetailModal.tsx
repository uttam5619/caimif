"use client";

import React from "react";
import RecordDetailModal from "./RecordDetailModal";
import type { DetailModalField, ResearchOutputDetailModalProps } from "./types";

/**
 * ResearchOutputDetailModal Component
 *
 * Maps a selected publication or patent table row into `RecordDetailModal`
 * fields so every database attribute is displayed in full.
 */
export default function ResearchOutputDetailModal({
  categoryLabel,
  columns,
  row,
  onClose,
}: ResearchOutputDetailModalProps) {
  if (!row) {
    return null;
  }

  const detailColumns = columns.filter((col) => col.key !== "serial");
  const titleColumn = detailColumns.find((col) => col.variant === "title");
  const modalTitle = titleColumn
    ? String(row[titleColumn.key] ?? categoryLabel)
    : categoryLabel;

  const fields: DetailModalField[] = detailColumns.map((col) => ({
    key: col.key,
    label: col.header,
    value: row[col.key],
    isWeblink: col.variant === "weblink",
  }));

  return (
    <RecordDetailModal
      isOpen={Boolean(row)}
      badgeLabel={categoryLabel}
      title={modalTitle}
      fields={fields}
      onClose={onClose}
    />
  );
}
