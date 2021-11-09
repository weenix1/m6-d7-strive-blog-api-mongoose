import express from "express";
import createHttpError from "http-errors";

import BlogsModel from "./schema.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body); // here happens validation of req.body, if it is not ok Mongoose will throw a "ValidationError" (btw user is still not saved in db yet)
    const { _id } = await newBlog.save(); // this is the line in which the interaction with the db happens
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const blog = await BlogsModel.findById(id);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;
    const updatedBlog = await BlogsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const id = req.params.blogId;

    const deletedBlog = await BlogsModel.findByIdAndDelete(id);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
