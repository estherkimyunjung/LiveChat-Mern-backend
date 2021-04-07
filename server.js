// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(express.json());

// DB config
const connection_url =
  "mongodb+srv://admin:YzVbfVDq0sBI4fBH@cluster0.uppzj.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ???

// api routes 404-not found
app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
      //500 = internal server err
    } else {
      res.status(201).send(`new message created: \n ${data}`);
      //201 = created ok
    }
  });
});
//listeners
app.listen(port, () => console.log(`istening on location: ${port}`));

//admin YzVbfVDq0sBI4fBH - 75.53.226.63/32
