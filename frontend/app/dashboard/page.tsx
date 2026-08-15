import type { Metadata } from "next";
import { DashboardView } from "@/src/features/sops/components/dashboard-view";
export const metadata: Metadata = { title: "My Processes" };
export default function DashboardPage() { return <DashboardView />; }
