import qs from 'qs';
import { sendWelcomeEmail } from "../../utils/email";
import type { ConfirmResponse } from "~/interfaces/newsletter";

export default defineEventHandler(async (event): Promise<ConfirmResponse> => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Token is required",
    });
  }

  const subscriberParams = qs.stringify({
    filters: {
      confirmationToken: {
        $eq: token,
      },
    },
    pagination: {
      pageSize: 1,
    },
  });

  const subscribers = await $fetch<{ data: any[] }>(
    `${config.public.strapiUrl}/api/subscribers?${subscriberParams}`,
    {
      headers: {
        Authorization: `Bearer ${config.strapiApiToken}`,
      },
    },
  );

  if (!subscribers.data || subscribers.data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Invalid confirmation token",
    });
  }

  const subscriber = subscribers.data[0];

  if (subscriber.confirmed) {
    throw createError({
      statusCode: 400,
      statusMessage: "Subscription already confirmed",
    });
  }

  try {
    await $fetch(`${config.public.strapiUrl}/api/subscribers/${subscriber.documentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.strapiApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          confirmed: true,
          confirmationToken: null,
        },
      }),
    });

    await sendWelcomeEmail(subscriber.email, subscriber.locale);

    return {
      success: true,
      message:
        subscriber.locale === "es"
          ? "¡Suscripción confirmada! Revisa tu correo para más información."
          : "Subscription confirmed! Check your email for more information.",
    };
  } catch (error: any) {
    console.error("Newsletter confirmation error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        subscriber.locale === "es"
          ? "Error al confirmar la suscripción"
          : "Error confirming subscription",
    });
  }
});
