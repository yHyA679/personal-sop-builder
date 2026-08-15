import type { Metadata } from "next";
import { SopForm } from "@/src/features/sops/components/sop-form";
export const metadata: Metadata = { title: "New Process" };
export default function NewSopPage() { return <SopForm mode="create" />; }
