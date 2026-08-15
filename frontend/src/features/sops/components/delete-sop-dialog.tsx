"use client";

import { useState } from "react";
import { useApp } from "@/src/components/providers/app-provider";
import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/ui/modal";

export function DeleteSopDialog({ sopId, sopTitle, open, onClose, onDeleted }: { sopId: number; sopTitle: string; open: boolean; onClose: () => void; onDeleted?: () => void }) {
  const { deleteSop, notify } = useApp(); const [deleting, setDeleting] = useState(false);
  async function confirm() { setDeleting(true); try { await deleteSop(sopId); notify("Process deleted."); onClose(); onDeleted?.(); } catch { notify("The process could not be deleted.", "error"); } finally { setDeleting(false); } }
  return <Modal open={open} onClose={onClose} title="Delete process?" description={`“${sopTitle}” and all of its steps will be permanently deleted. This action can’t be undone.`}><div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={onClose} disabled={deleting}>Cancel</Button><Button variant="destructive" onClick={confirm} disabled={deleting}>{deleting ? "Deleting…" : "Delete process"}</Button></div></Modal>;
}
