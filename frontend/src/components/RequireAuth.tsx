"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import type { UserRole } from "../lib/auth";

export function RequireAuth(props: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
       router.replace("/login");
    } else if (props.roles && !props.roles.includes(user.role)) {
       router.replace(`/dashboard/${user.role}`);
    }
  }, [router, user, props.roles]);

  if (!user) return null;
  if (props.roles && !props.roles.includes(user.role)) return null;
  return <>{props.children}</>;
}

