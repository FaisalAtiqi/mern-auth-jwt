import { Schema } from "mongoose";

export const browserSchema = new Schema(
  {
    name: String,
    version: String,
  },
  { _id: false },
);

export const osSchema = new Schema(
  {
    name: String,
    version: String,
  },
  { _id: false },
);

export const deviceSchema = new Schema(
  {
    deviceType: String,
    vendor: String,
    model: String,
  },
  { _id: false },
);

export const locationSchema = new Schema(
  {
    country: String,
    region: String,
    city: String,
    timezone: String,
  },
  { _id: false },
);

export const signupMetadataSchema = new Schema(
  {
    userAgent: String,
    ipAddress: String,

    location: locationSchema,

    browser: browserSchema,

    os: osSchema,

    device: deviceSchema,
  },
  {
    _id: false,
  },
);
