import { requireUser, rolesOf } from "@/lib/guard";
import { tierLabel } from "@/lib/rules";

export default async function SettingsPage() {
  const user = await requireUser();
  return (
    <>
      <h1>Settings</h1>
      <p>{user.name} · {user.email}</p>
      <p>{user.org.legalName} · {tierLabel(user.org.verificationTier)}</p>
      <p>Roles: {rolesOf(user.roles).join(", ")}</p>
      <p>Second factor is on. Passkeys can replace the PIN when the identity vendor is chosen.</p>
    </>
  );
}
