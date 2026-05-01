import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SoftBlurTextProps = {
  as?: "h1" | "h2" | "p" | "span" | "div";
  text: string;
  className?: string;
  delayMs?: number;
};

export function SoftBlurText({ as: Component = "span", text, className, delayMs = 0 }: SoftBlurTextProps) {
  let characterIndex = 0;

  return (
    <Component className={cn("soft-blur-text", className)} style={{ "--soft-blur-delay": `${delayMs}ms` } as CSSProperties}>
      {text.split(" ").map((word, wordIndex, words) => (
        <span key={`${word}-${wordIndex}`} className="soft-blur-word" aria-hidden="true">
          {Array.from(word).map((character) => {
            const index = characterIndex;
            characterIndex += 1;

            return (
              <span
                key={`${character}-${index}`}
                className="soft-blur-char"
                style={{ "--soft-blur-index": index } as CSSProperties}
              >
                {character}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Component>
  );
}
