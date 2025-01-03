export const validateUUID = (id: string | null | undefined): boolean => {
  if (!id) return false;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
};

export const ensureValidUUID = (id: string | null | undefined, fieldName: string): string => {
  if (!id || !validateUUID(id)) {
    throw new Error(`Invalid or missing ${fieldName}`);
  }
  return id;
};