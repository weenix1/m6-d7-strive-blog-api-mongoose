import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: [
      {
        value: { type: Number, required: true },
        unit: { type: Number, required: true },
      },
    ],
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    content: { type: String, required: true },
    comments: [
      {
        text: { type: String },
        userName: { type: String },
      },
    ],
    likes: [{ type: Schema.Types.ObjectId, ref: "Author" }],
  },

  {
    timestamps: true, // adds and manage createdAt and updatedAt fields
  }
);

export default model("Blog", blogSchema);
