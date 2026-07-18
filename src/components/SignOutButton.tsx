"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="btn-ghost text-sm"
    >
      <LogOut className="h-4 w-4" aria-hidden /> Sign out
    </button>
  );
}
