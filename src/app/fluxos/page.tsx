"use client";

import { GitBranch, Plus, Play, Pause, MoreHorizontal } from "lucide-react";

const flows = [
  { id: 1, name: "Boas-vindas Clínica", status: "active", triggers: 234, conversions: 89 },
  { id: 2, name: "Qualificação de Lead", status: "active", triggers: 156, conversions: 67 },
  { id: 3, name: "Agendamento de Consulta", status: "active", triggers: 98, conversions: 45 },
  { id: 4, name: "Follow-up Pós-Consulta", status: "paused", triggers: 42, conversions: 18 },
  { id: 5, name: "Reativação de Pacientes", status: "paused", triggers: 0, conversions: 0 },
];

export default function FluxosPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif text-v-text-primary">Fluxos</h1>
          <p className="text-sm text-v-text-muted mt-1">Automações de atendimento via IA</p>
        </div>
        <button className="h-9 px-4 rounded-lg bg-v-accent text-white text-sm font-medium hover:bg-v-accent/80 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Novo Fluxo
        </button>
      </div>

      <div className="grid gap-4">
        {flows.map((flow) => (
          <div key={flow.id} className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-[rgba(255,255,255,0.12)] transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.04)]">
                <GitBranch size={20} className="text-v-text-secondary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-v-text-primary">{flow.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-v-text-muted">
                    <span className="font-mono text-v-text-secondary">{flow.triggers}</span> disparos
                  </span>
                  <span className="text-xs text-v-text-muted">
                    <span className="font-mono text-v-text-secondary">{flow.conversions}</span> conversões
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`label-meta flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                flow.status === "active"
                  ? "bg-v-accent-subtle text-v-accent"
                  : "bg-[rgba(255,255,255,0.04)] text-v-text-muted"
              }`}>
                {flow.status === "active" ? <Play size={10} fill="currentColor" /> : <Pause size={10} />}
                {flow.status === "active" ? "Ativo" : "Pausado"}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)] text-v-text-muted">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
