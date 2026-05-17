import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

const use3DExperience = () =>
  typeof window !== "undefined" && window.innerWidth > 1024;

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => use3DExperience());
  const [loading, setLoading] = useState(0);
  const finishedRef = useRef(false);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  const finishLoading = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    import("../components/utils/initialFX").then((module) => {
      module.initialFX?.();
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!use3DExperience()) {
      finishLoading();
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoading(100);
      finishLoading();
    }, 45000);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loading >= 100 && isLoading) {
      const timer = window.setTimeout(finishLoading, 2500);
      return () => window.clearTimeout(timer);
    }
  }, [loading, isLoading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
