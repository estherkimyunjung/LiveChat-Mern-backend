// importing
import express from "express";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware

// DB config

// ???

// api routes 404-not found
app.get("/", (req, res) => res.status(200).send("hello world"));

//listeners
app.listen(port, () => console.log(`istening on location: ${port}`));
