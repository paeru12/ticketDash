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

const pageNames = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/event-admins': 'Event Admins',
  '/users': 'Users',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  if (!user) {
    return null; // user belum siap, RequireAuth handle redirect
  }

  const menu = user ? getMenuByRole(user.role) : [];

  // Note: we intentionally do not persist navigation state to sessionStorage

  // If the user manually navigates to a path that is not present in their menu,
  // show NotFound to avoid revealing routes they shouldn't access.
  const globalAllowedPaths = [
  "/profile",
  ];
  const allowedPaths = [
    ...menu.map((m) => m.href),
    ...globalAllowedPaths,
  ];

  const isAllowedPath = allowedPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/")
  );

  const cameFromMenu = location.state?.fromMenu === true;
  const cameFromLogin = location.state?.fromLogin === true;

  // Detect a full page reload (user pressed refresh). When reloading an allowed
  // route like `/dashboard`, allow showing the page even if `location.state`
  // is lost. Manual URL edits will still show NotFound unless the navigation
  // is a reload and the path is allowed.
  let isReload = false;
  try {
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')?.[0];
    if (nav && nav.type === 'reload') isReload = true;
    // fallback for older browsers
    if (!isReload && performance?.navigation && performance.navigation.type === 1) isReload = true;
  } catch (e) {
    // ignore
  }

  // Also allow reload when the last recorded internal path matches the
  // current pathname. This is a conservative sessionStorage fallback that
  // only permits showing a page after the user previously navigated to it
  // from inside the app (menu/login). It does not expose routes when the
  // user manually typed a previously-unseen path.
  let lastInternalMatch = false;
  try {
    lastInternalMatch = typeof window !== 'undefined' && sessionStorage.getItem('lastInternalPath') === location.pathname;
  } catch (e) {
    lastInternalMatch = false;
  }

  const allowedToShow = isAllowedPath && (cameFromMenu || cameFromLogin || isReload || lastInternalMatch);

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
                    <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                    <div className="px-2 py-1 text-xs text-slate-400">
                      {user?.role === 'SUPERADMIN' ? 'Super Admin' : 'Event Admin'}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { try { sessionStorage.setItem('lastInternalPath', '/profile'); } catch (e) {} navigate('/profile', { state: { fromMenu: true } }); }}>Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={async () => {
                        const result = await confirmLogout();

                        if (!result.isConfirmed) return;

                        try {
                          sessionStorage.removeItem("lastInternalPath");
                        } catch (e) {}

                        logout();
                        navigate("/login");
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
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
