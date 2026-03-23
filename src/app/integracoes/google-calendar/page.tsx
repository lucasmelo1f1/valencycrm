"use client";

import { Puzzle, Calendar, CheckCircle2, ExternalLink } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "Google Calendar", description: "Sincronize reuniões e agendamentos", connected: true, icon: Calendar },
    { name: "Google Sheets", description: "Exporte dados para planilhas", connected: false, icon: ExternalLink },
  ];

  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-bold font-serif text-v-text-primary">Integrações</h1>
        <p className="text-sm text-v-text-muted mt-1">Conecte ferramentas externas ao Valency</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="glass-card rounded-2xl p-5 hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.04)]">
                <integration.icon size={24} className="text-v-text-secondary" />
              </div>
              {integration.connected && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-v-accent">
                  <CheckCircle2 size={14} />
                  Conectado
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-v-text-primary">{integration.name}</h3>
            <p className="text-xs text-v-text-muted mt-1">{integration.description}</p>
            <button
              className={`mt-4 w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                integration.connected
                  ? "bg-[rgba(255,255,255,0.04)] text-v-text-secondary hover:bg-[rgba(255,255,255,0.06)]"
                  : "bg-v-accent text-white hover:bg-v-accent/80"
              }`}
            >
              {integration.connected ? "Configurar" : "Conectar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
