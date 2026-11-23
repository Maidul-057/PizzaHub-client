"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { dashboardPath } from "@/lib/constants";
import { initials } from "@/lib/format";

export default function UserMenu({ user }) {
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    clearToken();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open profile menu"
      >
        <Avatar className="size-9 border">
          <AvatarImage src={user.image || undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={dashboardPath(user.role)}>
              <LayoutDashboard className="mr-2 size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserCog className="mr-2 size-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
