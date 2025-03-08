import express from "express";
import { db } from "../server";
import { verifySession } from "../tools/sessionManager";

export const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    const findNotesStatus = await db.note.findMany({
      where: {
        userId: sessionData.userId,
      },
      select: {
        title: true,
        description: true,
        modifiedAt: true,
        createdAt: true,
        noteId: true,
      },
    });

    res.status(200).json(findNotesStatus);
  } catch (error) {
    console.log(`[DB] Unable to get user notes. ${error}`);
    res.sendStatus(400);
  }
});

noteRouter.post("/", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    const createdNote = await db.note.create({
      data: {
        userId: sessionData.userId,
        title: req.body.title,
        description: req.body.description,
        createdAt: req.body.createdAt,
        modifiedAt: req.body.modifiedAt,
        body: "",
      },
      select: {
        title: true,
        description: true,
        createdAt: true,
        modifiedAt: true,
        noteId: true,
      },
    });
    if (!createdNote) throw new Error("Unable to create a new note");

    res.status(200).json(createdNote);
    console.log("[DB] Note created successfully");
  } catch (error) {
    console.log(`[DB] Error while creating note. ${error}`);
    res.sendStatus(400);
  }
});

noteRouter.patch("/", async (req, res) => {
  try {
    const data: {
      title: string;
      description: string;
      noteId: string;
    } = req.body;
    if (!data.noteId || !data.title || !data.description)
      throw new Error("Empty elements");

    const sessionData = await verifySession(req.cookies.sessionId);

    const noteData = await db.note.findUnique({
      where: {
        userId: sessionData.userId,
        noteId: data.noteId,
      },
    });
    if (!noteData) throw new Error("No such note linked to account");

    const modifiedNote = await db.note.update({
      where: {
        noteId: data.noteId,
      },
      data: {
        title: data.title,
        description: data.description,
        modifiedAt: new Date(),
      },
      select: {
        title: true,
        description: true,
      },
    });
    if (
      modifiedNote.description !== data.description ||
      modifiedNote.title !== data.title
    ) {
      throw new Error("Unable to make changes");
    }

    res.sendStatus(200);
    console.log("[DB] Note modified successfully");
  } catch (error) {
    console.log(`[DB] Failed to modify note. ${error}`);
    res.sendStatus(400);
  }
});

noteRouter.delete("/", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    const deletedNoteStatus = await db.note.delete({
      where: {
        noteId: req.body.noteId,
        user: {
          id: sessionData.userId,
        },
      },
    });

    if (!deletedNoteStatus) throw new Error("Failed to delete note");

    res.sendStatus(200);
    console.log("[DB] Note deleted successfully");
  } catch (error) {
    console.log(`[DB] Failed to delete note. ${error}`);
    res.sendStatus(400);
  }
});
