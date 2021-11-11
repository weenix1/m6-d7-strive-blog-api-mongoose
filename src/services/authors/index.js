import express from "express";
import AuthorModel from "./schema.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body);
    /* const { _id } = await newAuthor.save(); */
    await newAuthor.save();
    /* res.status(201).send({ _id }); */
    res.status(201).send(newAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
