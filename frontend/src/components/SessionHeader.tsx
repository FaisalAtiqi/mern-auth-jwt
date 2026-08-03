import {
  AlertCircle,
  LogOut,
  Monitor,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import type { Session } from "@shared/types/session";

interface Props {
  otherSessions: Session[];
  stats: {
    total: number;
    current: number;
    otherDevices: number;
    mobile: number;
    desktop: number;
  };
  onDisabled: boolean;
  fetchSessions: () => void;
  setShowRevokeAllDialog: (v: boolean) => void;
}

function SessionHeader({
  otherSessions,
  stats,
  onDisabled: isLoading,
  fetchSessions,
  setShowRevokeAllDialog,
}: Props) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage devices where you're signed in
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => {
              fetchSessions();
            }}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>

          {otherSessions?.length > 0 && (
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                setShowRevokeAllDialog(true);
              }}
            >
              <LogOut className="mr-2 size-4" />
              Delete All Others
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-muted-foreground text-sm">Total Sessions</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{stats.otherDevices}</div>
          <div className="text-muted-foreground text-sm">Other Devices</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="size-4" />
            <span className="text-2xl font-bold">{stats.mobile}</span>
          </div>
          <div className="text-muted-foreground text-sm">Mobile</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Monitor className="size-4" />
            <span className="text-2xl font-bold">{stats.desktop}</span>
          </div>
          <div className="text-muted-foreground text-sm">Desktop</div>
        </div>
      </div>

      {/* Security Alert */}
      {otherSessions?.length > 2 && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Multiple active sessions detected</AlertTitle>
          <AlertDescription>
            For security, consider revoking sessions you don't recognize.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default SessionHeader;
