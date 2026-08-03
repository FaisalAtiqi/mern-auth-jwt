import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Trash2,
  Clock,
  MapPin,
} from "lucide-react";
import { SiGooglechrome, SiFirefoxbrowser, SiSafari } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Session } from "@shared/types/session";

interface SessionCardProps {
  session: Session;
  onDelete: (sessionId: string) => void;
  onDisabled: boolean;
}

function getDeviceIcon(deviceType?: string) {
  switch (deviceType?.toLocaleLowerCase()) {
    case "mobile":
      return <Smartphone className="size-4" />;
    case "tablet":
      return <Tablet className="size-4" />;
    case "desktop":
      return <Monitor className="size-4" />;
    default:
      return <Laptop className="size-4" />;
  }
}

function getBrowserIcon(browser?: string) {
  const browserName = browser?.toLowerCase();
  if (browserName?.includes("chrome"))
    return <SiGooglechrome className="size-4" />;
  if (browserName?.includes("safari")) return <SiSafari className="size-4" />;
  if (browserName?.includes("firefox"))
    return <SiFirefoxbrowser className="size-4" />;

  return <Globe className="size-4" />;
}

export function SessionCard({
  session,
  onDelete,
  onDisabled: isPending,
}: SessionCardProps) {
  const lastActiveDate = new Date(session.lastActive);
  const isRecentlyActive =
    Date.now() - lastActiveDate.getTime() < 5 * 60 * 1000; // 5 minutes

  const deviceType = session.device?.deviceType;
  const capitalizedDeviceName = deviceType
    ? deviceType.charAt(0).toUpperCase() + deviceType.slice(1).toLowerCase()
    : undefined;
  const browserName = session.browser?.name;
  const osName = session.os?.name;
  const country = session.location?.country;
  const city = session.location?.city;
  const ipAddress = session.ipAddress;

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Device Icon */}
            <div className="bg-primary/10 mt-1 rounded-lg p-2">
              {getDeviceIcon(deviceType)}
            </div>

            {/* Session Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">
                  {capitalizedDeviceName}- {browserName}
                </h3>

                {session.isCurrent && (
                  <Badge variant="default" className="bg-green-600">
                    Current Session
                  </Badge>
                )}

                {isRecentlyActive && !session.isCurrent && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/10 text-yellow-600"
                  >
                    <Clock className="mr-1 size-3" />
                    Active now
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground space-y-1 text-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    {getBrowserIcon(browserName)}
                    {browserName ?? "unknown browser"}
                  </span>
                  <span>•</span>
                  <span>{osName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {city} {country || "unknown location"}
                  </span>
                  <span>•</span>
                  <span>IP: {ipAddress || "unknown ip address"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Last active: {lastActiveDate.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Revoke Button */}
          {!session.isCurrent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(session.id)}
              disabled={isPending}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1 size-4" />
              Revoke
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
