"use client";

import { Settings, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react";

const sections = [
  { icon: Settings, title: "Geral", description: "Nome da clínica, fuso horário, idioma" },
  { icon: Bell, title: "Notificações", description: "Alertas por e-mail e push" },
  { icon: Shield, title: "Segurança", description: "Autenticação, senhas, acessos" },
  { icon: Palette, title: "Aparência", description: "Tema, cores, personalização" },
  { icon: Globe, title: "Domínio", description: "Domínio personalizado e DNS" },
  { icon: CreditCard, title: "Faturamento", description: "Plano, pagamentos, faturas" },
];

export default function ConfiguracoesPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-bold font-serif text-v-text-primary">Configurações</h1>
        <p className="text-sm text-v-text-muted mt-1">Gerencie as configurações da sua conta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <button
            key={section.title}
            className="glass-card rounded-2xl p-5 text-left hover:border-[rgba(255,255,255,0.12)] transition-colors group"
          >
            <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.04)] w-fit mb-3 group-hover:bg-v-accent-subtle transition-colors">
              <section.icon size={20} className="text-v-text-secondary group-hover:text-v-accent transition-colors" />
            </div>
            <h3 className="text-sm font-semibold text-v-text-primary">{section.title}</h3>
            <p className="text-xs text-v-text-muted mt-1">{section.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
