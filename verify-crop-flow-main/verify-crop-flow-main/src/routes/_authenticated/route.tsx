import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AgriProvider } from "@/context/AgriProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data.user) return { user: data.user };
    // offline in the field: the identity check cannot reach the server, so fall
    // back to the session stored on the device instead of ejecting the operator
    if (error) {
      const { data: local } = await supabase.auth.getSession();
      if (local.session?.user) return { user: local.session.user };
    }
    throw redirect({ to: "/auth" });
  },
  component: () => (
    <AgriProvider>
      <Outlet />
    </AgriProvider>
  ),
});
