import { PageHeader } from "@/components/admin/fields";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const instant = false;

export default function NewProperty() {
  return (
    <>
      <PageHeader title="Add property" text="Complete the essentials, then add home types, photos and publishing details." />
      <PropertyForm />
    </>
  );
}
