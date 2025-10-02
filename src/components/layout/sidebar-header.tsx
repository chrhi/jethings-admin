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
import { Settings, LogOut, User, BookOpen, Search } from "lucide-react";
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
    <header className="sticky top-0 z-50 flex h-14 items-center gap-1 px-2 sm:gap-2 sm:px-4 justify-between bg-background ">
      <div className="flex items-center gap-1 sm:gap-2">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:block">
          <GlobalSearch />
        </div>
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-sm">
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
          
          {/* Mobile-only Search option */}
          <div className="block sm:hidden">
            <DropdownMenuItem onClick={() => {
              // Trigger global search programmatically
              const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement;
              if (searchButton) {
                searchButton.click();
              }
            }}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search</span>
            </DropdownMenuItem>
          </div>
          
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
          
          {/* Mobile-only Theme Toggle */}
          <div className="block sm:hidden">
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
          
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