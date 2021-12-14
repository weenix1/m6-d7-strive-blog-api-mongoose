import express from "express";
import UserModel from "./schema.js";
import BlogsModel from "./schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { adminOnlyMiddleware } from "../../auth/admin.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UserModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/me",
  basicAuthMiddleware,

  async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  }
);
usersRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const blog = await BlogsModel.find(req.user);
    if (blog) {
      res.send(blog);
      /* res.send(req.user); */
    } else {
      next(createHttpError(404, `Post with the userid ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    /*  req.user.name = "John"; */
    const id = req.user._id.toString();
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedUser) {
      //await req.user.save();
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put(
  "/:id",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  const id = req.user._id.toString();

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (deletedUser) {
      res.send(deletedUser);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete(
  "/:id",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
