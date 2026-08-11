import { Resend } from "resend";
import type { ReservationInput } from "~/lib/schema";

interface SendArgs {
  reservation: ReservationInput;
  isUpdate: boolean;
}

/**
 * Envía notificación por email al terminar la reserva.
 * Si Resend no está configurado, no-op (útil en dev).
 */
export async function notifyByEmail({
  reservation,
  isUpdate,
}: SendArgs): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.NOTIFY_TO;

  if (!apiKey || !from || !to) {
    console.warn(
      "[email] Resend no configurado (RESEND_API_KEY/RESEND_FROM/NOTIFY_TO). Se omite.",
    );
    return { sent: false, reason: "no-config" };
  }

  const resend = new Resend(apiKey);

  const alergiasCombined = [
    ...reservation.alergiasChips,
    ...(reservation.alergiasOtras ? [reservation.alergiasOtras] : []),
  ]
    .filter(Boolean)
    .join(" · ");

  const subject = isUpdate
    ? `✏️ ${reservation.guestName} actualizó su respuesta`
    : `🎂 ${reservation.guestName} confirmó su menú`;

  const text = [
    `Reserva cumple Víctor · Casa Obdulia`,
    ``,
    `Nombre: ${reservation.guestName}`,
    `Principal: ${reservation.principal}`,
    `Postre: ${reservation.postre}`,
    `Bebida: ${reservation.bebida}`,
    `Alergias/Intolerancias: ${alergiasCombined || "Ninguna"}`,
    reservation.nota ? `Mensaje: ${reservation.nota}` : null,
  ]
    .filter((x) => x !== null)
    .join("\n");

  const html = `
    <div style="font-family:Georgia,serif;color:#241A10;background:#F7EED5;padding:24px;border-radius:12px;max-width:520px;">
      <h2 style="margin:0 0 12px;color:#C24A1E;font-family:Georgia,serif;letter-spacing:.06em;text-transform:uppercase;">
        ${isUpdate ? "Actualización" : "Nueva respuesta"} · Cumple Víctor
      </h2>
      <table style="width:100%;border-collapse:collapse;font-family:Georgia,serif;">
        <tbody>
          ${row("Nombre", reservation.guestName)}
          ${row("Principal", reservation.principal)}
          ${row("Postre", reservation.postre)}
          ${row("Bebida", reservation.bebida)}
          ${row("Alergias", alergiasCombined || "Ninguna")}
          ${reservation.nota ? row("Mensaje", reservation.nota) : ""}
        </tbody>
      </table>
    </div>
  `;

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email] Resend falló:", err);
    return {
      sent: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#7A6749;font-family:monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#241A10;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
