"use client";

import RoleRenderer from "@/components/common/RoleRenderer";
import ProfileView from "@/components/profile/ProfileView";

export default function ProfilePage() {
  return (
    <RoleRenderer
      map={{
        SUPERADMIN: <ProfileView />,
        PROMOTOR_EVENT_ADMIN: <ProfileView />,
        SCAN_STAFF: <ProfileView />,
      }}
    />
  );
}
