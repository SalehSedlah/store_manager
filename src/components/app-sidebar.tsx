
"use client";

import { Link } from "next-intl/link"; // Changed
import { useRouter, usePathname } from "next-intl/client"; // Changed
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
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const pathname = usePathname(); // from next-intl/client, returns path without locale
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); // from next-intl/client
  const { state: sidebarState } = useSidebar();
  const t = useTranslations("Sidebar");
  const tToast = useTranslations("Toast");


  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: tToast("logoutSuccessTitle"), description: tToast("logoutSuccessDescription") });
      router.push(`/login`); 
    } catch (error: any) {
      toast({ title: tToast("logoutFailedTitle"), description: error.message, variant: "destructive" });
    }
  };

   const navLinksToRender = (links: NavLinkTypeDefinition[]): NavLinkTypeDefinition[] => links.map(link => ({
    ...link,
    // Link component from next-intl handles locale prefixing automatically
    href: link.href, 
    labelKey: link.labelKey // Use labelKey for translation
  }));


  const renderNavLink = (link: NavLinkTypeDefinition, index: number) => (
    <SidebarMenuItem key={`${link.labelKey}-${index}`}>
      <Link href={link.href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
          tooltip={sidebarState === "collapsed" ? t(link.labelKey) : undefined}
        >
          <a>
            <link.icon />
            <span>{t(link.labelKey)}</span> 
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {/* Link from next-intl/link will handle locale */}
        <Link href={`/dashboard`} className="flex items-center gap-2 text-primary">
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
              <SidebarMenuButton onClick={handleLogout} tooltip={sidebarState === "collapsed" ? t("logout") : undefined}>
                <LogOut />
                <span>{t("logout")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
