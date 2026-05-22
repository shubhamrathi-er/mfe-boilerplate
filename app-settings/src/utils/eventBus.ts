type EventCallback = (data: unknown) => void;

export const eventBus = {
  on(event: string, cb: EventCallback) {
    window.addEventListener(event, (e) => {
      cb((e as CustomEvent).detail);
    });
  },
  off(event: string, cb: EventCallback) {
    window.removeEventListener(event, cb as EventListener);
  },
  emit(event: string, data: unknown) {
    window.dispatchEvent(
      new CustomEvent(event, { detail: data })
    );
  },
};