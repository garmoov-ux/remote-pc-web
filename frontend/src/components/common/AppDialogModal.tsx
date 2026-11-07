/**
 * 브라우저 기본 alert/confirm을 전면 대체하는 사이버 HUD 챔퍼 프레임 커스텀 다이얼로그 모달 컴포넌트입니다.
 */

"use client";

import { useEffect } from "react";
import { ShieldAlert, X } from "lucide-react";
import type { DialogModalState } from "@/types/portal";

interface AppDialogModalProps {
  modal: DialogModalState;
  onClose: () => void;
}

export function AppDialogModal({ modal, onClose }: AppDialogModalProps) {
  useEffect(() => {
    if (!modal.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.isOpen, onClose]);

  if (!modal.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0F]/85 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="chamfer-panel relative w-full max-w-md border border-[#00E5FF]/40 bg-[#101019] p-6 shadow-[0_0_40px_rgba(0,229,255,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-[#00E5FF]" />
            <h3
              id="app-dialog-title"
              className="text-base font-bold tracking-tight text-white"
            >
              {modal.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="창 닫기"
            className="rounded p-1 text-[#8E95A9] transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-[#C4CAD9]">
          {modal.description}
        </p>

        <div className="flex justify-end gap-2.5">
          {modal.cancelLabel && (
            <button
              type="button"
              onClick={onClose}
              className="border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-[#C4CAD9] transition hover:border-white/30 hover:text-white"
            >
              {modal.cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (modal.onConfirm) modal.onConfirm();
              onClose();
            }}
            className="chamfer-btn bg-[#00E5FF] px-5 py-2 text-xs font-bold text-[#05080F] transition hover:bg-[#4DF0FF]"
          >
            {modal.confirmLabel || "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}

