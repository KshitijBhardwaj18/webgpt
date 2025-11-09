import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from webGPT backend");
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`server is running on port ${port} `));
