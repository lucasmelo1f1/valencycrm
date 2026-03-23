export interface MetricCardData {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export interface ConversionData {
  rate: number;
  contracts: number;
  qualified: number;
}

export interface TemporalDataPoint {
  date: string;
  leads: number;
  reunioes: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HourDistributionItem {
  hour: string;
  count: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  area?: string;
  status: LeadStatus;
  origin: ContactOrigin;
  assignedTo: string;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  tags: string[];
}

/**
 * Source of truth for all lead statuses.
 * Every status label/config/mock MUST derive from this array.
 * To add a new stage, add it here and TypeScript will flag every
 * Record<LeadStatus, …> that is missing the key.
 */
export const LEAD_STATUSES = [
  "novo",
  "em_qualificacao",
  "qualificado",
  "agendou_consulta",
  "compareceu_consulta",
  "proposta_procedimento",
  "fechou_cirurgia",
  "desqualificado",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type ContactOrigin = "whatsapp" | "site" | "indicacao" | "google_ads" | "instagram";

export type ChatStatus = "qualificando" | "agendando" | "aguardando" | "finalizado";

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  isAI: boolean;
  chatStatus: ChatStatus;
  timeline: TimelineEvent[];
}

export interface Message {
  id: string;
  content: string;
  sender: "ai" | "contact" | "human";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
}

export interface KanbanColumn {
  id: LeadStatus;
  title: string;
  color: string;
  contacts: Contact[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "atendente" | "viewer";
  avatar?: string;
  activeChats: number;
  conversions: number;
}

export interface SidebarItem {
  label: string;
  icon: string;
  href?: string;
  children?: SidebarItem[];
  badge?: string;
}
