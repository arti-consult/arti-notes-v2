import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const userInitials = user.email ? user.email[0].toUpperCase() : "U";

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-md">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  fill="white"
                />
                <path
                  d="M19.5 12C19.5 13.5 18.6 15.3 17.1 16.2L18.5 19.7C18.7 20.1 18.5 20.7 18.1 20.9C17.7 21.1 17.1 20.9 16.9 20.5L15.5 17C14.5 17.4 13.3 17.4 12.3 17L10.9 20.5C10.7 20.9 10.1 21.1 9.7 20.9C9.3 20.7 9.1 20.1 9.3 19.7L10.7 16.2C9.2 15.3 8.3 13.5 8.3 12C8.3 10.5 9.2 8.7 10.7 7.8L9.3 4.3C9.1 3.9 9.3 3.3 9.7 3.1C10.1 2.9 10.7 3.1 10.9 3.5L12.3 7C13.3 6.6 14.5 6.6 15.5 7L16.9 3.5C17.1 3.1 17.7 2.9 18.1 3.1C18.5 3.3 18.7 3.9 18.5 4.3L17.1 7.8C18.6 8.7 19.5 10.5 19.5 12Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-semibold text-xl">ARTI Notes</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.user_metadata.full_name || user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="w-full text-left">
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
