export const validateUUID = (uuid: string | null | undefined): boolean => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const ensureValidUUID = (uuid: string | null | undefined, context: string): string => {
  if (!validateUUID(uuid)) {
    throw new Error(`Invalid ${context}: ${uuid}`);
  }
  return uuid;
};