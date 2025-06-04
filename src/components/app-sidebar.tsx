
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

  // Determine current locale from pathname, default to 'en'
  const pathSegments = pathname.split('/');
  const locale = pathSegments[1] && pathSegments[1].length === 2 ? pathSegments[1] : 'en';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push(`/${locale}/login`); 
    } catch (error: any) {
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  };

   const navLinksToRender = (links: NavLinkType[]): NavLinkType[] => links.map(link => ({
    ...link,
    // Prepend locale to href if it's not an external link
    href: link.href.startsWith('http') ? link.href : `/${locale}${link.href}`,
    label: link.label 
  }));


  const renderNavLink = (link: NavLinkType, index: number) => (
    <SidebarMenuItem key={`${link.label}-${index}`}>
      <Link href={link.href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          // isActive for prefixed links needs to check the path *after* the locale
          isActive={pathname.startsWith(link.href)}
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
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 text-primary">
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
