import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import RequireAuth from "@/components/common/RequireAuth";
import RequireRole from "@/components/common/RequireRole";
import RoleRenderer from "@/components/common/RoleRenderer";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";

// SUPERADMIN
import Dashboard from "./pages/superadmin/Dashboard";
import Events from "./pages/superadmin/Events";
import EventAdmins from "./pages/superadmin/EventAdmins";
import Users from "./pages/superadmin/Users";
import Settings from "./pages/superadmin/Settings";
import Banner from "./pages/superadmin/Banner";

// EVENT ADMIN
import EventAdminDashboard from "./pages/eventadmin/Dashboard";
import EventAdminEvents from "./pages/eventadmin/Events";
import Categories from "./pages/eventadmin/Categories";
// import Regions from "./pages/eventadmin/Regions";
import TicketTypes from "./pages/eventadmin/TicketTypes";
import Reports from "./pages/eventadmin/Reports";
import EventAdminOrders from "./pages/eventadmin/Orders";
import EventAdminTickets from "./pages/eventadmin/Tickets";
import EventAdminScanStaff from "./pages/eventadmin/ScanStaff";
import EventAdminSettings from "./pages/eventadmin/Settings";

// SCAN STAFF
import SelectEvent from "./pages/scanstaff/SelectEvent";
import ScanHistory from "./pages/scanstaff/ScanHistory";
import ScanStaffDashboard from "./pages/scanstaff/Dashboard";

// COMMON
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
          <Routes>
            {/* Root & Login */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* =========================
                PROTECTED AREA
            ========================= */}
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                {/* Dashboard (shared path) */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleRenderer
                      map={{
                        SUPERADMIN: <Dashboard />,
                        EVENT_ADMIN: <EventAdminDashboard />,
                        SCAN_STAFF: <ScanStaffDashboard />,
                      }}
                    />
                  }
                />

                {/* Events (shared path) */}
                <Route
                  path="/events"
                  element={
                    <RoleRenderer
                      map={{
                        SUPERADMIN: <Events />,
                        EVENT_ADMIN: <EventAdminEvents />,
                      }}
                    />
                  }
                />

                {/* EVENT ADMIN ONLY */}
                <Route
                  path="/categories"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <Categories />
                    </RequireRole>
                  }
                />
                
                <Route
                  path="/ticket-types"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <TicketTypes />
                    </RequireRole>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <Reports />
                    </RequireRole>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <EventAdminOrders />
                    </RequireRole>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <EventAdminTickets />
                    </RequireRole>
                  }
                />
                <Route
                  path="/scan-staff"
                  element={
                    <RequireRole allowed={["EVENT_ADMIN"]}>
                      <EventAdminScanStaff />
                    </RequireRole>
                  }
                />

                {/* SUPERADMIN ONLY */}
                <Route
                  path="/event-admins"
                  element={
                    <RequireRole allowed={["SUPERADMIN"]}>
                      <EventAdmins />
                    </RequireRole>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <RequireRole allowed={["SUPERADMIN"]}>
                      <Users />
                    </RequireRole>
                  }
                />
                <Route
                  path="/banner"
                  element={
                    <RequireRole allowed={["SUPERADMIN"]}>
                      <Banner />
                    </RequireRole>
                  }
                />

                {/* Settings (shared path) */}
                <Route
                  path="/settings"
                  element={
                    <RoleRenderer
                      map={{
                        SUPERADMIN: <Settings />,
                        EVENT_ADMIN: <EventAdminSettings />,
                      }}
                    />
                  }
                />
                {/* Profile (shared path) */}
                <Route
                  path="/profile"
                  element={
                    <RoleRenderer
                      map={{
                        SUPERADMIN: <Profile />,
                        EVENT_ADMIN: <Profile />,
                        SCAN_STAFF: <Profile />,
                      }}
                    />
                  }
                />

                {/* SCAN STAFF ONLY */}
                <Route path="/select-event" element={
                  <RequireRole allowed={["SCAN_STAFF"]}>
                    <SelectEvent />
                  </RequireRole>
                } />
                <Route path="/scan-history" element={
                  <RequireRole allowed={["SCAN_STAFF"]}>
                    <ScanHistory />
                  </RequireRole>
                } />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;