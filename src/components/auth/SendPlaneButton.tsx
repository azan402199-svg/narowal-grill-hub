import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  sending: boolean;
  /** flips true once the code was delivered — triggers the "Sent!" reveal */
  sent: boolean;
  disabled?: boolean;
  showPlane?: boolean;
  children: ReactNode;
};

/** Paper-plane send button: squeezes into a bubble, plane loops out, lands as a tick. */
export function SendPlaneButton({ sending, sent, disabled, showPlane = true, children }: Props) {
  const [phase, setPhase] = useState<"idle" | "flying" | "sent">("idle");
  const wasSending = useRef(false);

  useEffect(() => {
    if (sending) {
      wasSending.current = true;
      setPhase("flying");
      return;
    }
    if (wasSending.current) {
      wasSending.current = false;
      if (sent) {
        setPhase("sent");
        const t = setTimeout(() => setPhase("idle"), 1700);
        return () => clearTimeout(t);
      }
      setPhase("idle");
    }
  }, [sending, sent]);

  return (
    <div className="send-plane-wrap" data-phase={phase}>
      <button
        type="submit"
        disabled={disabled}
        aria-busy={sending}
        className={cn("auth-cta send-plane-btn")}
      >
        <span className="send-plane-label">
          {showPlane && <svg className="send-plane-mini" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 11.5 21 3l-6.5 18-3-7.5L3 11.5Z" fill="currentColor" />
          </svg>}
          {children}
        </span>
        <span className="send-plane-sent" aria-hidden={phase !== "sent"}>
          <svg viewBox="0 0 24 24" className="send-plane-tick" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sent!
        </span>
      </button>

      <div className="send-plane-sky" aria-hidden>
        <svg className="send-plane-route" viewBox="-160 -110 320 160">
          <path d="M0,0 C30,-50 90,-95 120,-60 C150,-25 70,30 30,20 C0,12 -10,-10 0,0" />
        </svg>
        <span className="send-plane-flyer">
          <svg viewBox="0 0 24 24">
            <path d="M3 11.5 21 3l-6.5 18-3-7.5L3 11.5Z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  );
}
