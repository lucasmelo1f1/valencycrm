"use client";

import { teamMembers } from "@/lib/mock-data";
import { Plus, MoreHorizontal, Shield, Headphones, Eye } from "lucide-react";

const roleConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: "Admin", icon: <Shield size={12} />, color: "bg-amber-500/20 text-amber-400" },
  atendente: { label: "Atendente", icon: <Headphones size={12} />, color: "bg-blue-500/20 text-blue-400" },
  viewer: { label: "Visualizador", icon: <Eye size={12} />, color: "bg-gray-500/20 text-gray-400" },
};

export default function MembrosPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif text-v-text-primary">Membros</h1>
          <p className="text-sm text-v-text-muted mt-1">{teamMembers.length} membros na equipe</p>
        </div>
        <button className="h-9 px-4 rounded-lg bg-v-accent text-white text-sm font-medium hover:bg-v-accent/80 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Convidar
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)]">
              <th className="text-left text-xs font-medium text-v-text-muted uppercase tracking-wider px-5 py-3">Membro</th>
              <th className="text-left text-xs font-medium text-v-text-muted uppercase tracking-wider px-5 py-3">Função</th>
              <th className="text-left text-xs font-medium text-v-text-muted uppercase tracking-wider px-5 py-3">Chats ativos</th>
              <th className="text-left text-xs font-medium text-v-text-muted uppercase tracking-wider px-5 py-3">Conversões</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => {
              const role = roleConfig[member.role];
              return (
                <tr key={member.id} className="border-b border-[rgba(255,255,255,0.06)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-v-accent-subtle flex items-center justify-center text-xs font-semibold text-v-accent">
                        {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-v-text-primary">{member.name}</p>
                        <p className="text-xs text-v-text-muted">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`label-meta inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${role.color}`}>
                      {role.icon}
                      {role.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-v-text-secondary">{member.activeChats}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono text-v-text-secondary">{member.conversions}</span>
                  </td>
                  <td className="px-3 py-4">
                    <button className="p-1 rounded hover:bg-[rgba(255,255,255,0.04)] text-v-text-muted">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
