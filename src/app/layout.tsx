import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scrum Poker Cards",
  description: "Real-time collaborative Scrum poker planning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
