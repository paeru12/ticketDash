// app/layout.jsx
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Ticketku | Management System",
  description: "Advanced Ticket Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
