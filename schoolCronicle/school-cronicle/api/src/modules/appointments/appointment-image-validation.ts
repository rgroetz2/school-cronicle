export const APPOINTMENT_IMAGE_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const APPOINTMENT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export function estimateDataUrlPayloadBytes(dataUrl: string): number {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex < 0) {
    return Number.POSITIVE_INFINITY;
  }

  const payload = dataUrl.slice(commaIndex + 1).trim();
  if (!payload) {
    return Number.POSITIVE_INFINITY;
  }

  const normalized = payload.replace(/=+$/, '');
  return Math.ceil((normalized.length * 3) / 4);
}
