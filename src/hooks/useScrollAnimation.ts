import { useInView } from "framer-motion";
import { useRef } from "react";

export const useScrollAnimation = (options?: { once?: boolean; margin?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin ?? "-100px") as any,
  });

  return { ref, isInView };
};
