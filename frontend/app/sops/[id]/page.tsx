import type { Metadata } from "next";
import { SopDetailView } from "@/src/features/sops/components/sop-detail-view";
export const metadata: Metadata = { title: "Process" };
export default async function SopPage({ params }: PageProps<"/sops/[id]">) { const { id } = await params; return <SopDetailView id={Number(id)} />; }
