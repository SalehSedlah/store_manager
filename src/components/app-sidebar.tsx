"use client";

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
import { Link, useRouter, usePathname } from '@/navigation'; // Use localized navigation
import {useTranslations} from 'next-intl';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); 
  const { state: sidebarState } = useSidebar();
  const t = useTranslations('AppSidebar');
  
  const appName = t('appName');
  const tSidebarLabels: Record<NavLinkTypeDefinition['labelKey'], string> = {
    dashboard: t('navLinks.dashboard'),
    debtManagement: t('navLinks.debtManagement'),
    aiAssistant: t('navLinks.aiAssistant'),
    products: t('navLinks.products'),
    settings: t('navLinks.settings')
  };
  const toastLogoutSuccessTitle = "تم تسجيل الخروج"; // Can be translated
  const toastLogoutSuccessDescription = "لقد تم تسجيل خروجك بنجاح."; // Can be translated
  const toastLogoutFailedTitle = "فشل تسجيل الخروج"; // Can be translated
  const logoutButtonText = t('logoutButtonText');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: toastLogoutSuccessTitle, description: toastLogoutSuccessDescription });
      router.push(`/login`); // Localized router handles prefix
    } catch (error: any) {
      toast({ title: toastLogoutFailedTitle, description: error.message, variant: "destructive" });
    }
  };

  const renderNavLink = (link: NavLinkTypeDefinition, index: number) => {
    const label = tSidebarLabels[link.labelKey] || link.labelKey; // Fallback to key if not found
    return (
    <SidebarMenuItem key={`${link.labelKey}-${index}`}>
      <Link href={link.href} passHref legacyBehavior>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))}
          tooltip={sidebarState === "collapsed" ? label : undefined} 
        >
          <a>
            <link.icon />
            <span>{label}</span> 
          </a>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  )};

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-primary"> 
            <TrendingUp className="h-8 w-8" />
            {sidebarState === "expanded" && <span className="text-xl font-headline font-semibold">{appName}</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {loading && (
            <>
              <SidebarMenuSkeleton showIcon />
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
