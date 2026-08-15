import type { Metadata } from "next";
import { EditSopView } from "@/src/features/sops/components/edit-sop-view";
export const metadata: Metadata = { title: "Edit Process" };
export default async function EditSopPage({ params }: PageProps<"/sops/[id]/edit">) { const { id } = await params; return <EditSopView id={Number(id)} />; }
