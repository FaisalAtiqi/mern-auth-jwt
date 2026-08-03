import { SignupMetadata } from "./metadata.js";

export interface GetUserResponse {
  id: string;
  email: string;
  isVerified: boolean;
  signupMetadata: SignupMetadata;
  createdAt: string;
  updatedAt: string;
}
