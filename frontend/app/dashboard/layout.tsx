import { ProtectedRoute } from "@/src/components/auth-gates";
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) { return <ProtectedRoute>{children}</ProtectedRoute>; }
