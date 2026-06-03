import { cn } from "@/lib/utils";

export interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
} as const;

export function MaterialIcon({
  name,
  className,
  filled = false,
  size = "md",
}: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", sizeClass[size], className)}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
    >
      {name}
    </span>
  );
}
