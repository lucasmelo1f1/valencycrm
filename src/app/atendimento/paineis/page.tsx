"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Phone,
  Mail,
  Building2,
  Tag,
  Clock,
  X,
  ChevronRight,
  MessageSquare,
  Filter,
  LayoutGrid,
  List,
  Bot,
  UserCircle,
  DollarSign,
  StickyNote,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { kanbanLeads, kanbanColumns, type KanbanLead } from "@/lib/mock-kanban";
import { LeadStatus, ContactOrigin } from "@/types";

const originIcons: Record<ContactOrigin, { icon: string; color: string }> = {
  whatsapp: { icon: "W", color: "text-emerald-400 bg-emerald-500/15" },
  site: { icon: "S", color: "text-blue-400 bg-blue-500/15" },
  indicacao: { icon: "I", color: "text-amber-400 bg-amber-500/15" },
  google_ads: { icon: "G", color: "text-red-400 bg-red-500/15" },
  instagram: { icon: "IG", color: "text-pink-400 bg-pink-500/15" },
};

const originLabels: Record<ContactOrigin, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  google_ads: "Google Ads",
  instagram: "Instagram",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function PaineisPage() {
  const [leads, setLeads] = useState<KanbanLead[]>(kanbanLeads);
  const [selectedLead, setSelectedLead] = useState<KanbanLead | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterOrigin, setFilterOrigin] = useState<ContactOrigin | "all">("all");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchAssignee = filterAssignee === "all" || l.assignedTo === filterAssignee;
      const matchOrigin = filterOrigin === "all" || l.origin === filterOrigin;
      return matchAssignee && matchOrigin;
    });
  }, [leads, filterAssignee, filterOrigin]);

  const columnData = useMemo(() => {
    return kanbanColumns.map((col) => ({
      ...col,
      leads: filtered.filter((l) => l.status === col.id),
    }));
  }, [filtered]);

  const activeLeads = filtered.filter((l) => l.status !== "desqualificado");
  const totalValue = activeLeads.reduce((sum, l) => sum + l.value, 0);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      const newStatus = destination.droppableId as LeadStatus;

      setLeads((prev) =>
        prev.map((l) => (l.id === draggableId ? { ...l, status: newStatus } : l))
      );

      const col = kanbanColumns.find((c) => c.id === newStatus);
      if (col) showToast(`Lead movido para ${col.title}`);
    },
    [showToast]
  );

  const moveToNextStage = useCallback(
    (lead: KanbanLead) => {
      const stages: LeadStatus[] = [
        "novo",
        "em_qualificacao",
        "qualificado",
        "agendou_consulta",
        "compareceu_consulta",
        "proposta_procedimento",
        "fechou_cirurgia",
      ];
      const currentIdx = stages.indexOf(lead.status);
      if (currentIdx < 0 || currentIdx >= stages.length - 1) return;
      const next = stages[currentIdx + 1];

      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l))
      );
      setSelectedLead((prev) =>
        prev?.id === lead.id ? { ...prev, status: next } : prev
      );

      const col = kanbanColumns.find((c) => c.id === next);
      if (col) showToast(`Lead movido para ${col.title}`);
    },
    [showToast]
  );

  const disqualifyLead = useCallback(
    (lead: KanbanLead) => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id ? { ...l, status: "desqualificado" as LeadStatus } : l
        )
      );
      setSelectedLead((prev) =>
        prev?.id === lead.id
          ? { ...prev, status: "desqualificado" as LeadStatus }
          : prev
      );
      showToast("Lead desqualificado");
    },
    [showToast]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-serif font-semibold text-v-text-primary">
            Funil de <em className="italic">Vendas</em>
          </h1>
          <p className="text-xs text-v-text-muted mt-1">Gerencie suas negociações</p>
        </div>
        <button className="h-8 px-4 rounded-pill bg-v-accent hover:bg-v-accent-hover text-white text-xs font-medium flex items-center gap-1.5 transition-colors">
          <Plus size={14} />
          Novo Lead
        </button>
      </div>

      {/* Filters + Summary */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px]">
            <Filter size={12} className="text-v-text-muted" />
          </div>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="h-7 px-2.5 rounded-input bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[11px] text-v-text-primary focus:outline-none focus:border-v-accent appearance-none cursor-pointer"
          >
            <option value="all">Responsável</option>
            <option value="IA Valency">IA Valency</option>
            <option value="Dr. Ricardo">Dr. Ricardo</option>
            <option value="Dra. Carla">Dra. Carla</option>
            <option value="Dra. Mariana">Dra. Mariana</option>
          </select>
          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value as ContactOrigin | "all")}
            className="h-7 px-2.5 rounded-input bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[11px] text-v-text-primary focus:outline-none focus:border-v-accent appearance-none cursor-pointer"
          >
            <option value="all">Origem</option>
            {Object.entries(originLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <div className="flex items-center border border-[rgba(255,255,255,0.06)] rounded-input overflow-hidden">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "h-7 w-7 flex items-center justify-center transition-colors",
                viewMode === "kanban"
                  ? "bg-v-accent-subtle text-v-accent"
                  : "text-v-text-muted hover:text-v-text-primary"
              )}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "h-7 w-7 flex items-center justify-center transition-colors",
                viewMode === "list"
                  ? "bg-v-accent-subtle text-v-accent"
                  : "text-v-text-muted hover:text-v-text-primary"
              )}
            >
              <List size={13} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-v-text-muted">
            <span className="font-mono font-bold text-v-text-secondary">{activeLeads.length}</span> negociações ativas
          </span>
          <span className="text-[11px] text-v-text-muted">
            Valor total:{" "}
            <span className="font-mono font-bold text-v-accent">{formatCurrency(totalValue)}/mês</span>
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6" style={{ minHeight: "calc(100vh - 14rem)" }}>
            {columnData.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-[240px] flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: column.color }}
                    />
                    <span className="text-[11px] font-semibold text-v-text-primary">
                      {column.title}
                    </span>
                    <span className="text-[10px] text-v-text-muted bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded font-mono">
                      {column.leads.length}
                    </span>
                  </div>
                </div>

                {/* Droppable Column */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex-1 rounded-card-sm p-1.5 space-y-1.5 overflow-y-auto transition-colors",
                        snapshot.isDraggingOver
                          ? "bg-v-accent-subtle/30 border border-v-accent/20"
                          : "bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)]"
                      )}
                      style={{ maxHeight: "calc(100vh - 16rem)" }}
                    >
                      {column.leads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedLead(lead)}
                              className={cn(
                                "bg-v-bg rounded-xl border p-3 cursor-pointer transition-all",
                                snapshot.isDragging
                                  ? "border-v-accent/40 shadow-lg shadow-v-accent/10 rotate-1"
                                  : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.02)]"
                              )}
                            >
                              {/* Lead Name + Origin */}
                              <div className="flex items-start justify-between mb-1.5">
                                <p className="text-[12px] font-medium text-v-text-primary leading-tight">
                                  {lead.name}
                                </p>
                                <span
                                  className={cn(
                                    "text-[8px] font-bold px-1 py-0.5 rounded flex-shrink-0 ml-1",
                                    originIcons[lead.origin].color
                                  )}
                                >
                                  {originIcons[lead.origin].icon}
                                </span>
                              </div>

                              {/* Company */}
                              {lead.company && (
                                <p className="text-[10px] text-v-text-muted mb-1.5">{lead.company}</p>
                              )}

                              {/* Area badge */}
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-v-text-muted inline-block mb-2">
                                {lead.area}
                              </span>

                              {/* Value */}
                              <p className="text-[11px] font-mono font-bold text-v-accent mb-2">
                                {formatCurrency(lead.value)}/mês
                              </p>

                              {/* Assignee + Date */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {lead.assignedTo === "IA Valency" ? (
                                    <Bot size={9} className="text-v-accent" />
                                  ) : (
                                    <UserCircle size={9} className="text-blue-400" />
                                  )}
                                  <span className="text-[9px] text-v-text-muted">{lead.assignedTo}</span>
                                </div>
                                <span className="text-[9px] text-v-text-muted font-mono">
                                  {format(parseISO(lead.createdAt), "dd/MM")}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {column.leads.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-[10px] text-v-text-muted">Nenhum lead</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        /* ── List View ── */
        <div className="glass-card !rounded-card-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Lead</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Área</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Valor</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Status</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Origem</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Responsável</th>
                <th className="label-meta text-left px-4 py-2.5 !text-[9px]">Criado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const col = kanbanColumns.find((c) => c.id === lead.status);
                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-medium text-v-text-primary">{lead.name}</p>
                      {lead.company && (
                        <p className="text-[10px] text-v-text-muted">{lead.company}</p>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-v-text-muted">
                        {lead.area}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-mono font-bold text-v-accent">
                        {formatCurrency(lead.value)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: col?.color }}
                        />
                        <span className="text-[10px] text-v-text-secondary">{col?.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] text-v-text-secondary">
                        {originLabels[lead.origin]}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {lead.assignedTo === "IA Valency" ? (
                          <Bot size={10} className="text-v-accent" />
                        ) : (
                          <UserCircle size={10} className="text-blue-400" />
                        )}
                        <span className="text-[10px] text-v-text-secondary">
                          {lead.assignedTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] text-v-text-muted font-mono">
                        {format(parseISO(lead.createdAt), "dd/MM")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Lead Detail Modal ── */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setSelectedLead(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-[420px] max-w-full h-full bg-v-bg border-l border-[rgba(255,255,255,0.06)] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-v-bg border-b border-[rgba(255,255,255,0.06)] px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-serif font-semibold text-v-text-primary">
                Detalhes do Lead
              </h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] text-v-text-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Name + Status */}
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-sm font-semibold text-v-text-secondary">
                    {selectedLead.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-v-text-primary">
                      {selectedLead.name}
                    </h3>
                    {selectedLead.company && (
                      <p className="text-[11px] text-v-text-muted">{selectedLead.company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {(() => {
                    const col = kanbanColumns.find((c) => c.id === selectedLead.status);
                    return (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${col?.color}20`,
                          color: col?.color,
                        }}
                      >
                        {col?.title}
                      </span>
                    );
                  })()}
                  <span
                    className={cn(
                      "text-[9px] font-medium px-1.5 py-0.5 rounded",
                      originIcons[selectedLead.origin].color
                    )}
                  >
                    {originLabels[selectedLead.origin]}
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="glass-card !rounded-card-sm p-3 flex items-center gap-3">
                <DollarSign size={16} className="text-v-accent" />
                <div>
                  <p className="text-lg font-mono font-bold text-v-accent">
                    {formatCurrency(selectedLead.value)}
                    <span className="text-[11px] text-v-text-muted font-normal">/mês</span>
                  </p>
                  <p className="text-[10px] text-v-text-muted">Valor estimado da negociação</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5">
                <p className="label-meta">Contato</p>
                <div className="flex items-center gap-2 text-[11px]">
                  <Phone size={12} className="text-v-text-muted" />
                  <span className="text-v-text-secondary font-mono">{selectedLead.phone}</span>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Mail size={12} className="text-v-text-muted" />
                    <span className="text-v-text-secondary">{selectedLead.email}</span>
                  </div>
                )}
                {selectedLead.company && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Building2 size={12} className="text-v-text-muted" />
                    <span className="text-v-text-secondary">{selectedLead.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px]">
                  <Tag size={12} className="text-v-text-muted" />
                  <span className="text-v-text-secondary">{selectedLead.area}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  {selectedLead.assignedTo === "IA Valency" ? (
                    <Bot size={12} className="text-v-accent" />
                  ) : (
                    <UserCircle size={12} className="text-blue-400" />
                  )}
                  <span className="text-v-text-secondary">{selectedLead.assignedTo}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="label-meta mb-2">Notas</p>
                {selectedLead.notes ? (
                  <p className="text-[11px] text-v-text-secondary bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.06)] p-3 leading-relaxed">
                    {selectedLead.notes}
                  </p>
                ) : (
                  <p className="text-[10px] text-v-text-muted italic">Nenhuma nota</p>
                )}
                <textarea
                  placeholder="Adicionar nota..."
                  className="w-full mt-2 h-16 px-3 py-2 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-[11px] text-v-text-primary placeholder:text-v-text-muted focus:outline-none focus:border-v-accent resize-none transition-colors"
                />
              </div>

              {/* Timeline */}
              <div>
                <p className="label-meta mb-3">Timeline</p>
                <div className="relative">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[rgba(255,255,255,0.06)]" />
                  <div className="space-y-3">
                    {selectedLead.timeline.map((event, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div
                          className={cn(
                            "w-[11px] h-[11px] rounded-full border-2 flex-shrink-0 mt-0.5 z-10",
                            i === selectedLead.timeline.length - 1
                              ? "border-v-accent bg-v-accent"
                              : "border-[rgba(255,255,255,0.15)] bg-v-bg"
                          )}
                        />
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

              {/* Last Activity */}
              <div className="flex items-center gap-2 text-[10px] text-v-text-muted">
                <MessageSquare size={10} />
                <span>{selectedLead.lastActivity}</span>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-2 text-[10px] text-v-text-muted">
                <Clock size={10} />
                <span>
                  Criado em{" "}
                  {format(parseISO(selectedLead.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {selectedLead.status !== "fechou_cirurgia" &&
                  selectedLead.status !== "desqualificado" && (
                    <button
                      onClick={() => moveToNextStage(selectedLead)}
                      className="flex-1 h-9 rounded-pill bg-v-accent hover:bg-v-accent-hover text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ChevronRight size={14} />
                      Próxima etapa
                    </button>
                  )}
                {selectedLead.status !== "desqualificado" && (
                  <button
                    onClick={() => disqualifyLead(selectedLead)}
                    className="h-9 px-4 rounded-pill border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X size={14} />
                    Desqualificar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-fade-in">
          <div className="bg-v-accent text-white text-xs font-medium px-4 py-2.5 rounded-pill shadow-lg shadow-v-accent/20 flex items-center gap-2">
            <ChevronRight size={14} />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
