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
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={`font-sans antialiased bg-[#0b1e36] text-white h-screen w-screen overflow-hidden flex flex-col`}
      >
        <div className="relative flex-1 w-full h-full max-w-[1080px] mx-auto overflow-hidden bg-gradient-to-br from-[#164B8B] to-[#0b1e36]">
          {/* Efeitos de luz no fundo usando as cores da marca */}
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#EB4C2C] rounded-full mix-blend-screen filter blur-[200px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-[#F08EA5] rounded-full mix-blend-screen filter blur-[200px] opacity-20"></div>
          
          <main className="relative z-10 w-full h-full flex flex-col no-scrollbar overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
