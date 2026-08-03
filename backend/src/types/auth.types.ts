import {
  LoginBody,
  RegisterBody,
  ResetPasswordBody,
} from "../../../shared/auth/auth.schema.js";
import { BaseClientMetadata } from "../lib/metadata/metadata.types.js";

export interface CreateUserAccountParams {
  credentials: Omit<RegisterBody, "confirmPassword">;
  metadata: BaseClientMetadata;
}

export interface LoginUserParams {
  credentials: LoginBody;
  metadata: BaseClientMetadata;
}

export interface ResetPasswordParams extends ResetPasswordBody {}
