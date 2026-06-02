import "./globals.css";

export const metadata = {
  title: "Workaway — the AI operating system for small business",
  description:
    "Workaway brings your website, contacts, finances, tasks and AI agents into one simple dashboard built for small enterprises.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
