import Link from "next/link";
import { ProcesslyLogo } from "./brand/processly-logo";

export function Brand({ compact = false, href = "/dashboard" }: { compact?: boolean; href?: string }) {
  return <Link href={href} className="inline-flex items-center rounded-lg" aria-label="Processly home">
    <ProcesslyLogo iconOnly={compact} size={32} />
  </Link>;
}
