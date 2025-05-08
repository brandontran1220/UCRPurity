import "./globals.css";
import { Inter } from "next/font/google";
import { ReactQueryClientProvider } from "@/utils/react-query";

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
    <html lang="en">
      <body className={`${inter.variable} font-inter`}>
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
