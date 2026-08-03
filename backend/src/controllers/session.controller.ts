import { Request, Response } from "express";
import SessionModel from "../models/session.model.js";
import appAssert from "../utils/appAssert.js";
import { HTTP_STATUS } from "../constants/http.js";
import { verificationCodeSchema } from "../../../shared/auth/auth.schema.js";
import { clearAuthCookies } from "../utils/cookies.js";
import {
  DeleteAllResponse,
  DeleteSessionResponse,
  GetSessionsResponse,
} from "../../../shared/types/session.js";

export async function getSessionsHandler(
  req: Request,
  res: Response,
): Promise<Response<GetSessionsResponse>> {
  // `find()` always returns an array, and returning an empty array is valid
  // because the user may simply have no active sessions
  const sessions = await SessionModel.find({
    userId: req.userId,
    // Optional: only show sessions that haven't expired
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 }); // descending order

  const sessionList = sessions.map((session) => {
    return {
      ...session.toObject(),
      isCurrent: session.id === req.sessionId,
    };
  });

  const payload = {
    sessions: sessionList,
    total: sessionList.length,
  };

  return res.status(HTTP_STATUS.OK).json(payload);
}

export async function deleteSessionHandler(
  req: Request,
  res: Response,
): Promise<Response<DeleteSessionResponse>> {
  const sessionId = verificationCodeSchema.parse(req.params.id);

  // Delete the session from DB (ensuring it belongs to the user)
  const deletedSession = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  // Handle if session didn't exist or wasn't theirs
  appAssert(deletedSession, HTTP_STATUS.NOT_FOUND, "Session not found");

  // If they deleted their CURRENT session, clear their browser cookies
  if (sessionId === req.sessionId) {
    return clearAuthCookies(res).status(HTTP_STATUS.OK).json({
      message: "Current session ended and cookies cleared.",
    });
  }

  // Otherwise, just confirm the remote device was logged out
  return res.status(HTTP_STATUS.OK).json({
    message: "Device logged out successfully.",
  });
}

export async function deleteOtherSessionsHandler(
  req: Request,
  res: Response,
): Promise<Response<DeleteAllResponse>> {
  const deletedSessions = await SessionModel.deleteMany({
    _id: { $ne: req.sessionId },
    userId: req.userId,
  });
  appAssert(deletedSessions, HTTP_STATUS.NOT_FOUND, "Sessions not found");

  return res.status(HTTP_STATUS.OK).json({
    message: "All other devices logged out successfully.",
  });
}
