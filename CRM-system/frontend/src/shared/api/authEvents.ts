type UnauthorizedListener = () => void;

const unauthorizedListeners = new Set<UnauthorizedListener>();

export const authEvents = {
  subscribeUnauthorized(listener: UnauthorizedListener): () => void {
    unauthorizedListeners.add(listener);

    return () => {
      unauthorizedListeners.delete(listener);
    };
  },

  emitUnauthorized(): void {
    unauthorizedListeners.forEach((listener) => {
      listener();
    });
  },
};
