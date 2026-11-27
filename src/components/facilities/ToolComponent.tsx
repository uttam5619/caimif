"use client";

import React, { useEffect, useMemo, useState } from "react";
import type {
  ToolCategoryRecord,
  ToolRecord,
} from "@/components/admin/dashboard/tool/types";
import { fetchToolCategories, fetchTools } from "@/lib/api/tool.api";
import {
  TOOLS_SECTION_DESCRIPTION,
  TOOLS_SECTION_TITLE,
} from "./facilities.config";
import ListOfTools from "./ListOfTools";
import ToolTypeTabs from "./ToolTypeTabs";

/**
 * ToolComponent
 *
 * Orchestrates live `ToolType` category pill tabs (`ToolTypeTabs`) and the
 * per-category grid of registered software tools (`ListOfTools`) on `/facilities`.
 * Clicking any tool card opens a clean neutral detail dialog showing full notes.
 */
export default function ToolComponent() {
  const [categories, setCategories] = useState<ToolCategoryRecord[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [tools, setTools] = useState<ToolRecord[]>([]);

  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolRecord | null>(null);
  const [reloadNonce, setReloadNonce] = useState<number>(0);

  useEffect(() => {
    let isCancelled = false;

    async function initCategories() {
      try {
        const result = await fetchToolCategories({ page: 1, limit: 100 });
        if (isCancelled) return;

        setCategories(result.items);
        setErrorMessage(null);
        if (result.items.length > 0) {
          const nextId = result.items[0].id;
          setActiveCategoryId((prev) =>
            prev && result.items.some((cat) => cat.id === prev) ? prev : nextId
          );
          setIsLoadingTools(true);
        }
      } catch (error: unknown) {
        if (isCancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load software tool categories."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingCategories(false);
        }
      }
    }

    void initCategories();
    return () => {
      isCancelled = true;
    };
  }, [reloadNonce]);

  useEffect(() => {
    if (!activeCategoryId) {
      return;
    }

    let isCancelled = false;

    async function loadToolsForCategory() {
      try {
        const result = await fetchTools({
          toolTypeId: activeCategoryId,
          page: 1,
          limit: 100,
        });
        if (isCancelled) return;
        setTools(result.items);
        setErrorMessage(null);
      } catch (error: unknown) {
        if (isCancelled) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load tools for the selected category."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingTools(false);
        }
      }
    }

    void loadToolsForCategory();
    return () => {
      isCancelled = true;
    };
  }, [activeCategoryId, reloadNonce]);

  const handleSelectCategory = (categoryId: string) => {
    if (categoryId === activeCategoryId) {
      return;
    }
    setErrorMessage(null);
    setIsLoadingTools(true);
    setActiveCategoryId(categoryId);
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setIsLoadingCategories(true);
    setReloadNonce((prev) => prev + 1);
  };

  const activeCategoryName = useMemo(
    () => categories.find((cat) => cat.id === activeCategoryId)?.name,
    [activeCategoryId, categories]
  );

  return (
    <section
      aria-label="Tools And Softwares"
      className="mx-auto mt-10 w-full max-w-6xl border-t border-zinc-200/80 pt-12 pb-6 dark:border-zinc-800"
    >
      {/* Section Heading & Overview */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172554] dark:text-zinc-50">
          {TOOLS_SECTION_TITLE}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          {TOOLS_SECTION_DESCRIPTION}
        </p>
      </div>

      <ToolTypeTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        isLoading={isLoadingCategories}
        onSelectCategory={handleSelectCategory}
      />

      {errorMessage ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-xl border border-rose-300 px-4 py-1.5 text-xs font-semibold hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/50 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !isLoadingCategories && categories.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            No tool categories have been published yet.
          </p>
        </div>
      ) : (
        <ListOfTools
          tools={tools}
          isLoading={isLoadingCategories || isLoadingTools}
          activeCategoryName={activeCategoryName}
          onSelectTool={setSelectedTool}
        />
      )}

      {/* Tool Detail Modal (on Card Click) */}
      {selectedTool && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="facility-tool-modal-title"
          onClick={() => setSelectedTool(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <span className="inline-flex rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#172554] dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                  {selectedTool.toolType.name}
                </span>
                <h3
                  id="facility-tool-modal-title"
                  className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50"
                >
                  {selectedTool.title}
                </h3>
                <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  VERSION : {selectedTool.version}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTool(null)}
                aria-label="Close tool details modal"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {selectedTool.imageUrl && (
                <div className="flex h-40 w-full items-center justify-center rounded-xl border border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedTool.imageUrl}
                    alt={selectedTool.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Description
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {selectedTool.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
