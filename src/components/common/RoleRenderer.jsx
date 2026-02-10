"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/app/not-found';

/**
 * Props:
 * - map: { ROLE_NAME: <Component/>, ... }
 * - fallback: optional fallback element
 */
export default function RoleRenderer({ map = {}, fallback = null }) {
  const { user } = useAuth();
  const role = user?.role;
  // If there's no mapping for the current role, show NotFound to hide route
  if (!role || !map[role]) return fallback ?? <NotFound />;
  return map[role];
}
