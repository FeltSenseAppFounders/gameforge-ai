import { createClient } from "@/lib/supabase/server";
import { getClinicContext } from "@/lib/clinic-context";
import { SignOutButton } from "./SignOutButton";
import { ReplayTourButton } from "@/features/onboarding/ReplayTourButton";

export async function TopBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ctx = await getClinicContext();
  const clinicName = ctx?.clinic.name ?? "My Clinic";

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
      {/* Page context */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500">
          {clinicName}
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-4">
        <ReplayTourButton />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {initials}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-neutral-700 leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-neutral-400 leading-tight">
              {user?.email}
            </p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
