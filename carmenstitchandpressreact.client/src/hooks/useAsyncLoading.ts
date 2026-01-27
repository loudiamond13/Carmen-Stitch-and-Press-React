import { createContext, useContext, useState, useCallback } from "react";

type AsyncLoadingContextType = {
    isLoading: boolean;
    runAsync: <T>(promise: Promise<T>) => Promise<T>;
};

const AsyncLoadingContext = createContext<AsyncLoadingContextType | null>(null);

export function AsyncLoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const runAsync = useCallback(async <T>(promise: Promise<T>) => {
        setIsLoading(true);
        try {
            return await promise;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <AsyncLoadingContext.Provider value={{ isLoading, runAsync }}>
            { children }
        </AsyncLoadingContext.Provider>
  );
}

export function useAsyncLoading() {
    const ctx = useContext(AsyncLoadingContext);
    if (!ctx) throw new Error("useAsyncLoading must be used inside AsyncLoadingProvider");
    return ctx;
}
