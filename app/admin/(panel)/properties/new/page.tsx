import { PageHeader } from "@/components/admin/fields";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const instant = false;

export default function NewProperty() {
  return (
    <>
      <PageHeader title="Add property" text="Work top to bottom. Add each home type, then photos, then publish." />
      <PropertyForm />
    </>
  );
}
