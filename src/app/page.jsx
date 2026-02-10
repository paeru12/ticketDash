"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { login, isAuthenticated, loading, user } = useAuth();

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const u = await login(email.trim(), password);

      toast.success("Login berhasil");

      // 🔥 AUTO REDIRECT BY ROLE
      if (u.role === "SUPERADMIN") {
        router.push("/dashboard");
      } else if (u.role === "EVENT_ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Gagal login"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Masuk..." : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
