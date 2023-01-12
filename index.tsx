import React, { useCallback, useEffect, useRef } from "react";

interface Calendly {
  initInlineWidget: (options: {
    url: string;
    parentElement?: HTMLElement | null;
    prefill?: unknown;
  }) => void;
}

/**
 * Calendly event types
 *
 * https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview?tab=advanced#6
 */
interface CalendlyEvent extends MessageEvent {
  data: {
    event:
      | "calendly.profile_page_viewed"
      | "calendly.event_type_viewed"
      | "calendly.date_and_time_selected"
      | "calendly.event_scheduled";
  };
}

const isCalendlyEvent = (e: MessageEvent): e is CalendlyEvent => {
  return (
    e.origin === "https://calendly.com" &&
    e.data.event &&
    e.data.event.indexOf("calendly.") === 0
  );
};

/** Embed Calendly widget and generate events when scheduled. */
export const EmbedCalendly = ({
  minWidth,
  height,
  prefill,
  url,
  onCalendlyEvent
}: {
  minWidth?: string;
  height?: string;
  url: string;
  prefill?: { name?: string; email?: string; customAnswers?: unknown };
  onCalendlyEvent?: (event: CalendlyEvent) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const loadCalendly = useCallback(() => {
    const cal = (window as unknown as { Calendly?: Calendly }).Calendly;
    if (cal) {
      cal.initInlineWidget({
        url,
        parentElement: ref?.current,
        prefill
      });
    } else {
      setTimeout(() => loadCalendly(), 100);
    }
  }, [prefill, url]);

  const onMessage = useCallback(
    (event: MessageEvent) => {
      if (isCalendlyEvent(event)) {
        onCalendlyEvent && onCalendlyEvent(event);
      }
    },
    [onCalendlyEvent]
  );

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");
    script.setAttribute("src", "https://assets.calendly.com/assets/external/widget.js");
    head?.appendChild(script);
    if (ref?.current) {
      // Remove older calendly (mostly dev)
      Array.from(ref?.current.childNodes).forEach(ch => {
        try {
          ref?.current?.removeChild(ch);
        } catch (e) {
          // Do not care
        }
      });
    }
    loadCalendly();

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [loadCalendly, onMessage]);

  return (
    <div
      ref={ref}
      className="calendly-inline-widget"
      data-auto-load="false"
      style={{ minWidth: minWidth || "320px", height: height || "500px" }}
    />
  );
};
