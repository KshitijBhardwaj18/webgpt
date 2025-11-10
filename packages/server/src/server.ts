import express from "express";
import {auth} from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from webGPT backend");
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server is running on port ${port} `));
