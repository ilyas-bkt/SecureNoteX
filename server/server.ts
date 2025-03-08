import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { exit } from "process";
import helmet from "helmet";
import path from "path";
import https from "https";
import http from "http";
import fs from "fs";
import cors from "cors";

import { userRouter } from "./routes/user";
import { noteRouter } from "./routes/note";
import { bodyRouter } from "./routes/body";

dotenv.config();
const HTTP_PORT = Number(process.env["HTTP_PORT"]);
const HTTPS_PORT = Number(process.env["HTTPS_PORT"]);
const SSL_CERTIFICATE_DIR = String(process.env["SSL_CERTIFICATE_DIR"]);
const PUBLIC_DIR = String(process.env["PUBLIC_DIR"]);
export const PRODUCTION = Boolean(process.env["PRODUCTION"] == "true");
export const SESSION_TIMEOUT_HOURS = Number(
  process.env["SESSION_TIMEOUT_HOURS"]
);

const server = express();
export const db = new PrismaClient();

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

// Server middlewares
server.use(cookieParser());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: "http://192.168.0.101:5173",
    credentials: true,
  })
);
server.use((req, _, next) => {
  console.log(
    `[Server - ${new Date().toLocaleTimeString()}] New client at ${
      req.ip
    } is connected on ${req.originalUrl} using ${req.method}`
  );
  next();
});

// Routes
server.use("/api/user", userRouter);
server.use("/api/note", noteRouter);
server.use("/api/note/body", bodyRouter);

// Static files
server.use(express.static(path.join(PUBLIC_DIR)));
server.get("*", (_, res) => {
  res.status(200).sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ============== SSL VERIFICATION ===================== //
/*server.get("/.well-known/acme-challenge/:filename", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, req.params.filename));
});*/

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
