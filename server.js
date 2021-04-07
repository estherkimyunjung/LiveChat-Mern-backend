// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1184425",
  key: "6d56966d7a92f137884a",
  secret: "ace0d04c7869218760e1",
  cluster: "us2",
  useTLS: true,
});

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

// pusher
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    // console.log("CHANGE", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;

      pusher.trigger("messages", "inserted", {
        name: messageDetails.user,
        message: messageDetails.message,
      });
    } else {
      console.log("Error triggring pusher");
    }
  });
});

// api routes 404-not found
app.get("/", (req, res) => res.status(200).send("hello world!!"));

app.get("/api/v1/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
      // 200 = success response ok
    }
  });
});

app.post("/api/v1/messages/new", (req, res) => {
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
app.listen(port, () => console.log(`istening on location: ${port}!!`));

//admin YzVbfVDq0sBI4fBH - 75.53.226.63/32
