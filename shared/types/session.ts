export interface SessionsResponse {
  sessions: UserSession[];
  total: number;
}

export interface UserSession {
  id: string;
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
  lastActive: string;
  createdAt: string;
  isCurrent: boolean;
}
