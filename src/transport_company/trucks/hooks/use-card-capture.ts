import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Feature 009 FR-045–051 (research.md R5): captures a physical card's identifier through
 * either of two paths, converging on one confirmation.
 *
 * - **A reader presenting as a keyboard** (FR-045) — always available, so the one path that
 *   must never be absent. Types the identifier as keystrokes wherever focus happens to be;
 *   discriminated from a person typing by inter-keystroke timing plus a terminating newline
 *   (FR-047): a machine-speed burst is a scan, anything slower is a person and must be
 *   submitted deliberately.
 * - **The device reading the card itself** (FR-046) — feature-detected (Web NFC `NDEFReader`),
 *   subscribed only on an explicit gesture, never asked about.
 *
 * Both converge on `pendingCapture` (FR-049): shown for confirmation, never bound
 * automatically. A second read **replaces** the pending value rather than queuing (FR-049's
 * "double-read harmless" note) — a repeating reader binds once. The identifier is held only
 * in this hook's state and is **never logged** (FR-051).
 *
 * `armed` gates capture (FR-048): pass `true` only while the consuming screen is mounted and
 * actually awaiting a card. This is what stops a stray read reaching some other field — by
 * construction, not by operator discipline — so the caller MUST tie `armed` to its own mount
 * lifecycle, never leave it permanently true.
 */

export type CaptureSource = 'reader' | 'device' | 'manual';

export interface PendingCapture {
  uid: string;
  source: CaptureSource;
}

// A reader's keystrokes land well under this gap; a person's do not. Not a hard physical
// constant — chosen wide enough to tolerate a slow USB HID poll rate, narrow enough that no
// human types this fast.
const READER_MAX_INTERVAL_MS = 40;
// Below this, treat every char as one machine-speed burst rather than assessing gaps.
const MIN_BURST_LENGTH = 6;

interface NdefReadingEventLike {
  serialNumber?: string;
}
interface NdefReaderLike {
  scan: () => Promise<void>;
  addEventListener: (type: 'reading', listener: (event: NdefReadingEventLike) => void) => void;
  removeEventListener: (type: 'reading', listener: (event: NdefReadingEventLike) => void) => void;
}

function getNdefReaderCtor(): (new () => NdefReaderLike) | undefined {
  return (window as unknown as { NDEFReader?: new () => NdefReaderLike }).NDEFReader;
}

export function useCardCapture(armed: boolean) {
  const [pendingCapture, setPendingCapture] = useState<PendingCapture | null>(null);
  const [manualDraft, setManualDraft] = useState('');
  const [deviceReading, setDeviceReading] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const bufferRef = useRef('');
  const keyTimestampsRef = useRef<number[]>([]);
  const lastKeyAtRef = useRef(0);
  const readerRef = useRef<NdefReaderLike | null>(null);

  const deviceReadAvailable = typeof window !== 'undefined' && Boolean(getNdefReaderCtor());

  const acceptCapture = useCallback((uid: string, source: CaptureSource) => {
    // A second read replaces the pending value — never queued, never bound twice.
    setPendingCapture({ uid, source });
  }, []);

  const clearCapture = useCallback(() => {
    setPendingCapture(null);
    setManualDraft('');
  }, []);

  // Keyboard-wedge capture (FR-045/FR-047/FR-048). Listens at the window level — the
  // operator must not have to click into a field first — but ONLY while armed.
  useEffect(() => {
    if (!armed) {
      bufferRef.current = '';
      keyTimestampsRef.current = [];
      return;
    }

    function onKeyDown(e: KeyboardEvent): void {
      // Ignore modifier-only presses and anything typed into a real input the
      // operator is deliberately using (manual entry has its own field).
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const now = performance.now();
      const gap = now - lastKeyAtRef.current;
      lastKeyAtRef.current = now;

      // Enter is the usual terminator, but these readers are commonly
      // configured to send Tab instead, and a Tab that terminates a scan must
      // not also move focus out of the dialog.
      if (e.key === 'Enter' || e.key === 'Tab') {
        const buffered = bufferRef.current;
        bufferRef.current = '';
        const timestamps = keyTimestampsRef.current;
        keyTimestampsRef.current = [];
        if (!buffered) return;

        const isFastBurst =
          buffered.length >= MIN_BURST_LENGTH &&
          timestamps.every((g) => g <= READER_MAX_INTERVAL_MS);
        if (isFastBurst) {
          if (e.key === 'Tab') e.preventDefault();
          acceptCapture(buffered, 'reader');
        }
        // A newline after slow typing is not auto-accepted — FR-047 requires
        // deliberate manual submission, handled by the dialog's own field.
        return;
      }

      if (e.key.length === 1) {
        if (gap > READER_MAX_INTERVAL_MS * 4 && bufferRef.current) {
          // A long pause mid-buffer means this was never one burst — drop it
          // rather than merge unrelated keystrokes into one false reading.
          bufferRef.current = '';
          keyTimestampsRef.current = [];
        }
        // Record the gap only BETWEEN characters. The gap before the first
        // character is idle time since whatever was typed last — often
        // minutes — and says nothing about how fast this burst arrived.
        // Recording it put a value no scan could ever satisfy at the head of
        // every burst, so the `every()` test above rejected every genuine
        // read and the wedge path never accepted a card at all.
        if (bufferRef.current) {
          keyTimestampsRef.current.push(gap);
        }
        bufferRef.current += e.key;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [armed, acceptCapture]);

  // Device read path (FR-046) — feature-detected, subscribed only on explicit gesture.
  const startDeviceRead = useCallback(async () => {
    const Ctor = getNdefReaderCtor();
    if (!Ctor || !armed) return;
    setDeviceError(null);
    setDeviceReading(true);
    try {
      const reader = new Ctor();
      readerRef.current = reader;
      const onReading = (event: NdefReadingEventLike) => {
        if (event.serialNumber) {
          acceptCapture(event.serialNumber, 'device');
        }
      };
      reader.addEventListener('reading', onReading);
      await reader.scan();
    } catch {
      setDeviceError('device-read-failed');
      setDeviceReading(false);
    }
  }, [armed, acceptCapture]);

  useEffect(() => {
    if (!armed) {
      setDeviceReading(false);
      readerRef.current = null;
    }
  }, [armed]);

  const submitManual = useCallback(() => {
    const trimmed = manualDraft.trim();
    if (trimmed) {
      acceptCapture(trimmed, 'manual');
    }
  }, [manualDraft, acceptCapture]);

  return {
    pendingCapture,
    clearCapture,
    manualDraft,
    setManualDraft,
    submitManual,
    deviceReadAvailable,
    deviceReading,
    deviceError,
    startDeviceRead,
  };
}
