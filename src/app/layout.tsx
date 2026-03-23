import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundGlows } from "@/components/ui/BackgroundGlows";

export const metadata: Metadata = {
  title: "Valency CRM",
  description: "CRM com IA para atendimento comercial automatizado",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <BackgroundGlows />
            <Header />
            <main className="flex-1 overflow-y-auto bg-transparent p-6 relative z-10">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
