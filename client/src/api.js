const DEFAULT_API_BASE = 'https://election-process-education-sy7l.onrender.com';
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/\/+$, '');

export function apiUrl(path) {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return `${API_BASE}${path}`;
}
