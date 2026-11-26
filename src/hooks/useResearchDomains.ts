"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminRole } from "@/components/admin/authenticationForm/types";
import { INITIAL_DOMAIN_FIELDS } from "@/components/admin/dashboard/researchDomain/researchDomainFields.data";
import type {
  DomainFieldDefinition,
  HandleFieldFormData,
  ResearchDomain,
} from "@/components/admin/dashboard/researchDomain/types";
import {
  createResearchDomain,
  createResearchDomainField,
  deleteResearchDomain,
  deleteResearchDomainField,
  fetchResearchDomainFields,
  fetchResearchDomains,
  updateResearchDomain,
  updateResearchDomainField,
} from "@/lib/api/researchDomain.api";

/**
 * Custom hook managing persisted Research Domains and dynamic schema fields.
 * Synchronizes all CRUD mutations across Domain List, Register Form, and Field Manager.
 */
export function useResearchDomains(userRole: AdminRole = "SecurityAdmin") {
  const [domains, setDomains] = useState<ResearchDomain[]>([]);
  const [fields, setFields] = useState<DomainFieldDefinition[]>(INITIAL_DOMAIN_FIELDS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Manually refreshes domains and schema fields (used by event handlers like Retry).
   */
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [domainsResult, fieldsResult] = await Promise.allSettled([
        fetchResearchDomains(),
        fetchResearchDomainFields(),
      ]);

      const errors: string[] = [];
      if (domainsResult.status === "fulfilled") {
        setDomains(domainsResult.value);
      } else {
        errors.push(
          domainsResult.reason instanceof Error
            ? domainsResult.reason.message
            : "Unable to load research domains from the server."
        );
      }

      if (fieldsResult.status === "fulfilled") {
        if (fieldsResult.value.length > 0) {
          setFields(fieldsResult.value);
        }
      } else {
        errors.push(
          fieldsResult.reason instanceof Error
            ? fieldsResult.reason.message
            : "Unable to load research domain fields from the server."
        );
      }

      setLoadError(errors.length > 0 ? errors[0] : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial mount fetch: all setState calls happen asynchronously after await
  useEffect(() => {
    let isCancelled = false;

    async function loadInitial() {
      try {
        const [domainsResult, fieldsResult] = await Promise.allSettled([
          fetchResearchDomains(),
          fetchResearchDomainFields(),
        ]);
        if (isCancelled) return;

        const errors: string[] = [];
        if (domainsResult.status === "fulfilled") {
          setDomains(domainsResult.value);
        } else {
          errors.push(
            domainsResult.reason instanceof Error
              ? domainsResult.reason.message
              : "Unable to load research domains from the server."
          );
        }

        if (fieldsResult.status === "fulfilled") {
          if (fieldsResult.value.length > 0) {
            setFields(fieldsResult.value);
          }
        } else {
          errors.push(
            fieldsResult.reason instanceof Error
              ? fieldsResult.reason.message
              : "Unable to load research domain fields from the server."
          );
        }

        setLoadError(errors.length > 0 ? errors[0] : null);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadInitial();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleCreateDomain = useCallback(
    async (formData: FormData): Promise<ResearchDomain> => {
      const created = await createResearchDomain(formData, userRole);
      setDomains((prev) => [created, ...prev]);
      return created;
    },
    [userRole]
  );

  const handleUpdateDomain = useCallback(
    async (domainId: string, formData: FormData): Promise<ResearchDomain> => {
      const updated = await updateResearchDomain(domainId, formData, userRole);
      setDomains((prev) =>
        prev.map((domain) => (domain.id === updated.id ? updated : domain))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteDomain = useCallback(
    async (domainId: string): Promise<void> => {
      await deleteResearchDomain(domainId, userRole);
      setDomains((prev) => prev.filter((domain) => domain.id !== domainId));
    },
    [userRole]
  );

  const handleCreateField = useCallback(
    async (fieldData: HandleFieldFormData): Promise<DomainFieldDefinition> => {
      const created = await createResearchDomainField(fieldData, userRole);
      setFields((prev) => [...prev, created]);
      return created;
    },
    [userRole]
  );

  const handleUpdateField = useCallback(
    async (
      fieldId: string,
      fieldData: HandleFieldFormData
    ): Promise<DomainFieldDefinition> => {
      const updated = await updateResearchDomainField(fieldId, fieldData, userRole);
      setFields((prev) =>
        prev.map((field) => (field.id === updated.id ? updated : field))
      );
      return updated;
    },
    [userRole]
  );

  const handleDeleteField = useCallback(
    async (fieldId: string): Promise<void> => {
      await deleteResearchDomainField(fieldId, userRole);
      setFields((prev) => prev.filter((field) => field.id !== fieldId));
    },
    [userRole]
  );

  return {
    domains,
    fields,
    setFields,
    isLoading,
    loadError,
    refreshAll,
    createDomain: handleCreateDomain,
    updateDomain: handleUpdateDomain,
    deleteDomain: handleDeleteDomain,
    createField: handleCreateField,
    updateField: handleUpdateField,
    deleteField: handleDeleteField,
  };
}
