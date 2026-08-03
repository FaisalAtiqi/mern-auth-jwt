import { Request } from "express";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import { BaseClientMetadata } from "./metadata.types.js";
import { SignupMetadata } from "../../../../shared/types/metadata.js";

export function buildSignupMetadata(
  metadata: BaseClientMetadata,
): SignupMetadata {
  return {
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
    location: metadata.location,
    browser: metadata.browser,
    os: metadata.os,
    device: metadata.device,
  };
}

export function buildSessionMetadata(
  metadata: BaseClientMetadata,
): BaseClientMetadata {
  return {
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
    location: metadata.location,
    browser: metadata.browser,
    os: metadata.os,
    device: metadata.device,
    cpu: metadata.cpu,
  };
}

export function extractClientMetadata(req: Request): BaseClientMetadata {
  const userAgent = req.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const rawIp = req.ip || req.socket.remoteAddress || "";
  const ip = rawIp.replace(/^::ffff:/, "");

  const geo = geoip.lookup(ip);

  return {
    userAgent,
    ipAddress: ip || undefined,

    location: geo
      ? {
          country: geo.country,
          city: geo.city,
          region: geo.region,
          timezone: geo.timezone,
        }
      : undefined,

    browser: {
      name: result.browser.name,
      version: result.browser.version,
    },

    os: {
      name: result.os.name,
      version: result.os.version,
    },

    device: {
      deviceType:
        result.device.type || (result.os.name ? "desktop" : undefined),
      vendor: result.device.vendor,
      model: result.device.model,
    },

    cpu: result.cpu.architecture,
  };
}
