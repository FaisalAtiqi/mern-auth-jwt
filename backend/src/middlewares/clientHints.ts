import { Request, Response, NextFunction } from "express";

const clientHintsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Ask the browser for "High Entropy" data
  const hints = [
    "Sec-CH-UA-Full-Version-List",
    "Sec-CH-UA-Mobile",
    "Sec-CH-UA-Model",
    "Sec-CH-UA-Platform",
    "Sec-CH-UA-Platform-Version",
    "Sec-CH-UA-Arch",
  ].join(", ");

  // Critical-CH tells the browser to retry the request WITH hints immediately
  // if they weren't sent in the first packet.
  res.setHeader("Accept-CH", hints);
  res.setHeader("Critical-CH", hints);
  next();
};

export default clientHintsMiddleware;
