import express from "express";

const app = express();

app.get("/api", (req, res) => {
  res.status(404).send("Hello");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
