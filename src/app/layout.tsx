import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz | Festival Paulo Leminski",
  description: "Quiz Interativo do Festival Paulo Leminski",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400..900&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={`font-sans antialiased bg-leminski-red text-leminski-light h-screen w-screen overflow-hidden flex flex-col`}
      >
        <div className="relative flex-1 w-full h-full mx-auto bg-leminski-red flex flex-col">
          <main className="relative z-10 w-full h-full flex flex-col no-scrollbar overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
