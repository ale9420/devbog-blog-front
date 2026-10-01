import { randomUUID } from "crypto";
import { sendConfirmationEmail } from "../../utils/email";
import { createSubscriber, deleteSubscriber, findSubscriber, newUnsubscribeToken } from "../../utils/subscribers";
import { newsletterLanguage } from "~/helpers/newsletter";
import type { SubscribeRequest, SubscribeResponse } from "~/interfaces/newsletter";

export default defineEventHandler(async (event): Promise<SubscribeResponse> => {
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

  const email = body.email.toLowerCase();
  const existing = await findSubscriber("email", email);
  if (existing) {
    if (existing.confirmed) {
      throw createError({
        statusCode: 409,
        statusMessage: "Email already subscribed",
      });
    }

    await deleteSubscriber(existing.documentId);
  }

  const confirmationToken = randomUUID();
  const language = newsletterLanguage(body.locale);

  try {
    await createSubscriber({
      email,
      confirmationToken,
      unsubscribeToken: newUnsubscribeToken(),
      confirmed: false,
      language,
    });

    await sendConfirmationEmail(email, confirmationToken, language);

    return {
      success: true,
      message:
        language === "es"
          ? "Revisa tu correo para confirmar la suscripción"
          : "Check your email to confirm subscription",
    };
  } catch (error: unknown) {
    console.error("Newsletter subscription error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        language === "es"
          ? "Error al procesar la suscripción"
          : "Error processing subscription",
    });
  }
});
