import { Outlet } from "react-router-dom";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-shell">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

