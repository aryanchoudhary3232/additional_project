import "./globals.css";

export const metadata = {
  title: "IIIT Sri City UG2 Academic Portal",
  description: "Official portal for slide management, student doubt clearing, and UG2 Monsoon 2026 timetable with free slot highlighter.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
