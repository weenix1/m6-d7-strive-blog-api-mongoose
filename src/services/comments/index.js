import express from "express";
import q2m from "query-to-mongo";
/*
q2m translates something like /books?limit=5&sort=-price&offset=15&price<10&category=fantasy into something that could be directly usable by mongo like

{
  criteria: { price: { '$lt': 10 }, category: 'fantasy' },
  options: { sort: { price: -1 }, skip: 15, limit: 5 }
}

*/
import CommentModel from "./schema.js";

const commentsRouter = express.Router();

commentsRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    console.log(mongoQuery);
    const total = await CommentModel.countDocuments(mongoQuery.criteria);
    const comments = await CommentModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);

    res.send({
      links: mongoQuery.links("/comments", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      books,
    });
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;
