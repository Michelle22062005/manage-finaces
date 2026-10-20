export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function api<T>(path: string, opts: RequestInit = {}, token?: string | null): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Error");
  return data as T;
}