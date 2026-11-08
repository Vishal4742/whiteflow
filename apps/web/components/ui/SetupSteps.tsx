// Where a business is in setup: sign in → create a workspace → link the wallet that gets paid. Shown on /sign-in and on
// the dashboard's signed-out panel, so every setup screen says which step this is and what comes next.
const STEPS = ["Sign in", "Create workspace", "Link wallet"] as const;

/** `current` is the step being done now (1–3); 4 means all done. */
export function SetupSteps({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <ol aria-label="Setup" className="grid grid-cols-3 gap-2">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className="grid gap-1.5"
          >
            <span
              className={`h-1 rounded-pill ${state === "todo" ? "bg-hairline" : state === "done" ? "bg-positive" : "bg-accent"}`}
            />
            <span
              className={`text-xs ${state === "current" ? "font-medium text-ink" : "text-ink-muted"}`}
            >
              {state === "done" ? "✓ " : `${n}. `}
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
