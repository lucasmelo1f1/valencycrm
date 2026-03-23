"use client";

import { Mic, Phone, PhoneOff, Volume2 } from "lucide-react";

export default function VozPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-bold font-serif text-v-text-primary">Voz</h1>
        <p className="text-sm text-v-text-muted mt-1">Atendimento por voz com IA</p>
      </div>

      <div className="glass-card rounded-2xl p-12 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-v-accent-subtle flex items-center justify-center">
          <Mic size={40} className="text-v-accent" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold font-serif text-v-text-primary">Atendimento por Voz</h2>
          <p className="text-sm text-v-text-muted mt-2 max-w-md">
            Configure o agente de voz com IA para atender ligações automaticamente, agendar consultas e qualificar pacientes por telefone.
          </p>
        </div>
        <button className="h-10 px-6 rounded-lg bg-v-accent text-white text-sm font-medium hover:bg-v-accent/80 transition-colors flex items-center gap-2">
          <Phone size={16} />
          Configurar Agente de Voz
        </button>
      </div>
    </div>
  );
}
