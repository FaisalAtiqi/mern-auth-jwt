// pages/Sessions.tsx
import { SessionCard } from "@/components/SessionCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, AlertCircleIcon } from "lucide-react";

import { useSessions } from "@/hooks/useSessions";
import useDeleteSession from "@/hooks/useDeleteSession";
import { useMemo, useState } from "react";
import SessionHeader from "@/components/SessionHeader";
import useDeleteAllSessions from "@/hooks/useDeleteAllSessions";
import PageLoader from "@/components/common/PageLoader";

function Sessions() {
  const { isLoading, isError, data, refetch } = useSessions();
  const { mutate: deleteSession, isPending: isPendingDeleteSession } =
    useDeleteSession();
  const { mutate: deleteAllSessions } = useDeleteAllSessions();

  const sessions = data?.sessions ?? [];
  const total = data?.total ?? sessions.length;

  const { currentSession, otherSessions, stats } = useMemo(() => {
    const currentSession = sessions.find((s) => s.isCurrent);
    const otherSessions = sessions.filter((s) => !s.isCurrent);

    return {
      currentSession,
      otherSessions,

      stats: {
        total,
        current: currentSession ? 1 : 0,

        mobile: sessions.filter(
          (s) => s.device?.deviceType?.toLowerCase() === "mobile",
        ).length,
        desktop: sessions.filter(
          (s) => s.device?.deviceType?.toLowerCase() === "desktop",
        ).length,

        otherDevices: sessions.filter((s) => {
          const type = s.device?.deviceType?.toLowerCase();
          return type !== "mobile" && type !== "desktop";
        }).length,
      },
    };
  }, [sessions]);

  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto mt-20 max-w-md px-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>failed to get sessions...</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <SessionHeader
        otherSessions={otherSessions}
        stats={stats}
        onDisabled={isLoading}
        fetchSessions={refetch}
        setShowRevokeAllDialog={setShowRevokeAllDialog}
      />

      {/* Current Session Section */}
      {currentSession && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Shield className="size-5" />
            Current Session
          </h2>
          <SessionCard
            session={currentSession}
            onDelete={deleteSession}
            onDisabled={isPendingDeleteSession}
          />
        </div>
      )}

      {/* Other Sessions Section */}
      {otherSessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Other Sessions ({otherSessions.length})
          </h2>
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={deleteSession}
                onDisabled={isPendingDeleteSession}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {otherSessions.length === 0 && !currentSession && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shield className="text-muted-foreground mb-4 size-12" />
          <h3 className="text-lg font-semibold">No active sessions</h3>
          <p className="text-muted-foreground">
            Sign in on other devices to see them here
          </p>
        </div>
      )}

      {/* Delete All Confirmation Dialog */}
      <AlertDialog
        open={showRevokeAllDialog}
        onOpenChange={setShowRevokeAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all other sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign out all other devices. You'll stay signed in on
              this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteAllSessions();
              }}
            >
              Yes, delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Sessions;
