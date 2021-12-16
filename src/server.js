import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
  unauthorizedHandler,
  forbiddenHandler,
} from "./errorHandlers.js";
import cors from "cors";
import blogRouter from "./services/blogs/index.js";
import commentsRouter from "./services/comments/index.js";
import authorsRouter from "./services/authors/index.js";
import likesRouter from "./services/likes/index.js";
import usersRouter from "./services/users/index.js";
import passport from "passport";
import GoogleStrategy from "./auth/oauth.js";

const server = express();

const port = process.env.PORT;
// ********************************* MIDDLEWARES ***************************************
passport.use("google", GoogleStrategy);

server.use(cors());
server.use(express.json());
server.use(passport.initialize());

// ********************************* ROUTES ********************************************

server.use("/blogs", blogRouter);
server.use("/comments", commentsRouter);
server.use("/authors", authorsRouter);
server.use("/likes", likesRouter);
server.use("/users", usersRouter);

// ********************************* ERROR HANDLERS ************************************
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
/* server.use(catchAllHandler); */
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
