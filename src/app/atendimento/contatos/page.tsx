"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Bot,
  UserCircle,
} from "lucide-react";
import { contacts } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";
import { LeadStatus, ContactOrigin } from "@/types";
import { cn } from "@/lib/utils";

const statusLabels: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  novo: { label: "Novo", color: "text-gray-400", bg: "bg-gray-500/15" },
  em_qualificacao: { label: "Em Qualificação", color: "text-amber-400", bg: "bg-amber-500/15" },
  qualificado: { label: "Qualificado", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  agendou_consulta: { label: "Agendou Consulta", color: "text-blue-400", bg: "bg-blue-500/15" },
  compareceu_consulta: { label: "Compareceu", color: "text-cyan-400", bg: "bg-cyan-500/15" },
  proposta_procedimento: { label: "Proposta Cirurgia", color: "text-purple-400", bg: "bg-purple-500/15" },
  fechou_cirurgia: { label: "Fechou Cirurgia", color: "text-green-400", bg: "bg-green-500/15" },
  desqualificado: { label: "Desqualificado", color: "text-red-400", bg: "bg-red-500/15" },
};

const originLabels: Record<ContactOrigin, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  google_ads: "Google Ads",
  instagram: "Instagram",
};

const ITEMS_PER_PAGE = 10;

export default function ContatosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [originFilter, setOriginFilter] = useState<ContactOrigin | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        (c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesOrigin = originFilter === "all" || c.origin === originFilter;
      return matchesSearch && matchesStatus && matchesOrigin;
    });
  }, [searchTerm, statusFilter, originFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = statusFilter !== "all" || originFilter !== "all";

  const handleExportCSV = () => {
    const headers = ["Nome", "Telefone", "Email", "Empresa", "Área", "Status", "Origem", "Responsável", "Criado em"];
    const rows = filtered.map((c) => [
      c.name,
      c.phone,
      c.email || "",
      c.company || "",
      c.area || "",
      statusLabels[c.status].label,
      originLabels[c.origin],
      c.assignedTo,
      format(parseISO(c.createdAt), "dd/MM/yyyy HH:mm"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contatos-valency.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-semibold text-v-text-primary">
            <em className="italic">Contatos</em>
          </h1>
          <p className="text-xs text-v-text-muted mt-1">
            {filtered.length} de {contacts.length} contatos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-v-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por nome, telefone, email..."
              className="h-8 pl-8 pr-3 rounded-input bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-xs text-v-text-primary placeholder:text-v-text-muted focus:outline-none focus:border-v-accent w-64 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-8 px-3 rounded-input border text-xs flex items-center gap-1.5 transition-colors",
              showFilters || hasActiveFilters
                ? "bg-v-accent-subtle border-v-accent/30 text-v-accent"
                : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] text-v-text-secondary hover:text-v-text-primary"
            )}
          >
            <Filter size={12} />
            Filtrar
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-v-accent text-[9px] font-bold text-white flex items-center justify-center">
                {(statusFilter !== "all" ? 1 : 0) + (originFilter !== "all" ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            onClick={handleExportCSV}
            className="h-8 px-3 rounded-input bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-xs text-v-text-secondary hover:text-v-text-primary flex items-center gap-1.5 transition-colors"
          >
            <Download size={12} />
            CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="glass-card !rounded-card-sm p-4 flex items-center gap-4 animate-fade-in">
          <div>
            <label className="label-meta block mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as LeadStatus | "all");
                setCurrentPage(1);
              }}
              className="h-8 px-3 rounded-input bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-xs text-v-text-primary focus:outline-none focus:border-v-accent appearance-none cursor-pointer"
            >
              <option value="all">Todos</option>
              {Object.entries(statusLabels).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-meta block mb-1.5">Origem</label>
            <select
              value={originFilter}
              onChange={(e) => {
                setOriginFilter(e.target.value as ContactOrigin | "all");
                setCurrentPage(1);
              }}
              className="h-8 px-3 rounded-input bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-xs text-v-text-primary focus:outline-none focus:border-v-accent appearance-none cursor-pointer"
            >
              <option value="all">Todas</option>
              {Object.entries(originLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setOriginFilter("all");
                setCurrentPage(1);
              }}
              className="h-8 px-3 rounded-input text-xs text-v-text-muted hover:text-v-text-primary flex items-center gap-1 transition-colors mt-4"
            >
              <X size={12} />
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="glass-card !rounded-card-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Nome</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Telefone</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Status</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Origem</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Área</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Responsável</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Tags</th>
                <th className="label-meta text-left px-5 py-3 !text-[9px]">Última msg</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((contact) => {
                const status = statusLabels[contact.status];
                return (
                  <tr
                    key={contact.id}
                    className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[10px] font-semibold text-v-text-secondary flex-shrink-0">
                          {contact.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-v-text-primary truncate">{contact.name}</p>
                          {contact.email && (
                            <p className="text-[10px] text-v-text-muted truncate">{contact.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-v-text-secondary font-mono">{contact.phone}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-medium inline-flex",
                        status.bg,
                        status.color
                      )}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-v-text-secondary">
                        {originLabels[contact.origin]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-v-text-secondary">
                        {contact.area || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {contact.assignedTo === "IA Valency" ? (
                          <Bot size={10} className="text-v-accent" />
                        ) : (
                          <UserCircle size={10} className="text-blue-400" />
                        )}
                        <span className="text-[11px] text-v-text-secondary">{contact.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-v-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-v-text-muted">
                            +{contact.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] text-v-text-muted font-mono">
                        {format(parseISO(contact.lastMessageAt), "dd/MM HH:mm")}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button className="p-1 rounded hover:bg-[rgba(255,255,255,0.04)] text-v-text-muted transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-[rgba(255,255,255,0.06)] px-5 py-3 flex items-center justify-between">
            <span className="text-[10px] text-v-text-muted font-mono">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-v-text-muted hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono transition-colors",
                    currentPage === page
                      ? "bg-v-accent text-white"
                      : "text-v-text-muted hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)]"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-v-text-muted hover:text-v-text-primary hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
