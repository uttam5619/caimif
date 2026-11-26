/**
 * Allowed administrative access roles for the CAIMIF portal.
 */
export type AdminRole = "SecurityAdmin" | "SubAdmin";

/**
 * Credential payload transmitted to the backend authentication endpoint.
 */
export interface AdminAuthPayload {
  role: AdminRole;
  email: string;
  password: string;
}

/**
 * Props for the AuthenticationForm component.
 */
export interface AuthenticationFormProps {
  /**
   * Pre-selected role on initial render.
   * @default "SecurityAdmin"
   */
  defaultRole?: AdminRole;

  /**
   * Target endpoint to submit authentication credentials to.
   * Defaults to "#" until a backend route is provided.
   * @default "#"
   */
  endpoint?: string;
}
