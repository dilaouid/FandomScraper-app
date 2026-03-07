/**
 * Single source of truth for API base URL.
 * Same URL is used in dev and prod: set VITE_API_URL to your API URL
 * (e.g. production API URL when running client in dev only).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
