import { PRODUCTION, SESSION_TIMEOUT_HOURS } from "./../server";
import express from "express";
import { db } from "../server";
import argon2 from "argon2";
import { webcrypto } from "node:crypto";
import verifySession from "../tools/verifySession";

export const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    const userData = await db.user.findUnique({
      where: {
        id: sessionData.userId,
      },
      select: {
        firstname: true,
        lastname: true,
        username: true,
      },
    });

    if (!userData) throw new Error("Unable to get user data");

    res.status(200).json(userData);
  } catch (error) {
    console.log(`[DB] Failed to verify session. ${error}`);
    res.sendStatus(400);
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const userData: {
      firstname: string;
      lastname: string;
      username: string;
      password: string;
    } = req.body;

    if (!userData) throw new Error("Empty field");

    const userCreated = await db.user.create({
      data: {
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        password: await argon2.hash(userData.password),
      },
    });
    console.log(JSON.stringify(userCreated));
    if (!userCreated) throw new Error("Username already used");

    res.sendStatus(200);
    console.log("[DB] New user created.");
  } catch (error) {
    if (String(error).includes("User_username_key")) {
      res.sendStatus(500);
      console.log(
        `[DB] Failed to create a new user. Error: Username already used`
      );
    } else {
      res.sendStatus(400);
      console.log(`[DB] Failed to create a new user. ${error}`);
    }
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const userFound = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!userFound) throw new Error("Username not found");

    if (!(await argon2.verify(userFound.password, req.body.password)))
      throw new Error("Wrong password");

    const generatedSessionId = Buffer.from(
      webcrypto.getRandomValues(new Uint8Array(32))
    ).toString("hex");

    const sessionCreated = await db.session.create({
      data: {
        sessionId: generatedSessionId,
        userId: userFound.id,
        expireAt: new Date(Date.now() + SESSION_TIMEOUT_HOURS * 60 * 60 * 1000),
      },
    });

    if (!sessionCreated) throw new Error("Failed to create session");
    res
      .cookie("sessionId", sessionCreated.sessionId, {
        secure: PRODUCTION,
        httpOnly: true,
        sameSite: PRODUCTION ? "strict" : "lax",
        maxAge: SESSION_TIMEOUT_HOURS * 60 * 60 * 1000,
      })
      .sendStatus(200);
    console.log("[DB] Session created successfully.");
  } catch (error) {
    console.log(`[DB] Failed to connect user. ${error}`);
    res.sendStatus(400);
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    if (!sessionData) {
      res.clearCookie("sessionId").sendStatus(200);
      return;
    }

    const deletedSession = await db.session.delete({
      where: {
        sessionId: req.cookies.sessionId,
      },
    });

    if (!deletedSession) throw new Error("Session is not deleted in database");

    res.clearCookie("sessionId").sendStatus(200);
    console.log("[DB] Session deleted successfully.");
  } catch (error) {
    res.sendStatus(400);
    console.log(`[DB] Failed to delete session. ${error}`);
  }
});

userRouter.post("/session", async (req, res) => {
  try {
    const sessionData = await verifySession(req.cookies.sessionId);

    if (sessionData.expireAt < new Date()) {
      await db.session.delete({
        where: {
          sessionId: sessionData.sessionId,
        },
      });

      throw new Error("Session expired");
    }

    const sessionUpdated = await db.session.update({
      where: {
        sessionId: sessionData.sessionId,
      },
      data: {
        expireAt: new Date(Date.now() + SESSION_TIMEOUT_HOURS * 60 * 60 * 1000),
      },
    });

    if (!sessionUpdated) throw new Error("Couldn't refresh session");

    res
      .cookie("sessionId", sessionData.sessionId, {
        secure: PRODUCTION,
        httpOnly: true,
        sameSite: PRODUCTION ? "strict" : "lax",
        maxAge: SESSION_TIMEOUT_HOURS * 60 * 60 * 1000,
      })
      .sendStatus(200);
  } catch (error) {
    console.log(`[DB] Failed to verify session. ${error}`);
    res.sendStatus(400);
  }
});
