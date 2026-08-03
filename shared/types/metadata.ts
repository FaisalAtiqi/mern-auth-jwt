export interface BrowserMetadata {
  name?: string;
  version?: string;
}

export interface OSMetadata {
  name?: string;
  version?: string;
}

export interface DeviceMetadata {
  deviceType?: string;
  vendor?: string;
  model?: string;
}

export interface LocationMetadata {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

export interface SignupMetadata {
  userAgent?: string;
  ipAddress?: string;

  location?: LocationMetadata;
  browser?: BrowserMetadata;
  os?: OSMetadata;
  device?: DeviceMetadata;
}
