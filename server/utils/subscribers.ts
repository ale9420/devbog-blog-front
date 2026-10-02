import qs from "qs";
import { randomBytes } from "crypto";
import type { Subscriber } from "~/interfaces/newsletter";

type SubscriberField = "email" | "confirmationToken" | "unsubscribeToken";

export function newUnsubscribeToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function findSubscriber(field: SubscriberField, value: string): Promise<Subscriber | null> {
  const params = qs.stringify({
    filters: { [field]: { $eq: value } },
    pagination: { pageSize: 1 },
  });
  const response = await strapiFetch<{ data: Subscriber[] }>(`/api/subscribers?${params}`);
  return response.data?.[0] ?? null;
}

export async function createSubscriber(data: Omit<Subscriber, "id" | "documentId" | "createdAt" | "updatedAt">): Promise<void> {
  await strapiFetch("/api/subscribers", {
    method: "POST",
    body: { data },
  });
}

export async function updateSubscriber(documentId: string, data: Partial<Subscriber>): Promise<void> {
  await strapiFetch(`/api/subscribers/${documentId}`, {
    method: "PUT",
    body: { data },
  });
}

export async function deleteSubscriber(documentId: string): Promise<void> {
  await strapiFetch(`/api/subscribers/${documentId}`, { method: "DELETE" });
}
