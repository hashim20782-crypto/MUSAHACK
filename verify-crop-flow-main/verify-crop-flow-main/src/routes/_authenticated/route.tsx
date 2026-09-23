import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AgriProvider } from "@/context/AgriProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) return { user: data.user };
      const { data: local } = await supabase.auth.getSession();
      if (local?.session?.user) return { user: local.session.user };
    } catch (_) {}

    // Allow local operator session fallback if email confirmation is pending
    if (typeof window !== "undefined" && localStorage.getItem("agritrust_operator_session")) {
      return { user: { id: "00000000-0000-0000-0000-000000000002", email: "rahul.nashik@agritrust.in" } };
    }
    throw redirect({ to: "/auth" });
  },
  component: () => (
    <AgriProvider>
      <Outlet />
    </AgriProvider>
  ),
});
