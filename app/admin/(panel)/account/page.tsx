import { AdminForm } from "@/components/admin/client";
import { Input, PageHeader, Panel } from "@/components/admin/fields";
import { adminAccount } from "@/lib/admin-data";
import { updateAccount } from "../../actions";

export const instant = false;

export default async function AdminAccountPage() {
  const account = await adminAccount();
  return (
    <>
      <PageHeader title="My account" text="Change the email and password you use to sign in." />
      <div className="max-w-xl">
        <AdminForm action={updateAccount} submitLabel="Update account">
          <Panel title="Login details">
            <Input label="Name" name="name" defaultValue={account.name} />
            <Input label="Login email" name="email" type="email" defaultValue={account.email} required />
            <Input label="New password" name="password" type="password" autoComplete="new-password" hint="Leave empty to keep your current password. Minimum 8 characters." />
            <Input label="Confirm new password" name="confirm" type="password" autoComplete="new-password" />
          </Panel>
          <Panel title="Confirm it's you">
            <Input label="Current password" name="current" type="password" autoComplete="current-password" required />
          </Panel>
        </AdminForm>
      </div>
    </>
  );
}
