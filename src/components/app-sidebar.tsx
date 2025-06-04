
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
import type { NavLink as NavLinkTypeDefinition } from "@/config/links"; 
import { mainNavLinks, secondaryNavLinks } from "@/config/links"; 
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation'; // Standard hook for params

export function AppSidebar() {
  const pathname = usePathname(); // next-intl version (locale-agnostic)
  const params = useParams(); // next/navigation version to get current locale
  const currentLocale = typeof params.locale === 'string' ? params.locale : 'en';

  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); 
  const { state: sidebarState } = useSidebar();
  const tSidebar = useTranslations("Sidebar");
  const tToast = useTranslations("Toast");
  const tAppName = useTranslations("App.name");

  const toastLogoutSuccessTitle = tToast("logoutSuccessTitle");
  const toastLogoutSuccessDescription = tToast("logoutSuccessDescription");
  const toastLogoutFailedTitle = tToast("logoutFailedTitle");
  const logoutButtonText = tSidebar("logout");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: toastLogoutSuccessTitle, description: toastLogoutSuccessDescription });
      router.push(`/login`, {locale: currentLocale}); 
    } catch (error: any) {
      toast({ title: toastLogoutFailedTitle, description: error.message, variant: "destructive" });
    }
  };

  const renderNavLink = (link: NavLinkTypeDefinition, index: number) => (
    <SidebarMenuItem key={`${link.labelKey}-${index}`}>
      <Link href={link.href} passHref legacyBehavior locale={currentLocale}>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
          tooltip={sidebarState === "collapsed" ? tSidebar(link.labelKey as any) : undefined} 
        >
          <a>
            <link.icon />
            <span>{tSidebar(link.labelKey as any)}</span> 
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" locale={currentLocale} className="flex items-center gap-2 text-primary"> 
            <TrendingUp className="h-8 w-8" />
            {sidebarState === "expanded" && <span className="text-xl font-headline font-semibold">{tAppName()}</span>}
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
          {!loading && mainNavLinks.map(renderNavLink)}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {!loading && secondaryNavLinks.map((link, index) => renderNavLink(link, index))}
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
