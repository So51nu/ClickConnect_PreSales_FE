import Navbar from "../features/Header/Navbar";
import Footer from "../features/Footer/Footer";
import SalesNavigation from "../components/SalesNavigation/SalesNavigation";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { applyThemeToRoot, getBrandTheme } from "../utils/theme";

export default function MasterLayout() {
  const { logout, user } = useAuth(); 

  // Ensure theme variables are applied once for the whole app shell
  useEffect(() => {
    const theme = getBrandTheme();
    applyThemeToRoot(theme);
  }, []);

  return (
    <div className="app-shell">
      <Navbar currentUser={user} onLogout={logout} />

      <div className="app-shell__nav">
        <SalesNavigation />
      </div>

      <main className="app-shell__main">
        <div className="ui-container ui-page">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}
