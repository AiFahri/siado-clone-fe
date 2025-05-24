import React from "react";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import type { User } from "@/types/user.ts";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, user, title }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} />

      {title && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
      )}

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
