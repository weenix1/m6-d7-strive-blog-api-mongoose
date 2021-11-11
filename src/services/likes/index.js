import express from "express";
import LikeModel from "./schema.js";
import BlogModel from "../blogs/schema.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const likesRouter = express.Router();

likesRouter.post("/:ownerId/like", async (req, res, next) => {
  try {
    // We are going to receive bookId and quantity in req.body

    // 1. Find book in books collection by bookId

    const { blogId } = req.body;

    const liked = await BlogModel.findById(blogId);

    if (liked) {
      // 2. Is the product already in the active cart of the specified ownerId?

      const isliked = await LikeModel.findOne({
        ownerId: req.params.ownerId,
        /* likes: new mongoose.Types.ObjectId(req.body.blogId), */
      });

      if (isliked) {
        // 3. If product is already there --> increase previous quantity
        const like = await LikeModel.findOneAndUpdate(
          {
            ownerId: req.params.ownerId,
          },
          {
            new: true,
          }
        );
        res.send(like);
      } else {
        // 4. If product is not there --> add it to cart
        /*  const blogToInsert = { ...liked.toObject() }; */

        const like = await LikeModel.findOneAndUpdate(
          { ownerId: req.params.ownerId },
          {
            $push: { likes: liked },
          },
          {
            new: true,
            // upsert: true, // if the "active" cart is not found --> just create it automagically
          }
        );

        res.send(like);
      }
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

likesRouter.put("/:ownerId/like", async (req, res, next) => {
  try {
    /* const id = req.params.blogId; */
    const { blogId } = req.body;
    console.log(req.body.ownerId);
    const post = await BlogModel.findById(blogId);
    if (post) {
      const liked = await LikeModel.findOne({
        _id: blogId,
        likes: new mongoose.Types.ObjectId(req.body.ownerId),
      });
      console.log(liked);

      if (!liked) {
        await LikeModel.findByIdAndUpdate(
          req.body.ownerId,
          {
            $push: { likes: blogId },
          },
          { new: true }
        );
      } else {
        await LikeModel.findByIdAndUpdate(req.body.ownerId, {
          $pull: { likes: blogId },
        });
      }
    } else {
      next(
        createHttpError(404, `post with this id ${req.body.ownerId} not found`)
      );
    }
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    next(error);
  }
});

likesRouter.get("/", async (req, res, next) => {
  try {
    const likes = await LikeModel.find();
    res.send(likes);
  } catch (error) {
    next(error);
  }
});

likesRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

likesRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

likesRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default likesRouter;
