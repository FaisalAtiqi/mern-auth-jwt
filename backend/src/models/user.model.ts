import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.js";
import { signupMetadataSchema } from "../schema/metadata.schema.js";
import { SignupMetadata } from "../../../shared/types/metadata.js";

export interface User {
  email: string;
  password: string;
  isVerified: boolean;
  signupMetadata?: SignupMetadata;
}

export type UserDocument = HydratedDocument<User, UserMethods>;

// Define instance methods that each User document will have
interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

// Define the UserModel type, extending Mongoose's Model with User + UserMethods
interface UserModel extends Model<User, {}, UserMethods> {}

const userSchema = new Schema<User, UserModel, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // exclude by default when querying (security measure)
    },

    isVerified: { type: Boolean, default: false },

    signupMetadata: { type: signupMetadataSchema, immutable: true },
  },
  {
    timestamps: true, // automatically add createdAt and updatedAt fields
  },
);

// Pre-save hook: runs before saving a document
userSchema.pre("save", async function (next) {
  // Only hash password if it was modified (e.g., new user or password change)
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return await compareValue(candidate, this.password);
};

const UserModel = mongoose.model<User, UserModel>("User", userSchema);

export default UserModel;
