import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthState } from "@/lib/auth";
import type { GetUserResponse } from "@shared/types/User";

interface Props {
  user: GetUserResponse;
}

export function UserMenu({ user }: Props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: logout,

    // onSettled runs regardless of success or failure
    onSettled: () => {
      clearAuthState(queryClient);
      navigate("/login", { replace: true });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={`${user.email} avatar image`} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={8}
        className="w-40"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 overflow-hidden">
            <p className="text-sm leading-none font-medium">Account</p>
            <p className="text-muted-foreground truncate text-xs leading-tight">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/profile">
            <DropdownMenuItem>
              <UserIcon />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link to="/settings">
            <DropdownMenuItem>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          disabled={isPending}
          variant="destructive"
        >
          <LogOutIcon />
          <span className="flex items-center gap-1.5">
            {isPending ? (
              <>
                Signing out...
                <Spinner />
              </>
            ) : (
              "Sign out"
            )}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
