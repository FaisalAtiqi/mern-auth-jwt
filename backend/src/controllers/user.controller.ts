import { Request, Response } from "express";
import UserModel from "../models/user.model.js";
import appAssert from "../utils/appAssert.js";
import { HTTP_STATUS } from "../constants/http.js";
import { GetUserResponse } from "../../../shared/types/User.js";

export async function getUserHandler(
  req: Request,
  res: Response,
): Promise<Response<GetUserResponse>> {
  const user = await UserModel.findById(req.userId);
  appAssert(user, HTTP_STATUS.NOT_FOUND, "User not found");

  return res.status(HTTP_STATUS.OK).json(user);
}
