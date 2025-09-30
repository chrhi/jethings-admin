"use client"

import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Settings, LogOut, User, BookOpen } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import GlobalSearch from "../global-search";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OurSidebarHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleProfileSettings = () => {
    router.push('/settings/profile');
  };

  const handleSignOut = async () => {
    try {
      console.log("Starting logout...");
      await logout();
      console.log("Logout successful");
      toast.success('Déconnexion réussie');
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-2 px-4 justify-between bg-background border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-2">
        <GlobalSearch />
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl || "/avatars/user.png"} alt={user?.firstName || "User"} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {user && (
            <>
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                {user.firstName} {user.lastName}
              </div>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {user.email}
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleProfileSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href="https://docs.jethings.com/api-reference/auth-api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Docs</span>
            </a>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}