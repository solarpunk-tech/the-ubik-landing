import { type CSSProperties, type FocusEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { usePrefersReducedMotion } from "@/lib/dotmatrix-hooks";
import { cn } from "@/lib/utils";
import { TourShot, type ShotId } from "./TourShots";
import "./desktop-tour.css";

// Sources for every chapter are in ubik-meetings origin/main (desktop app, Tauri):
//  meetings  core/ubik-core/src/cards.rs, desktop/src/cards/meeting.jsx, desktop/src/notes/Detail.jsx,
//            desktop/src/notes/Slides.jsx, docs/round4/HANDOFF.md ("The Tauri app always records natively")
//  dictation core/ubik-core/src/prefs.rs (dictation_key left_ctrl), desktop/src/panel/settings/Dictation.jsx,
//            desktop/src/panel/settings/Speech.jsx
//  ask       prefs.rs (ask_shortcut Control+Space), desktop/src/panel/ask/behind.js, CaptureBar.jsx
//  mail      desktop/src/panel/mail/SuggestedTasks.jsx, desktop/src/panel/CalendarView.jsx, commit 1902d6e
//  pulse     desktop/src/panel/TasksView.jsx, desktop/src/panel/ActivityView.jsx, desktop/src/whatsNew.json
//  history   desktop/src/CaptureBar.jsx, prefs.rs (capture_shortcut Control+Shift+S),
//            desktop/src/panel/settings/history/ScreenLog.jsx, capture/Sources/ubik-capture/Privacy.swift

type Chapter = { id: ShotId; title: ReactNode; label: string; body: string };

const CHAPTERS: Chapter[] = [
  {
    id: "meetings",
    label: "Meetings, tracked by no one",
    title: (
      <>
        Meetings <em>tracked by no one</em>
      </>
    ),
    body:
      "ubik sees the call on your calendar and when it opens in Google Meet, Zoom, Microsoft Teams or Webex, and offers to record. It records on your computer, so nothing joins the guest list. You get a summary, action items with owners and dates, decisions, and slides from a shared screen, next to the full transcript."
  },
  {
    id: "dictation",
    label: "Dictate into any app",
    title: (
      <>
        Dictate into <em>any app</em>
      </>
    ),
    body:
      "Hold Left Control, speak, let go, and the text lands where your cursor is. You can pick another key in Settings. Each language says whether it is transcribed on this computer or online, and long dictations can be tidied up before they paste."
  },
  {
    id: "ask",
    label: "Ask about the window you are in",
    title: (
      <>
        Ask about the window <em>you are in</em>
      </>
    ),
    body:
      "Press Control+Space and ask about your mail, meetings and tasks. If you allow it, the question carries the app, title and site of the window behind it, never the page itself. Private windows and password managers are left out. You can attach a screenshot."
  },
  {
    id: "mail",
    label: "Mail and calendar with tasks pulled out",
    title: (
      <>
        Mail and calendar, <em>tasks pulled out</em>
      </>
    ),
    body:
      "Read and reply from your connected inbox. ubik suggests up to three tasks per thread: Add makes one, Discard keeps it gone. The calendar shows your day and week, opens the call link, and creates events with Google Meet or Microsoft Teams."
  },
  {
    id: "pulse",
    label: "Tasks and what needs you",
    title: (
      <>
        Tasks, and <em>what needs you</em>
      </>
    ),
    body:
      "Tasks are the same list as the web app, with a board view. Pulse lists the decisions ubik needs from you: tasks that look done, and duplicates to merge. One tap accepts, and every accept says what it did, with Undo. Notifications match the bell in the web app."
  },
  {
    id: "history",
    label: "A private history on your computer",
    title: (
      <>
        Your history, <em>private and local</em>
      </>
    ),
    body:
      "Control+Shift+S opens the capture bar: screenshot an area or record the screen. History shows your month as a heatmap and each day as a short story, and stays on your computer. Private windows, password managers and apps you exclude are never logged, and you can clear it at any time."
  }
];

const DURATION_MS = 7000;
const WIDE = "(min-width: 1024px)";

function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/**
 * Numbered chapters on the left, the shot on the right. Only the active chapter
 * is open; its track fills while it plays and the next one opens when it ends.
 * Hover, keyboard focus, the pause button and scrolling away all pause it.
 * Under reduced motion, and on narrow screens (where the shot sits inside the
 * open chapter and moving it would shift the page), it only changes on a click.
 */
export function DesktopTour() {
  const reduced = usePrefersReducedMotion();
  const wide = useMedia(WIDE);
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const auto = !reduced && wide;
  const paused = userPaused || hovered || focused || !inView;
  const next = useCallback(() => setActive((n) => (n + 1) % CHAPTERS.length), []);

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const current = CHAPTERS[active];

  return (
    <div
      ref={rootRef}
      className="dt-tour grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
      data-paused={paused || !auto}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="min-w-0">
        <ol className="flex flex-col border-t">
          {CHAPTERS.map((chapter, i) => {
            const isActive = i === active;
            const bodyId = `dt-body-${chapter.id}`;
            return (
              <li key={chapter.id} className="dt-chapter border-b" data-active={isActive}>
                <button
                  type="button"
                  className="flex w-full items-baseline gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  aria-expanded={isActive}
                  aria-controls={bodyId}
                  onClick={() => setActive(i)}
                >
                  <span
                    className={cn(
                      "tabular-nums text-sm font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-xl font-medium leading-snug sm:text-2xl [&_em]:not-italic [&_em]:text-primary",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {chapter.title}
                  </span>
                </button>
                <div className="dt-chapter-body" id={bodyId} role="region" aria-label={chapter.label}>
                  <div>
                    <p className="sr-only">{chapter.body}</p>
                    {isActive && auto ? (
                      <span className="dt-progress mb-4 ml-10" aria-hidden>
                        <i
                          key={active}
                          style={{ "--dt-duration": `${DURATION_MS}ms` } as CSSProperties}
                          onAnimationEnd={next}
                        />
                      </span>
                    ) : null}
                    {isActive && !wide ? <TourShot id={chapter.id} className="mb-5" /> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {auto ? (
          <button
            type="button"
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-pressed={userPaused}
            onClick={() => setUserPaused((p) => !p)}
          >
            {userPaused ? <PlayIcon weight="fill" aria-hidden /> : <PauseIcon weight="fill" aria-hidden />}
            {userPaused ? "Play tour" : "Pause tour"}
          </button>
        ) : null}
      </div>
      {wide ? (
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <TourShot id={current.id} className="min-h-[30rem]" />
        </div>
      ) : null}
    </div>
  );
}
