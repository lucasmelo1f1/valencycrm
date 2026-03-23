"use client";

import { Search, Bell, User } from "lucide-react";
import { useScrollHeader } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const scrolled = useScrollHeader("main");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-16 flex items-center justify-between px-6 flex-shrink-0 transition-all duration-500",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted" />
          <input
            type="text"
            placeholder="Buscar leads, contatos..."
            className="w-full h-9 pl-9 pr-4 rounded-input bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-sm text-v-text-primary placeholder:text-v-text-muted focus:outline-none focus:border-v-accent/40 transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-input text-v-text-secondary hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-v-accent rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-v-accent-subtle flex items-center justify-center">
            <User size={16} className="text-v-accent" />
          </div>
        </div>
      </div>
    </header>
  );
}
