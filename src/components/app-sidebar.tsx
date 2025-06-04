
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
import type { NavLink as NavLinkType } from "@/config/links";
import { mainNavLinks, secondaryNavLinks } from "@/config/links";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/login"); 
    } catch (error: any) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  };

  // Use labels directly as hardcoded English strings
  const navLinksToRender = (links: NavLinkType[]): NavLinkType[] => links.map(link => ({
    ...link,
    label: link.label // Assuming link.label is already the desired English string
  }));


  const renderNavLink = (link: NavLinkType, index: number) => (
    <SidebarMenuItem key={`${link.label}-${index}`}>
      <Link href={link.href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={link.isActive ? link.isActive(pathname) : pathname.startsWith(link.href)}
          tooltip={sidebarState === "collapsed" ? link.label : undefined}
        >
          <a>
            <link.icon />
            <span>{link.label}</span>
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary">
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
              <SidebarMenuButton onClick={handleLogout} tooltip={sidebarState === "collapsed" ? "Logout" : undefined}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
