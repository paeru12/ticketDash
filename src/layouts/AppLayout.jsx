import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, X, Ticket, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getMenuByRole } from "@/config/roleBasedMenu";
import NotFound from "@/pages/NotFound";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { confirmLogout } from "@/lib/alert";
import UserAvatarSkeleton from "@/components/common/UserAvatarSkeleton";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  if (!user) {
    return null; // user belum siap, RequireAuth handle redirect
  }

  const menu = user ? getMenuByRole(user.role) : [];

  /**
   * =========================
   * ROUTE GUARD (CLEAN)
   * =========================
   */
  const allowedPaths = menu.map((m) => m.href);
  const isAllowedPath = allowedPaths.some(
    (p) =>
      location.pathname === p ||
      location.pathname.startsWith(p + "/")
  );

  if (!isAllowedPath) {
    return <NotFound />;
  }

  /**
   * =========================
   * PAGE TITLE
   * =========================
   */
  const currentPageName =
    menu.find((item) => location.pathname.startsWith(item.href))
      ?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-background">
      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
            <Ticket className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">
              Tiket.ku
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menu.map((item) => {
                const isActive = location.pathname.startsWith(
                  item.href
                );

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <span className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-semibold text-slate-100 capitalize">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.role == "SUPERADMIN"
                    ? "Super Admin"
                    : "Event Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button (mobile) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold">
                {currentPageName}
              </h1>
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      Hai, <span className="font-semibold capitalize">{user.name}</span>
                    </span>

                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.img} alt={user.name} />

                    </Avatar>
                  </button>
                </DropdownMenuTrigger>


                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <p className="font-semibold capitalize">
                      {user?.name || "User"}
                    </p>
                  </DropdownMenuLabel>

                  <div className="text-xs ">
                    <p className="ps-3 text-slate-500 capitalize">
                      {user?.role === "SUPERADMIN"
                        ? "Super Admin"
                        : "Event Admin"}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        user?.role === "SUPERADMIN"
                          ? "/users"
                          : "/settings"
                      )
                    }
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="gap-2"
                    onClick={async () => {
                      const result = await confirmLogout();
                      if (!result.isConfirmed) return;

                      await logout();
                      navigate("/login", { replace: true });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <UserAvatarSkeleton />
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
          <footer className="border-t text-center my-10 mb-0 pt-5 text-sm">
            <p>
              Copyright &copy; <span className="font-bold">2026</span> Belisenang. All Rights Reserved
            </p>
            <p>
              Design & Development by <a href="https://yukti.id" target="_blank" className="text-blue-600">Yukti.id</a>
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
