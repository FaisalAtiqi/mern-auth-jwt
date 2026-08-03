import mongoose, { Schema, model, HydratedDocument } from "mongoose";
import { thirtyDaysFromNow } from "../utils/date.js";
import {
  browserSchema,
  deviceSchema,
  locationSchema,
  osSchema,
} from "../schema/metadata.schema.js";

export interface Session {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  browser?: {
    name?: string;
    version?: string;
  };
  os?: {
    name?: string;
    version?: string;
  };
  device?: {
    deviceType?: string;
    vendor?: string;
    model?: string;
  };
  cpu?: string;
  lastActive: Date;
  createdAt: Date;
  expiresAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;

interface SessionModel extends mongoose.Model<Session> {
  createSession(params: {
    userId: string;
    metadata: Partial<Session>;
  }): Promise<SessionDocument>;
}

const sessionSchema = new Schema<Session, SessionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },

    userAgent: String,
    ipAddress: String,

    location: locationSchema,
    browser: browserSchema,
    os: osSchema,
    device: deviceSchema,
    cpu: String,

    lastActive: {
      type: Date,
      default: Date.now,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    expiresAt: {
      type: Date,
      default: thirtyDaysFromNow,
    },
  },
  {
    timestamps: false,
  },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionModel = model<Session, SessionModel>("Session", sessionSchema);

export default SessionModel;
