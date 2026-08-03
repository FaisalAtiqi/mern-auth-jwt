import { Router } from "express";
import {
  deleteSessionHandler,
  getSessionsHandler,
  deleteOtherSessionsHandler,
} from "../controllers/session.controller.js";

const sessionRoutes = Router();

sessionRoutes.get("/", getSessionsHandler);
sessionRoutes.delete("/others", deleteOtherSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);

export default sessionRoutes;
