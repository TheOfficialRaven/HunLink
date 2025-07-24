import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <div>
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA', color: '#333333' }}>
      <Navbar />
      <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem' }}>{children}</main>
    </div>
  );
} 