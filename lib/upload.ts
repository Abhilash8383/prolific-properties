// Leave room for multipart fields below Vercel's 4.5 MB function request limit.
export const MAX_UPLOAD_BYTES = 3_500_000;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function isAcceptedImageType(type: string) {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type);
}
