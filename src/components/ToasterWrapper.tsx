'use client';

import { useEffect } from 'react';
import { setupToastListener, type ToastData } from '@/stores/toast';
import { Toaster, toast } from 'sonner';
import { t } from '@/translations/index'; // adjust to your i18n setup

interface ToastWrapperProps {
  duration?: number;
}

export function ToastWrapper({ duration = 4000 }: ToastWrapperProps) {
  useEffect(() => {
    const handleToast = (data: ToastData) => {
      switch (data.type) {
        case 'success':
          toast.success(t(data.message), { duration });
          break;
        case 'error':
          toast.error(t(data.message), { duration });
          break;
        case 'info':
          toast.info(t(data.message), { duration });
          break;
        case 'warning':
          toast.warning(t(data.message), { duration });
          break;
        default:
          toast(t(data.message), { duration });
      }
    };

    const cleanup = setupToastListener(handleToast);
    return cleanup; // runs on unmount
  }, [duration]);

  return <Toaster position="bottom-right" richColors closeButton theme="light" />;
}
