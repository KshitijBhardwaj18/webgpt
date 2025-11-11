import express from "express";

import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

import cors from "cors";

import ChabotRouter from "./routes/chatbot.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001", // exact frontend origin
    credentials: true, // allow cookies / auth headers
  })
);

app.get("/", (req, res) => {
  res.send("Hello from webGPT backend");
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use("/chatbot", ChabotRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server is running on port ${port} `));
