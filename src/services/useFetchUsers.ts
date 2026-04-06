import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function useFetchLogInUser() {
  const session = await getServerSession(authOptions);

  // Guard: if no session, return null
  if (!session || !session.user) return null;

  return session.user; // return just the user, not the whole session
}