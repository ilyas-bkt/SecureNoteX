import express from "express";
import { db } from "../server";
import argon2 from "argon2";
import { v4 } from "uuid";

export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  await db.user
    .create({
      data: {
        firstname: req.body.firstname as string,
        lastname: req.body.lastname as string,
        username: req.body.username as string,
        password: (await argon2.hash(req.body.password)) as string,
      },
    })
    .then((data) => {
      res.status(201).send();
      console.log(`[DB] New user created : ${JSON.stringify(data)}`);
    })
    .catch((error: string) => {
      let message = error;
      if (String(error).includes("Unique constraint")) {
        message = "username already exists";
      }
      console.log(`[DB] Failed to create a new user : ${message}`);
      res.status(500).send();
    });
  return;
});

userRouter.post("/login", async (req, res, next) => {
  await db.user
    .findUnique({
      where: {
        username: req.body.username as string,
      },
    })
    .then(async (userData) => {
      if (
        await argon2.verify(userData?.password as string, req.body.password)
      ) {
        const sessionId = v4();

        res.status(202).json({
          username: userData?.username,
          firstname: userData?.firstname,
          lastname: userData?.lastname,
          sessionId: sessionId,
        });
        console.log(
          `[DB] User ${userData?.username} is successfully connected`
        );

        try {
          const sessionData = await db.session.create({
            data: {
              userId: userData?.id as string,
              sessionId: sessionId as string,
              expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          });

          console.log(
            `[DB] New session created : ${JSON.stringify(
              sessionData.sessionId
            )}`
          );
        } catch (error) {
          console.log(`[DB] Error creating session : ${error}`);
        }
      } else {
        res.status(400).send();
      }
    })
    .catch(() => {
      console.log(`[DB] No username (${req.body.username}) in database.`);
      res.status(400).send();
      next();
    });
});

userRouter.post("/logout", async (req, res) => {
  try {
    await db.session.delete({
      where: {
        sessionId: req.body.sessionId,
      },
    });

    res.status(200).send();
    console.log(
      `[DB] User session deleted successfully : ${req.body.sessionId}`
    );
  } catch (error) {
    res.status(400).send();
    console.log(`[DB] Error deleting session`);
  }
});

userRouter.post("/session", async (req, res) => {
  try {
    const sessionData = await db.session.findUnique({
      where: {
        sessionId: req.headers.authorization,
      },
    });

    if (!sessionData) {
      res.status(400).send();
      return;
    } else if (sessionData.expireAt < new Date(Date.now())) {
      res.status(400).send();
      await db.session.deleteMany({
        where: {
          expireAt: {
            lt: new Date(Date.now()),
          },
        },
      });
      return;
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).send();
    console.log(`[DB] Error verifying session : ${error}`);
  }
});
