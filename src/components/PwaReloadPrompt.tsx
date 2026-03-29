import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

/**
 * Показывает toast при доступном обновлении SW (registerType: "prompt") и при готовности офлайн-оболочки.
 */
export function PwaReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady() {
      toast.success("Приложение готово к работе без сети", {
        id: "pwa-offline-ready",
        duration: 4000,
      });
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    toast.message("Доступна новая версия приложения", {
      id: "pwa-need-refresh",
      duration: Infinity,
      action: {
        label: "Обновить",
        onClick: () => {
          void updateServiceWorker(true);
        },
      },
    });
  }, [needRefresh, updateServiceWorker]);

  return null;
}
