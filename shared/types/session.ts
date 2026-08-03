export interface UserSession {
  _id: string;
  userAgent?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  cpu?: string;
  ipAddress?: string;
  location?: string;
  lastActive: string | Date;
  createdAt: string | Date;
  isCurrent?: boolean;
}

export interface SessionsResponse {
  sessions: UserSession[];
  total: number;
}
