import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likeSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    /* status: { type: Boolean, required: true, enum: [true, false] },
    isLike: {
      like: Boolean,
    }, */
    /* blogs: [{ catergory: String, title: String, cover: String }], */
  },
  {
    timestamps: true,
  }
);

export default model("Like", likeSchema);
