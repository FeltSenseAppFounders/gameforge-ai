import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function TopBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Creator";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-surface border-b border-neutral-700 flex items-center justify-between px-6 shrink-0">
      {/* Studio name */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-heading text-neutral-300 uppercase">
          COMMAND CENTER
        </span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-light">
              {initials}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-neutral-200 leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-neutral-500 leading-tight">
              {user?.email}
            </p>
          </div>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
