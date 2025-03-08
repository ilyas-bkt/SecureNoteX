import express from "express";
import { verifySession } from "../tools/sessionManager";
import { db } from "../server";

export const bodyRouter = express.Router();

bodyRouter.get("/:noteId", async (req, res) => {
  try {
    if (!req.params.noteId.length) throw new Error("Empty field");
    const sessionFound = await verifySession(req.cookies.sessionId);

    const noteFound = await db.note.findUnique({
      where: {
        userId: sessionFound.userId,
        noteId: req.params.noteId,
      },
    });
    if (!noteFound) throw new Error("Ressource not found");

    res.status(200).json({ body: noteFound.body });
    console.log("[DB] Note body sent successfully");
  } catch (error) {
    console.log(`[DB] Failed to send data. ${error}`);
    res.sendStatus(400);
  }
});

bodyRouter.patch("/:noteId", async (req, res) => {
  try {
    if (!req.params.noteId.length) throw new Error("Empty field");
    const sessionFound = await verifySession(req.cookies.sessionId);

    const noteFound = await db.note.update({
      where: {
        userId: sessionFound.userId,
        noteId: req.params.noteId,
      },
      data: {
        body: req.body.noteBody,
        modifiedAt: new Date(),
      },
    });

    if (!noteFound) throw new Error("Ressource not found");

    res.sendStatus(200);
    console.log("[DB] Note body modified successfully");
  } catch (error) {
    console.log(`[DB] Unable to update body note. ${error}`);
    res.sendStatus(400);
  }
});
