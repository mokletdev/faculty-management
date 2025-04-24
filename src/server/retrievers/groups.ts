import { db } from "../db";

export const getGoogleGroup = async () => {
  const group = await db.googleGroupShareable.findFirst();

  if (!group) {
    throw new Error("No Google Group configured");
  }

  return group;
};
