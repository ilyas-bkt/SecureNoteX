import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { exit } from "process";
import helmet from "helmet";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import argon2 from "argon2";
import { v4 } from "uuid";

//=============== CONSTANTS ==========//
const HTTP_PORT = Number(process.env["HTTP_PORT"]);
const HTTPS_PORT = Number(process.env["HTTPS_PORT"]);
const SSL_CERTIFICATE_DIR = String(process.env["SSL_CERTIFICATE_DIR"]);
const PUBLIC_DIR = String(process.env["PUBLIC_DIR"]);

//================ INIT ==============//
const server = express();
const db = new PrismaClient();
dotenv.config();
console.log(`[DB] Connecting to database...`);
await db
  .$connect()
  .catch((e) => {
    console.error(`[DB] Error : ${e}`);
    exit(0);
  })
  .then(() => {
    console.log("[DB] Connected to database.");
  });

// ================ CONFIG ============== //
server.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "access-control-allow-origin, content-type, authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});

server.use(express.json());

server.use((req, _, next) => {
  console.log(
    `[Server] (${new Date().toISOString()}) New client at ${
      req.ip
    } is connected on ${req.originalUrl} using ${req.method}`
  );
  next();
});

server.use(express.static(path.join(PUBLIC_DIR)));

// ============== SSL VERIFICATION ===================== //
/*server.get("/.well-known/acme-challenge/:filename", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, req.params.filename));
});*/

server.get("*", (_, res) => {
  res.status(200).sendFile(path.join(PUBLIC_DIR, "index.html"));
});

server.post("/api/register", async (req, res) => {
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

server.post("/api/login", async (req, res, next) => {
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
            `[DB] New session created : ${JSON.stringify(sessionData)}`
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

server.post("/api/logout", async (req, res) => {
  try {
    const status = await db.session.delete({
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

server.post("/api/session", async (req, res) => {
  try {
    const sessionData = await db.session.findUnique({
      where: {
        sessionId: req.headers.authorization,
      },
    });

    if (!sessionData) {
      res.status(400).send();
      return;
    } else if (sessionData.expireAt < new Date()) {
      res.status(400).send();
      await db.session.delete({
        where: {
          sessionId: req.headers.authorization,
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

https
  .createServer(
    {
      key: fs.readFileSync(path.join(`${SSL_CERTIFICATE_DIR}`, "privkey.pem")),
      cert: fs.readFileSync(path.join(`${SSL_CERTIFICATE_DIR}`, "cert.pem")),
    },
    server
  )
  .listen(HTTPS_PORT, () => {
    console.log(
      `[Server] Server is listening on https://localhost:${HTTPS_PORT}...`
    );
  });

http.createServer(server).listen(HTTP_PORT, () => {
  console.log(
    `[Server] Server is listening on http://localhost:${HTTP_PORT}...`
  );
});
