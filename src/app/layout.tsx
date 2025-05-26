import "./globals.css";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "@/utils/react-query";
import Background from "@/components/background";
import NavBar from "@/components/NavBar";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-inter",
  preload: true,
});

export const metadata = {
  title: "UCRPurity",
  description: "A rice purity test targeted towards UCR Students",
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-inter flex min-h-screen flex-col`}
      >
        <NavBar />
        <Background />
        <main className="flex-1">
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
