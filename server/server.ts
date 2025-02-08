import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { exit, off } from "process";
import helmet from "helmet";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import argon2 from "argon2";
import { log } from "console";

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

interface UserTypes {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ================ CONFIG ============== //
server.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "access-control-allow-origin, content-type, authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method == "OPTIONS") {
    res.status(200).send();
  }

  next();
});

server.use(helmet());
server.use(express.json());

server.use((req, res, next) => {
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

server.get("*", (req, res) => {
  res.status(200).sendFile(path.join(PUBLIC_DIR, "index.html"));
});

server.post("/api/register", async (req, res, next) => {
  await db.user
    .create({
      data: <UserTypes>{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: await argon2.hash(req.body.password),
      },
    })
    .then((data) => {
      res.status(201).send();
      console.log(`[DB] New user created : ${JSON.stringify(data)}`);
    })
    .catch(() => {
      console.log(
        `[DB] Failed to create a new user. Error: Username already exists.`
      );
      res.status(500).send();
    });
});

server.post("/api/login", async (req, res) => {
  await db.user
    .findUnique({
      where: <UserTypes>{
        username: req.body.username,
      },
    })
    .then(async (data) => {
      if (await argon2.verify(data?.password as string, req.body.password)) {
        res.status(202).send();
        console.log(`[DB] User ${data?.username} is successfully connected`);
      } else {
        res.status(400).send();
        console.log(
          `[DB] Wrong password for username => (${req.body.username})`
        );
      }
    })
    .catch(() => {
      console.log(`[DB] No username (${req.body.username}) in database`);
      res.status(400).send();
    });
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
