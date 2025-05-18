import "./globals.css";
import { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { AuthProvider } from "../lib/AuthContext";

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
         <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
