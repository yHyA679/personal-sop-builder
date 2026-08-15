export type Step = { id: number; content: string; order: number };
export type Sop = { id: number; title: string; description: string | null; steps: Step[]; createdAt: string; updatedAt: string };
export type SopSummary = Omit<Sop, "steps"> & { stepsCount: number };
export type User = { id: number; fullName: string; email: string };
export type SopDraft = { title: string; description: string; steps: Step[] };
export type Toast = { id: number; message: string; tone: "success" | "error" };
