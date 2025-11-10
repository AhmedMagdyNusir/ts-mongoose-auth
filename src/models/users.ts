import { ROLES } from "@/utils/constants";
import { Schema, model, Document, Types } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "محرر" | "مسؤول";
}

const userSchema = new Schema<User>(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES }, // default: "محرر"
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  if (obj.password) delete obj.password;
  return obj;
};

export default model<User>("User", userSchema);
