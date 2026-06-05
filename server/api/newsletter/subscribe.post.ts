import qs from 'qs';
import { randomUUID } from "crypto";
import { sendConfirmationEmail } from "../../utils/email";
import type { SubscribeRequest, SubscribeResponse } from "~/interfaces/newsletter";

export default defineEventHandler(async (event): Promise<SubscribeResponse> => {
  const config = useRuntimeConfig();
  const body = await readBody<SubscribeRequest>(event);

  if (!body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email format",
    });
  }

  const subscriberParams = qs.stringify({
    filters: {
      email: {
        $eq: body.email.toLowerCase(),
      },
    },
  });

  const existingSubscriber = await $fetch<{ data: any[] }>(
    `${config.public.strapiUrl}/api/subscribers?${subscriberParams}`,
    {
      headers: {
        Authorization: `Bearer ${config.strapiApiToken}`,
      },
    },
  );

  if (existingSubscriber.data && existingSubscriber.data.length > 0) {
    const subscriber = existingSubscriber.data[0];
    if (subscriber.confirmed) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email already subscribed",
      });
    }

    await $fetch(`${config.public.strapiUrl}/api/subscribers/${subscriber.documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.strapiApiToken}`,
      },
    });
  }

  const confirmationToken = randomUUID();
  const locale = body.locale || "en";

  try {
    await $fetch(`${config.public.strapiUrl}/api/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.strapiApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          email: body.email.toLowerCase(),
          confirmationToken,
          confirmed: false,
          locale,
        },
      }),
    });

    await sendConfirmationEmail(body.email, confirmationToken, locale);

    return {
      success: true,
      message:
        locale === "es"
          ? "Revisa tu correo para confirmar la suscripción"
          : "Check your email to confirm subscription",
    };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        locale === "es"
          ? "Error al procesar la suscripción"
          : "Error processing subscription",
    });
  }
});
