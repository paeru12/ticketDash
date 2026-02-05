// Role-based menu configuration

export const superadminMenu = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Event Admins', href: '/event-admins', icon: 'UserCog' },
  { name: 'Users', href: '/users', icon: 'Users' },
  { name: 'Banner', href: '/banner', icon: 'Image' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
];

export const eventAdminMenu = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Events', href: '/events', icon: 'Ticket' },
  { name: 'Categories', href: '/categories', icon: 'List' },
  { name: 'Orders', href: '/orders', icon: 'ShoppingCart' },
  { name: 'Tickets', href: '/tickets', icon: 'Ticket' },
  { name: 'Ticket Types', href: '/ticket-types', icon: 'Tag' },
  { name: 'Reports', href: '/reports', icon: 'FileText' },
  { name: 'Scan Staff', href: '/scan-staff', icon: 'Users' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
];

export const scanStaffMenu = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Select Event', href: '/select-event', icon: 'CalendarCheck' },
  { name: 'Scan History', href: '/scan-history', icon: 'History' },
];

export function getMenuByRole(role) {
  if (role === 'SUPERADMIN') return superadminMenu;
  if (role === 'EVENT_ADMIN') return eventAdminMenu;
  if (role === 'SCAN_STAFF') return scanStaffMenu;
  return [];
}
