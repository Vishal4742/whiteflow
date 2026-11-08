import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "glass" | "outline" | "quiet";
/** lg (48px, 16px text) for marketing, docs and pay surfaces; md (44px, 14px text) for the workspace. */
type Size = "lg" | "md";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill font-medium " +
  "transition-[background-color,box-shadow,transform] duration-300 ease-spring hover:-translate-y-px active:scale-[.97] active:duration-75 " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:translate-y-0 aria-disabled:shadow-none";

const variants: Record<Variant, string> = {
  // Each variant owns its size: a shared px-6 would beat the quiet variant's px-2 in Tailwind's order.
  primary: "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-glow",
  glass: "border border-glass-edge bg-glass-fill text-glass-ink backdrop-blur-[20px]",
  outline: "border border-current text-accent hover:bg-accent-soft",
  quiet: "min-h-11 px-2 text-base bg-transparent text-ink-muted underline underline-offset-4 hover:text-ink hover:translate-y-0",
};

const sizes: Record<Size, string> = { lg: "h-12 px-6 text-base", md: "h-11 px-5 text-sm" };

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** The same classes for a link that should look like a button (e.g. a Next <Link>). */
export function buttonClasses(variant: Variant = "primary", className = "", size: Size = "lg"): string {
  return `${base} ${variant === "quiet" ? "" : sizes[size]} ${variants[variant]} ${className}`;
}

/** A pill button: primary for the one action a screen asks for, glass over a scene, quiet for secondary text actions. */
export function Button({ variant = "primary", size = "lg", className = "", type = "button", onClick, ...props }: ButtonProps) {
  const disabled = props["aria-disabled"] === true || props["aria-disabled"] === "true";
  // aria-disabled keeps focus (unlike disabled), so the click has to be ignored here.
  return <button type={type} className={buttonClasses(variant, className, size)} onClick={disabled ? undefined : onClick} {...props} />;
}
