"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bot,
  User,
  Send,
  Phone,
  Mail,
  Building2,
  Tag,
  Clock,
  ChevronRight,
  Sparkles,
  UserCircle,
  MessageSquare,
} from "lucide-react";
import { conversations } from "@/lib/mock-conversations";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChatStatus, LeadStatus } from "@/types";

const chatStatusConfig: Record<ChatStatus, { label: string; color: string; bg: string }> = {
  qualificando: { label: "Qualificando", color: "text-amber-400", bg: "bg-amber-500/15" },
  agendando: { label: "Agendando", color: "text-blue-400", bg: "bg-blue-500/15" },
  aguardando: { label: "Aguardando", color: "text-purple-400", bg: "bg-purple-500/15" },
  finalizado: { label: "Finalizado", color: "text-gray-400", bg: "bg-gray-500/15" },
};

const leadStatusConfig: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  novo: { label: "Novo", color: "text-gray-400", bg: "bg-gray-500/15" },
  em_qualificacao: { label: "Em Qualificação", color: "text-amber-400", bg: "bg-amber-500/15" },
  qualificado: { label: "Qualificado", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  reuniao_agendada: { label: "Reunião Agendada", color: "text-blue-400", bg: "bg-blue-500/15" },
  proposta_enviada: { label: "Proposta Enviada", color: "text-cyan-400", bg: "bg-cyan-500/15" },
  contrato_assinado: { label: "Contrato Assinado", color: "text-green-400", bg: "bg-green-500/15" },
  desqualificado: { label: "Desqualificado", color: "text-red-400", bg: "bg-red-500/15" },
};

const originLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  google_ads: "Google Ads",
  instagram: "Instagram",
};

export default function ConversasPage() {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selected = conversations.find((c) => c.id === selectedId);

  const filtered = conversations.filter((c) =>
    c.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId]);

  return (
    <div className="flex -m-6" style={{ height: "calc(100vh - 5rem)" }}>
      {/* ── Left Panel: Conversation List (30%) ── */}
      <div className="w-[30%] min-w-[280px] border-r border-[rgba(255,255,255,0.06)] flex flex-col bg-[rgba(255,255,255,0.01)]">
        <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
          <h2 className="text-base font-serif font-semibold text-v-text-primary mb-3">
            <em className="italic">Conversas</em>
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full h-8 pl-8 pr-3 rounded-input bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-xs text-v-text-primary placeholder:text-v-text-muted focus:outline-none focus:border-v-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => {
            const cs = chatStatusConfig[conv.chatStatus];
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] transition-all text-left",
                  selectedId === conv.id
                    ? "bg-v-accent-subtle border-l-2 border-l-v-accent"
                    : "hover:bg-[rgba(255,255,255,0.03)]"
                )}
              >
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="w-9 h-9 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-xs font-semibold text-v-text-secondary">
                    {conv.contact.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  {conv.isAI && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-v-accent flex items-center justify-center">
                      <Bot size={9} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-medium text-v-text-primary truncate">
                      {conv.contact.name}
                    </span>
                    <span className="text-[10px] text-v-text-muted flex-shrink-0 ml-2 font-mono">
                      {format(parseISO(conv.contact.lastMessageAt), "HH:mm")}
                    </span>
                  </div>
                  <p className="text-[11px] text-v-text-muted truncate mt-0.5">
                    {conv.messages[conv.messages.length - 1]?.content}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium", cs.bg, cs.color)}>
                      {cs.label}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-v-accent text-[9px] font-bold text-white flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-v-text-muted font-mono">{conversations.length} conversas</span>
            <span className="text-[10px] text-v-accent font-mono">
              {conversations.filter((c) => c.unreadCount > 0).length} não lidas
            </span>
          </div>
        </div>
      </div>

      {/* ── Center Panel: Active Chat (45%) ── */}
      <div className="w-[45%] flex flex-col bg-v-bg">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="h-14 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-5 bg-[rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-xs font-semibold text-v-text-secondary">
                  {selected.contact.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-v-text-primary">{selected.contact.name}</p>
                  <p className="text-[10px] text-v-text-muted font-mono">{selected.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.isAI ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-v-accent bg-v-accent-subtle px-2 py-1 rounded-full">
                    <Sparkles size={10} />
                    IA Ativa
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-blue-400 bg-blue-500/15 px-2 py-1 rounded-full">
                    <UserCircle size={10} />
                    Humano
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {selected.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 max-w-[80%]",
                    msg.sender === "contact" ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    {msg.sender === "ai" ? (
                      <div className="w-full h-full rounded-full bg-v-accent-subtle flex items-center justify-center">
                        <Bot size={12} className="text-v-accent" />
                      </div>
                    ) : msg.sender === "human" ? (
                      <div className="w-full h-full rounded-full bg-blue-500/15 flex items-center justify-center">
                        <UserCircle size={12} className="text-blue-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
                        <User size={12} className="text-v-text-muted" />
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed",
                      msg.sender === "contact"
                        ? "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-v-text-primary"
                        : msg.sender === "ai"
                        ? "bg-v-accent-subtle text-v-text-primary"
                        : "bg-blue-500/10 border border-blue-500/20 text-v-text-primary"
                    )}
                  >
                    {msg.sender === "human" && (
                      <p className="text-[9px] font-medium text-blue-400 mb-1">
                        {selected.contact.assignedTo}
                      </p>
                    )}
                    {msg.content}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="text-[9px] text-v-text-muted font-mono">
                        {format(parseISO(msg.timestamp), "HH:mm")}
                      </span>
                      {msg.sender !== "contact" && msg.status && (
                        <span className="text-[9px] text-v-text-muted">
                          {msg.status === "read" ? "✓✓" : msg.status === "delivered" ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[rgba(255,255,255,0.06)] p-3 bg-[rgba(255,255,255,0.02)]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1 h-9 px-4 rounded-pill bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-sm text-v-text-primary placeholder:text-v-text-muted focus:outline-none focus:border-v-accent transition-colors"
                />
                <button className="h-9 w-9 rounded-full bg-v-accent hover:bg-v-accent-hover flex items-center justify-center transition-colors">
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <MessageSquare size={40} className="text-v-text-muted opacity-30" />
            <p className="text-sm text-v-text-muted">Selecione uma conversa</p>
          </div>
        )}
      </div>

      {/* ── Right Panel: Lead Info (25%) ── */}
      <div className="w-[25%] min-w-[240px] border-l border-[rgba(255,255,255,0.06)] flex flex-col bg-[rgba(255,255,255,0.01)] overflow-y-auto">
        {selected ? (
          <div className="p-5">
            {/* Contact Info */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-lg font-semibold text-v-text-secondary mb-3">
                {selected.contact.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="text-sm font-serif font-semibold text-v-text-primary">
                {selected.contact.name}
              </h3>
              {selected.contact.company && (
                <p className="text-[11px] text-v-text-muted mt-0.5">{selected.contact.company}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full font-medium",
                  leadStatusConfig[selected.contact.status].bg,
                  leadStatusConfig[selected.contact.status].color
                )}>
                  {leadStatusConfig[selected.contact.status].label}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2.5 text-[11px]">
                <Phone size={12} className="text-v-text-muted flex-shrink-0" />
                <span className="text-v-text-secondary font-mono">{selected.contact.phone}</span>
              </div>
              {selected.contact.email && (
                <div className="flex items-center gap-2.5 text-[11px]">
                  <Mail size={12} className="text-v-text-muted flex-shrink-0" />
                  <span className="text-v-text-secondary truncate">{selected.contact.email}</span>
                </div>
              )}
              {selected.contact.company && (
                <div className="flex items-center gap-2.5 text-[11px]">
                  <Building2 size={12} className="text-v-text-muted flex-shrink-0" />
                  <span className="text-v-text-secondary">{selected.contact.company}</span>
                </div>
              )}
              {selected.contact.area && (
                <div className="flex items-center gap-2.5 text-[11px]">
                  <Tag size={12} className="text-v-text-muted flex-shrink-0" />
                  <span className="text-v-text-secondary">{selected.contact.area}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-[11px]">
                <ChevronRight size={12} className="text-v-text-muted flex-shrink-0" />
                <span className="text-v-text-secondary">Origem: {originLabels[selected.contact.origin]}</span>
              </div>
            </div>

            {/* Tags */}
            {selected.contact.tags.length > 0 && (
              <div className="mb-5">
                <p className="label-meta mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-v-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned */}
            <div className="mb-5">
              <p className="label-meta mb-2">Responsável</p>
              <div className="flex items-center gap-2">
                {selected.contact.assignedTo === "IA Valency" ? (
                  <Bot size={14} className="text-v-accent" />
                ) : (
                  <UserCircle size={14} className="text-blue-400" />
                )}
                <span className="text-xs text-v-text-secondary">{selected.contact.assignedTo}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[rgba(255,255,255,0.06)] my-4" />

            {/* Timeline */}
            <div>
              <p className="label-meta mb-3">Timeline</p>
              <div className="relative">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.06)]" />
                <div className="space-y-3">
                  {selected.timeline.map((event, i) => (
                    <div key={event.id} className="flex items-start gap-3 relative">
                      <div className={cn(
                        "w-[11px] h-[11px] rounded-full border-2 flex-shrink-0 mt-0.5 z-10",
                        i === selected.timeline.length - 1
                          ? "border-v-accent bg-v-accent"
                          : "border-[rgba(255,255,255,0.15)] bg-v-bg"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-v-text-secondary leading-snug">
                          {event.label}
                        </p>
                        <p className="text-[9px] text-v-text-muted font-mono mt-0.5">
                          {format(parseISO(event.timestamp), "dd/MM 'às' HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Created at */}
            <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2 text-[10px] text-v-text-muted">
                <Clock size={10} />
                <span>Criado em {format(parseISO(selected.contact.createdAt), "dd/MM/yyyy 'às' HH:mm")}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-v-text-muted">Nenhum lead selecionado</p>
          </div>
        )}
      </div>
    </div>
  );
}
