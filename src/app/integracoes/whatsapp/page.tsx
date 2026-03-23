"use client";

import { MessageCircle, Smartphone, QrCode, CheckCircle2 } from "lucide-react";

export default function WhatsAppPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-bold font-serif text-v-text-primary">WhatsApp</h1>
        <p className="text-sm text-v-text-muted mt-1">Gerencie suas conexões de WhatsApp</p>
      </div>

      <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-v-accent-subtle flex items-center justify-center">
          <MessageCircle size={32} className="text-v-accent" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold font-serif text-v-text-primary">Conectar WhatsApp</h2>
          <p className="text-sm text-v-text-muted mt-1 max-w-md">
            Escaneie o QR Code com seu WhatsApp para conectar seu número ao Valency CRM
          </p>
        </div>
        <div className="w-48 h-48 bg-[rgba(255,255,255,0.04)] rounded-xl border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
          <QrCode size={120} className="text-v-text-muted" />
        </div>
        <div className="flex items-center gap-2 text-v-accent">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">1 dispositivo conectado</span>
        </div>
      </div>
    </div>
  );
}
