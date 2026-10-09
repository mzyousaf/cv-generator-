"use client";

import { useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { format } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/preferences";

/** Speech recognition language per UI language. */
const SPEECH_LANGUAGE: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-SA",
  zh: "zh-CN",
};

function joinText(base: string, spoken: string): string {
  if (!spoken) {
    return base;
  }
  if (!base.trim()) {
    return spoken;
  }
  return /\s$/.test(base) ? `${base}${spoken}` : `${base} ${spoken}`;
}

type DictationTextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
};

/**
 * Textarea with a microphone button: speech is transcribed in the browser
 * (react-speech-recognition / Web Speech API) and appended to the text live.
 */
export function DictationTextarea({
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength,
}: DictationTextareaProps) {
  const { t, locale } = useI18n();
  const copy = t.createCv;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  /** Text that was in the box when dictation started. */
  const baseRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Mirror the live transcript into the text box while dictating.
  useEffect(() => {
    if (listening && transcript) {
      onChangeRef.current(joinText(baseRef.current, transcript));
    }
  }, [listening, transcript]);

  // Stop the microphone if the dialog closes mid-dictation.
  useEffect(() => () => void SpeechRecognition.abortListening(), []);

  async function toggle() {
    if (listening) {
      await SpeechRecognition.stopListening();
      return;
    }
    baseRef.current = value;
    resetTranscript();
    await SpeechRecognition.startListening({
      continuous: true,
      language: SPEECH_LANGUAGE[locale],
    });
  }

  const micProblem = !browserSupportsSpeechRecognition
    ? copy.speechUnsupported
    : !isMicrophoneAvailable
      ? copy.micBlocked
      : null;

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          rows={9}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={listening}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "min-h-[220px] pb-16",
            listening && "border-rose-300 ring-4 ring-rose-500/10",
          )}
        />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => void toggle()}
            disabled={disabled || !browserSupportsSpeechRecognition}
            aria-pressed={listening}
            className={cn(
              "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
              listening
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "border border-slate-200 bg-surface text-slate-800 hover:bg-slate-50",
            )}
          >
            <MicIcon className={cn("size-4", listening && "animate-pulse")} />
            {listening ? copy.stop : copy.speak}
          </button>
          <span className="text-xs text-slate-400" aria-live="polite">
            {format(copy.characters, { n: value.length })}
          </span>
        </div>
      </div>
      {listening ? (
        <p className="flex items-center gap-2 text-sm text-rose-700" aria-live="polite">
          <span className="size-2 animate-pulse rounded-full bg-rose-500" aria-hidden="true" />
          {copy.listening}
        </p>
      ) : micProblem ? (
        <p className="text-xs text-slate-500">{micProblem}</p>
      ) : null}
    </div>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
