import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";

interface Props {
  children?: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children ?? <Outlet />}
        </div>
      </main>

      <Footer />
    </div>
  );
}