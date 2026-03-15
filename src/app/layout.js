import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapClient from "../components/BootstrapClient";

export const metadata = {
  title: "Dashboard | Daily Report",
  description: "Mechanic Daily Report Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
