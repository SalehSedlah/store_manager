
"use client";

import Link from "next/link"; // Changed
import { useRouter, usePathname } from "next/navigation"; // Changed
import { LogOut, TrendingUp } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavLink as NavLinkTypeDefinition } from "@/config/links"; 
import { mainNavLinks, secondaryNavLinks } from "@/config/links"; 
import { useToast } from "@/hooks/use-toast";
// import { useTranslations } from "next-intl"; // Removed

export function AppSidebar() {
  const pathname = usePathname(); 
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); 
  const { state: sidebarState } = useSidebar();
  // const t = useTranslations("Sidebar"); // Removed
  // const tToast = useTranslations("Toast"); // Removed

  // Hardcoded strings
  const toastLogoutSuccessTitle = "Logged Out";
  const toastLogoutSuccessDescription = "You have been successfully logged out.";
  const toastLogoutFailedTitle = "Logout Failed";
  const logoutButtonText = "Logout";


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: toastLogoutSuccessTitle, description: toastLogoutSuccessDescription });
      router.push(`/login`); // No locale prefix
    } catch (error: any) {
      toast({ title: toastLogoutFailedTitle, description: error.message, variant: "destructive" });
    }
  };

   // NavLink labels are now directly from config/links.ts (already hardcoded there)
   const navLinksToRender = (links: NavLinkTypeDefinition[]): NavLinkTypeDefinition[] => links.map(link => ({
    ...link,
    href: link.href, // Ensure href does not have locale prefix
  }));


  const renderNavLink = (link: NavLinkTypeDefinition, index: number) => (
    <SidebarMenuItem key={`${link.labelKey}-${index}`}>
      <Link href={link.href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
          tooltip={sidebarState === "collapsed" ? link.label : undefined} // Use direct label
        >
          <a>
            <link.icon />
            <span>{link.label}</span> {/* Use direct label */}
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href={`/dashboard`} className="flex items-center gap-2 text-primary"> {/* No locale prefix */}
            <TrendingUp className="h-8 w-8" />
            {sidebarState === "expanded" && <span className="text-xl font-headline font-semibold">DebtVision</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {loading && (
            <>
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
              <SidebarMenuSkeleton showIcon />
            </>
          )}
          {!loading && navLinksToRender(mainNavLinks).map(renderNavLink)}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {!loading && navLinksToRender(secondaryNavLinks).map((link, index) => renderNavLink(link, index))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={sidebarState === "collapsed" ? logoutButtonText : undefined}>
                <LogOut />
                <span>{logoutButtonText}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
