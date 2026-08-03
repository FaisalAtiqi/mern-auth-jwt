import { RequestHandler } from "express";
import SessionModel from "../models/session.model.js";

// In-memory registry to track the last time a session updated the DB
// Key: sessionId (string) -> Value: timestamp (number)
const sessionUpdateCache = new Map<string, number>();

const THROTTLE_INTERVAL = 1000 * 60;

/**
 * Clean up helper to prevent memory leaks over time.
 * If the cache grows too large, clear older entries.
 */
setInterval(
  () => {
    const now = Date.now();
    for (const [sessionId, lastUpdateTime] of sessionUpdateCache.entries()) {
      if (now - lastUpdateTime > THROTTLE_INTERVAL) {
        sessionUpdateCache.delete(sessionId);
      }
    }
  },
  1000 * 60 * 10,
); // Runs a maintenance sweep every 10 minutes

const trackSession: RequestHandler = (req, res, next) => {
  res.on("finish", async () => {
    const sessionId = req.sessionId;

    // Stop early if the request failed or authentication didn't occur
    if (!sessionId || res.statusCode >= 400) return;

    const now = Date.now();
    const lastDbUpdate = sessionUpdateCache.get(sessionId) || 0;

    // PRODUCTION GUARD: Skip updating DB if updated within the last minute
    if (now - lastDbUpdate < THROTTLE_INTERVAL) {
      return;
    }

    try {
      // Instantly update our local memory cache lock to block concurrent hits
      sessionUpdateCache.set(sessionId, now);

      // Perform a lean update query affecting only the modified field
      await SessionModel.updateOne(
        { _id: sessionId },
        { $set: { lastActive: new Date() } },
      );
    } catch (error) {
      console.error("Failed to update lastActive execution:", error);
      // Remove cache entry on failure so the next incoming request can retry
      sessionUpdateCache.delete(sessionId);
    }
  });

  next();
};

export default trackSession;
