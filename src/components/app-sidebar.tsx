
"use client";

import { Link, useRouter, usePathname } from "next-intl/navigation";
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
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const t = useTranslations("Sidebar");
  const tApp = useTranslations("App");
  const tToast = useTranslations("Toast");
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { state: sidebarState } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: tToast("logoutSuccessTitle"), description: tToast("logoutSuccessDescription") });
      router.push("/login"); 
    } catch (error: any) {
      toast({ title: tToast("logoutFailedTitle"), description: error.message, variant: "destructive" });
    }
  };

  const navLinksToRender = (links: NavLinkType[]): NavLinkType[] => links.map(link => ({
    ...link,
    label: t(link.label) // Translate the label which is now a key
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
            {sidebarState === "expanded" && <span className="text-xl font-headline font-semibold">{tApp('name')}</span>}
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
              <SidebarMenuButton onClick={handleLogout} tooltip={sidebarState === "collapsed" ? t('logout') : undefined}>
                <LogOut />
                <span>{t('logout')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
