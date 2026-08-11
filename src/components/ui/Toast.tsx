import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;
const listeners = new Set<(toasts: ToastItem[]) => void>();
let currentToasts: ToastItem[] = [];

export function showToast(type: ToastType, message: string) {
  const id = ++toastId;
  currentToasts = [...currentToasts, { id, type, message }];
  listeners.forEach((l) => l(currentToasts));
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(currentToasts));
  }, 3000);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => {
          currentToasts = currentToasts.filter((x) => x.id !== t.id);
          setToasts(currentToasts);
        }} />
      ))}
    </div>,
    document.body,
  );
}

function Toast({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 size={18} className="text-accent-500" />,
    error: <AlertCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-brand-500" />,
  };
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-soft-lg animate-slide-down dark:border-surface-dark-border dark:bg-surface-dark-subtle">
      {icons[toast.type]}
      <span className="text-sm text-slate-700 dark:text-slate-200">{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
