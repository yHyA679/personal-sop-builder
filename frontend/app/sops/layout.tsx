import { ProtectedRoute } from "@/src/components/auth-gates";
export default function SopsLayout({ children }: { children: React.ReactNode }) { return <ProtectedRoute>{children}</ProtectedRoute>; }
