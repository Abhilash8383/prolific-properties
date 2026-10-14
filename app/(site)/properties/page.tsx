import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui";
import { PropertyBrowser } from "@/components/PropertyBrowser";
import { getProperties } from "@/lib/data";
import { img } from "@/lib/site";

export const metadata: Metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const properties = await getProperties();
  return (
    <>
      <PageHero
        title="Properties"
        text="Browse verified apartments, villas, duplexes, plots and commercial spaces across Odisha."
        image={img("1460317442991-0ec209397118")}
      />
      <Suspense>
        <PropertyBrowser properties={properties} />
      </Suspense>
    </>
  );
}
