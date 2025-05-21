import "./globals.css";
import { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { AuthProvider } from "../lib/AuthContext";
import { Toaster } from "@/components/ui/sonner"

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Task Generator App",
  description: "Generate and manage tasks with Google Gemini",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <AuthProvider>
          {children}
          <Toaster
            toastOptions={{
              style: {
                fontSize: "16px",
                color: "#ffff",
                backgroundColor: "#000814",
                borderRadius: "8px",
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}