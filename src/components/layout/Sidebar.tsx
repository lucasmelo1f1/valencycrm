"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageCircle,
  Puzzle,
  MessagesSquare,
  Users,
  Columns3,
  GitBranch,
  UserCog,
  Mic,
  Settings,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Link2,
  Headphones,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Conexões",
    icon: <Link2 size={20} />,
    children: [
      { label: "WhatsApp", href: "/integracoes/whatsapp", icon: <MessageCircle size={18} /> },
      { label: "Integrações", href: "/integracoes/google-calendar", icon: <Puzzle size={18} /> },
    ],
  },
  {
    label: "Atendimento",
    icon: <Headphones size={20} />,
    children: [
      { label: "Conversas", href: "/atendimento/conversas", icon: <MessagesSquare size={18} /> },
      { label: "Contatos", href: "/atendimento/contatos", icon: <Users size={18} /> },
      { label: "Painéis", href: "/atendimento/paineis", icon: <Columns3 size={18} /> },
    ],
  },
  { label: "Fluxos", href: "/fluxos", icon: <GitBranch size={20} /> },
  { label: "Membros", href: "/membros", icon: <UserCog size={20} /> },
  { label: "Voz", href: "/voz", icon: <Mic size={20} /> },
  { label: "Configurações", href: "/configuracoes", icon: <Settings size={20} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Conexões: true,
    Atendimento: true,
  });

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) return item.children.some((child) => isActive(child.href));
    return isActive(item.href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-[rgba(255,255,255,0.06)] transition-all duration-300 flex-shrink-0",
        "bg-[rgba(255,255,255,0.02)] backdrop-blur-xl",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-[rgba(255,255,255,0.06)]">
        <Link href="/dashboard" className="flex items-center gap-1">
          <span
            className={cn(
              "font-serif font-bold text-v-text-primary tracking-tighter transition-all",
              collapsed ? "text-xl" : "text-[1.6rem]"
            )}
          >
            {collapsed ? "V" : "Valency"}
          </span>
          <span className="w-2 h-2 rounded-full bg-v-accent flex-shrink-0 mt-auto mb-1.5" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.children) {
            const parentActive = isParentActive(item);
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSection(item.label)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    parentActive
                      ? "text-v-text-primary"
                      : "text-v-text-secondary hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)]"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          openSections[item.label] ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                {!collapsed && openSections[item.label] && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 relative",
                          isActive(child.href)
                            ? "bg-v-accent-subtle text-v-accent font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-v-accent before:rounded-r"
                            : "text-v-text-secondary hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)]"
                        )}
                      >
                        <span className="flex-shrink-0">{child.icon}</span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive(item.href)
                  ? "bg-v-accent-subtle text-v-accent before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-5 before:bg-v-accent before:rounded-r"
                  : "text-v-text-secondary hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-v-text-secondary hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200 w-full"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
