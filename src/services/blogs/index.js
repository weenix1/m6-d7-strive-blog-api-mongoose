import express from "express";
import createHttpError from "http-errors";

import q2m from "query-to-mongo";

import BlogsModel from "./schema.js";
import CommentModel from "../comments/schema.js";

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
  //http://localhost:3002/blogs?limit=2&sort=-author&offset=15
  ///blogs?limit=5&sort=-author&offset=10
  try {
    const mongoQuery = q2m(req.query);
    console.log(mongoQuery);
    const total = await BlogsModel.countDocuments(mongoQuery.criteria);
    const blogs = await BlogsModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);
    res.send({
      links: mongoQuery.links("/blogs", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      blogs,
    });
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

/* here comes the comment queries */
blogRouter.post("/:blogId/comment", async (req, res, next) => {
  try {
    const myComment = await CommentModel(req.body);
    if (myComment) {
      const commentToInsert = {
        ...myComment.toObject(),
        createdAt: new Date(),
      };
      console.log(commentToInsert);

      console.log("here", commentToInsert);
      const updatedBlog = await BlogsModel.findByIdAndUpdate(
        req.params.blogId,

        { $push: { comments: commentToInsert } },
        { new: true }
      );
      console.log("updated", updatedBlog);
      if (updatedBlog) {
        res.send(updatedBlog);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.blogId} not found!`)
        );
      }
    } else {
      next(
        createHttpError(404, `blog with id ${req.body.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comment", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
    if (blog) {
      res.send(blog.comments);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
    if (blog) {
      const comment = blog.comments.find(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (comment) {
        res.send(comment);
      } else {
        next(
          createHttpError(
            404,
            `Book with id ${req.params.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params.blogId);
    if (blog) {
      const index = blog.comments.findIndex(
        (c) => c._id.toString() === req.params.commentId
      );

      if (index !== -1) {
        blog.comments[index] = {
          ...blog.comments[index].toObject(),
          ...req.body,
        };
        await blog.save();
        res.send(blog);
      } else {
        next(
          createHttpError(
            404,
            `Book with id ${req.params.commentId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogId} not found!`)
      );
    }

    // const user = await UserModel.findOneAndUpdate(
    //   { _id: req.params.userId, "purchaseHistory._id": req.params.productId },
    //   {
    //     "purchaseHistory.$": req.body, // purchaseHistory[index] in js is equal to purchaseHistory.$ in mongo, N.B. req.body should contain all the properties of the product
    //   }
    // )
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const modifiedBlog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId,
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    if (modifiedBlog) {
      res.send(modifiedBlog);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
