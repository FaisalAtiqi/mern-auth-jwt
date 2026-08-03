export interface GetSessionsResponse {
  sessions: Session[];
  total: number;
}

export interface Session {
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

export interface DeleteSessionResponse {
  message: string;
}

export interface DeleteAllResponse {
  message: string;
}
