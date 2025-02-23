import express from "express";
import { db } from "../server";

export const noteRouter = express.Router();

noteRouter.get("/", async (req, res) => {
  try {
    const findUserStatus = await db.session.findUnique({
      where: {
        sessionId: req.headers.authorization,
      },
    });

    if (!findUserStatus) {
      console.log(
        `[DB] No user found with session ID : ${req.headers.authorization}`
      );
      throw new Error();
    }

    const findNotesStatus = await db.note.findMany({
      where: {
        userId: findUserStatus.userId,
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
  } catch {
    res.sendStatus(400);
  }
});

noteRouter.post("/", async (req, res) => {
  try {
    const findUserStatus = await db.session.findUnique({
      where: {
        sessionId: req.headers.authorization,
      },
    });
    if (!findUserStatus) {
      console.log(
        `[DB] (Creating new note...) No user found with this session ID : ${req.body.sessionId}`
      );
      throw new Error();
    }
    const newNoteStatus = await db.note.create({
      data: {
        userId: findUserStatus.userId,
        title: req.body.title,
        description: req.body.description,
        createdAt: req.body.createdAt,
        modifiedAt: req.body.modifiedAt,
      },
      select: {
        title: true,
        description: true,
        createdAt: true,
        modifiedAt: true,
        noteId: true,
      },
    });

    if (newNoteStatus) {
      console.log(
        `[DB] Created a new note for user ID : ${findUserStatus.userId}`
      );
      res.status(200).json(newNoteStatus);
    } else {
      throw new Error();
    }
  } catch {
    res.sendStatus(400);
  }
});

noteRouter.put("/", () => {
  //... modify note data
});

noteRouter.delete("/", async (req, res) => {
  try {
    const findUserStatus = await db.session.findUnique({
      where: {
        sessionId: req.headers.authorization,
      },
    });

    if (!findUserStatus) {
      console.log(
        `[DB] (Deleting note...) No user found with this session ID : ${req.body.sessionId}`
      );
      throw new Error();
    }

    console.log(req.body.noteId, findUserStatus.userId);

    const deletedNoteStatus = await db.note.delete({
      where: {
        noteId: req.body.noteId,
        user: {
          id: findUserStatus.userId
        }
      },
    });

    if (deletedNoteStatus) {
      console.log(`[DB] Deleted note for user ID : ${findUserStatus.userId}`);
      res.sendStatus(200);
    } else {
      console.log(
        `[DB] No note to delete found with note ID : ${req.body.noteId}`
      );
      throw new Error();
    }
  } catch {
    res.status(400).send();
  }
});
