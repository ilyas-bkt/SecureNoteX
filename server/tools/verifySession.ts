import { db } from "../server";

export default async function verifySession(sessionId: string) {
  try {
    if (!sessionId || !sessionId.length) throw new Error();
		
    const sessionFound = await db.session.findUnique({
      where: {
        sessionId: sessionId,
      },
    });
    if (!sessionFound) throw new Error();

    return sessionFound;
  } catch {
    throw new Error("Invalid session ID");
  }
}
