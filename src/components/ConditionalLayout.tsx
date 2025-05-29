"use client";

import { usePathname } from "next/navigation";
import { ReactQueryClientProvider } from "@/utils/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Background from "@/components/background";
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

const ConditionalLayout = ({ children }: ConditionalLayoutProps) => {
  const pathname = usePathname();

  // Hide navbar and footer on login page
  const hideNavAndFooter = pathname === "/login";

  return (
    <AuthProvider>
      {!hideNavAndFooter && <NavBar />}
      <Background />
      <main className="flex-1">
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </main>
      {!hideNavAndFooter && <Footer />}
    </AuthProvider>
  );
};

export default ConditionalLayout;
