import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import cors from "cors";
import blogRouter from "./services/blogs/index.js";
import commentsRouter from "./services/comments/index.js";

const server = express();

const port = process.env.PORT;
// ********************************* MIDDLEWARES ***************************************

server.use(cors());
server.use(express.json());

// ********************************* ROUTES ********************************************

server.use("/blogs", blogRouter);
server.use("/comments", commentsRouter);

// ********************************* ERROR HANDLERS ************************************

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected");

  server.listen(port, () => {
    console.table(listEndpoints(server));

    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
