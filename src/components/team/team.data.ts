import { connection } from "next/server";
import { teamService } from "@/server/modules/team/team.service";
import { NotFoundError } from "@/server/utils/errors/AppError";
import type { TeamDto } from "@/server/modules/team/team.types";
import type { TeamMembersDataResult } from "./types";

const MAX_PUBLIC_TEAM_MEMBERS = 500;

/**
 * Fetches all `Team` member records via `teamService` (`teamRepository` -> Prisma)
 * along with resolved S3 profile image URLs for public rendering on `/team`.
 */
export async function getAllTeamMembers(): Promise<TeamMembersDataResult> {
  // Opt into per-request dynamic rendering under Next.js 16 `cacheComponents`.
  await connection();

  try {
    const result = await teamService.listTeamMembers({
      page: 1,
      limit: MAX_PUBLIC_TEAM_MEMBERS,
    });

    return { items: result.items, loadFailed: false };
  } catch (error: unknown) {
    console.warn(
      "[TeamData] Unable to load team members from database:",
      error instanceof Error ? error.message : error
    );
    return { items: [], loadFailed: true };
  }
}

/**
 * Fetches a single `Team` member record by ID for the `/team/[id]` profile page.
 * Returns `null` if the record does not exist.
 */
export async function getTeamMemberById(id: string): Promise<TeamDto | null> {
  await connection();

  try {
    return await teamService.getTeamMemberById(id);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return null;
    }
    console.warn(
      "[TeamData] Unable to load team member profile:",
      id,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
