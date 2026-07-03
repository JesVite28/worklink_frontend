import { useAuthSession } from "../../auth/hooks/useAuthSession";
import { useLogout } from "../../admin/hooks/useLogout";
import type { UserData } from "../../auth/models/authResponse";

type UserRole = NonNullable<UserData["roles"]>[number];

function getFullName(user: UserData | null) {
  return (
    [user?.name, user?.last_name, user?.maternal_last_name]
      .filter(Boolean)
      .join(" ") || "Usuario"
  );
}

function getPrimaryRole(user: UserData | null) {
  return (
    user?.role?.name ??
    user?.roles?.map((role: UserRole) => role.name).join(", ") ??
    "-"
  );
}

export function useDashboardPage() {
  const { user } = useAuthSession();
  const { handleLogout, isLoggingOut } = useLogout();

  const fullName = getFullName(user);
  const primaryRole = getPrimaryRole(user);
  const accountType = user?.account_type ?? primaryRole;
  const email = user?.email ?? "-";

  return {
    user,
    fullName,
    email,
    accountType,
    primaryRole,
    handleLogout,
    isLoggingOut,
  };
}