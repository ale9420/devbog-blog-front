import qs from "qs";
import { randomBytes } from "crypto";
import type { Subscriber } from "~/interfaces/newsletter";

type SubscriberField = "email" | "confirmationToken" | "unsubscribeToken";

function subscribersUrl(path = ""): string {
  return `${useRuntimeConfig().public.strapiUrl}/api/subscribers${path}`;
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${useRuntimeConfig().strapiApiToken}` };
}

export function newUnsubscribeToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function findSubscriber(field: SubscriberField, value: string): Promise<Subscriber | null> {
  const params = qs.stringify({
    filters: { [field]: { $eq: value } },
    pagination: { pageSize: 1 },
  });
  const response = await $fetch<{ data: Subscriber[] }>(`${subscribersUrl()}?${params}`, {
    headers: authHeaders(),
  });
  return response.data?.[0] ?? null;
}

export async function createSubscriber(data: Omit<Subscriber, "id" | "documentId" | "createdAt" | "updatedAt">): Promise<void> {
  await $fetch(subscribersUrl(), {
    method: "POST",
    headers: authHeaders(),
    body: { data },
  });
}

export async function updateSubscriber(documentId: string, data: Partial<Subscriber>): Promise<void> {
  await $fetch(subscribersUrl(`/${documentId}`), {
    method: "PUT",
    headers: authHeaders(),
    body: { data },
  });
}

export async function deleteSubscriber(documentId: string): Promise<void> {
  await $fetch(subscribersUrl(`/${documentId}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
}
