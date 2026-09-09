import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateTruck } from '@/transport_company/trucks/hooks/useTrucks';
import { usePairCard } from '@/transport_company/trucks/hooks/usePairCard';
import { CardCaptureField } from '@/transport_company/trucks/components/CardCaptureField';
import { toast } from '@/lib/toast/toast';
import { apiErrorMessage } from '@/lib/api/api-error';

interface AddTruckFormProps {
  onCancel: () => void;
  entityName: string;
}

const NUMBER_COUNT = 4;
const LETTER_COUNT = 3;
/** Latin or Arabic-Indic digits — an operator may be on either keyboard layout. */
const NUMBER_CHAR = /^[0-9٠-٩]$/;
const LETTER_CHAR = /^[A-Za-zء-ي]$/;

const BOX_CLASS =
  'w-14 h-16 text-center text-3xl text-slate-700 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow disabled:bg-slate-50 disabled:text-slate-400';

/**
 * Feature 009 T084/FR-039/FR-045: wired to real creation (`POST /trucks`) and, once
 * created, real card pairing — the NFC placeholder this form once had is the live
 * CardCaptureField rather than static markup. Capture is armed only after a truck exists to
 * pair the card to and while this form is still open (FR-048).
 *
 * The plate is entered as separate number/letter boxes (the platform still stores one
 * string: `"1234 ABC"`). The boxes are real inputs, so the capture hook deliberately ignores
 * keystrokes landing in them; they are disabled the moment the truck is created, which drops
 * focus back to the body and lets a reader's burst reach the capture surface.
 */
export function AddTruckForm({ onCancel, entityName }: AddTruckFormProps) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(() => Array<string>(NUMBER_COUNT).fill(''));
  const [letters, setLetters] = useState<string[]>(() => Array<string>(LETTER_COUNT).fill(''));
  const [model, setModel] = useState('');
  const [createdTruckId, setCreatedTruckId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  // One list in typing order: 0..3 numbers, then 4..6 letters.
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  const createTruck = useCreateTruck();
  const pairCard = usePairCard(createdTruckId ?? '');

  const numbersPart = digits.join('');
  const lettersPart = letters.join('');
  const plateNumber = [numbersPart, lettersPart].filter(Boolean).join(' ');
  const plateComplete = Boolean(numbersPart && lettersPart);
  const locked = Boolean(createdTruckId);

  function focusBox(index: number): void {
    boxRefs.current[index]?.focus();
  }

  function setBox(kind: 'number' | 'letter', index: number, raw: string): void {
    const char = raw.slice(-1);
    const setter = kind === 'number' ? setDigits : setLetters;
    const flatIndex = kind === 'number' ? index : NUMBER_COUNT + index;

    if (char === '') {
      setter((prev) => prev.map((value, i) => (i === index ? '' : value)));
      return;
    }
    const pattern = kind === 'number' ? NUMBER_CHAR : LETTER_CHAR;
    if (!pattern.test(char)) return;

    setter((prev) => prev.map((value, i) => (i === index ? (kind === 'letter' ? char.toUpperCase() : char) : value)));
    if (flatIndex < NUMBER_COUNT + LETTER_COUNT - 1) focusBox(flatIndex + 1);
  }

  function onBoxKeyDown(kind: 'number' | 'letter', index: number, e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key !== 'Backspace') return;
    const current = kind === 'number' ? digits[index] : letters[index];
    if (current) return;
    const flatIndex = kind === 'number' ? index : NUMBER_COUNT + index;
    if (flatIndex === 0) return;
    e.preventDefault();
    const previousFlat = flatIndex - 1;
    if (previousFlat < NUMBER_COUNT) {
      setDigits((prev) => prev.map((value, i) => (i === previousFlat ? '' : value)));
    } else {
      setLetters((prev) => prev.map((value, i) => (i === previousFlat - NUMBER_COUNT ? '' : value)));
    }
    focusBox(previousFlat);
  }

  function onCreate(): void {
    if (!plateComplete) return;
    createTruck.mutate(
      { plateNumber, model: model.trim() || undefined },
      {
        onSuccess: (truck) => setCreatedTruckId(truck.id),
        // This asserted "duplicate plate" for EVERY failure — a validation error or an
        // outage read as a plate collision, sending the operator to change a plate that
        // was never the problem. A duplicate really is the likeliest cause, so it stays
        // as the fallback, but the platform's own message wins when there is one.
        onError: (err) => toast.error(apiErrorMessage(err, t('trucks.duplicatePlate'))),
      },
    );
  }

  function onPairConfirm(uid: string): void {
    pairCard.mutate(uid, {
      onSuccess: () => {
        setOpen(false);
        onCancel();
      },
      onError: (error) => {
        const details = (error as { details?: { heldByPlateNumber?: string } }).details;
        toast.error(
          details?.heldByPlateNumber
            ? t('trucks.pairing.alreadyPairedNamed', { plate: details.heldByPlateNumber })
            : t('trucks.pairing.alreadyPaired'),
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-12 w-full relative pb-16">
      {/* Row 1: License Plate Inputs */}
      <div className="flex justify-center w-full mt-4">
        <div className="flex items-center gap-6 lg:gap-10">

          {/* Numbers */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3" dir="ltr">
              {digits.map((value, index) => (
                <input
                  key={`number-${index}`}
                  ref={(el) => {
                    boxRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="."
                  value={value}
                  disabled={locked}
                  aria-label={`${t('trucks.plateNumbers')} ${index + 1}`}
                  onChange={(e) => setBox('number', index, e.target.value)}
                  onKeyDown={(e) => onBoxKeyDown('number', index, e)}
                  className={BOX_CLASS}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-400">{t('trucks.plateNumbers')}</span>
          </div>

          {/* Separator / Title */}
          <div className="flex flex-col items-center justify-center -mt-8">
            <span className="text-sm font-black text-slate-900 mb-2">{t('trucks.plateNumber')}</span>
            <div className="w-4 h-[3px] bg-slate-900 rounded-full"></div>
          </div>

          {/* Letters */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3" dir="ltr">
              {letters.map((value, index) => (
                <input
                  key={`letter-${index}`}
                  ref={(el) => {
                    boxRefs.current[NUMBER_COUNT + index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  placeholder="."
                  value={value}
                  disabled={locked}
                  aria-label={`${t('trucks.plateLetters')} ${index + 1}`}
                  onChange={(e) => setBox('letter', index, e.target.value)}
                  onKeyDown={(e) => onBoxKeyDown('letter', index, e)}
                  className={BOX_CLASS}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-400">{t('trucks.plateLetters')}</span>
          </div>

        </div>
      </div>

      {/* Optional model — the platform accepts it on creation, so it stays entered here. */}
      <div className="flex justify-center w-full -mt-6">
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <label className="text-sm font-bold text-slate-400" htmlFor="truck-model">
            {t('trucks.model')}
          </label>
          <input
            id="truck-model"
            type="text"
            value={model}
            disabled={locked}
            onChange={(e) => setModel(e.target.value)}
            className="w-full h-12 text-center text-sm font-bold text-slate-700 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      {/* Row 2: NFC Card & Ciro Pay */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-5xl mx-auto">

        {/* Right Column (in RTL): NFC Card */}
        <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full lg:max-w-[400px] lg:mr-auto">
          <div className="flex justify-center items-center gap-2 mb-2">
            <img src="/transportCompany/trucks/addTruck/wifiIcon.svg" alt="" className="w-6 h-6" />
            <span className="text-base font-bold text-slate-900">{t('trucks.pairing.nfcTitle')}</span>
          </div>

          {locked ? (
            /* Live capture (FR-045–051) — armed only while this form is open. */
            <CardCaptureField
              armed={open}
              targetLabel={plateNumber}
              onConfirm={onPairConfirm}
              disabled={pairCard.isPending}
            />
          ) : (
            <>
              <div className="relative">
                <div className="w-full text-center text-xs font-bold text-slate-300 border border-slate-200 rounded-xl py-3.5 px-4 bg-white select-none">
                  {t('trucks.pairing.autoCapturePlaceholder')}
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-xs font-bold text-slate-400">
                  {t('trucks.pairing.createFirst', { entity: entityName })}
                </span>
              </div>
            </>
          )}

          {locked && (
            <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-4 text-center flex flex-col gap-1.5">
              <div className="flex items-center justify-center gap-1.5 text-blue-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 4.67334V4.66668M8 11.3333L8 6.66667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#1E5FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-bold">{t('trucks.pairing.presentCard')}</span>
              </div>
              <span className="text-xs font-bold text-blue-500">{t('trucks.pairing.autoCaptureNote')}</span>
            </div>
          )}
        </div>

        {/* Left Column (in RTL): Ciro Pay Logo */}
        <div className="flex items-center justify-center gap-4 shrink-0 w-full lg:ml-auto">
          <style>
            {`
              @keyframes fade-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.1); }
              }
              .animate-signal-1 { animation: fade-pulse 2s ease-in-out infinite; }
              .animate-signal-2 { animation: fade-pulse 2s ease-in-out infinite; animation-delay: 1s; }
            `}
          </style>
          <div className="animate-signal-1">
            <img src="/transportCompany/trucks/connecting.gif" className="w-10 h-20 object-contain transform rotate-180" alt="" />
          </div>
          <div className="w-[200px] h-[200px] rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden z-10">
            <img src="/transportCompany/trucks/addTruck/CiroPay.png" alt="CiroPay" className="w-full h-full object-contain p-2" />
          </div>
          <div className="animate-signal-2">
            <img src="/transportCompany/trucks/connecting.gif" className="w-10 h-20 object-contain" alt="" />
          </div>
        </div>

      </div>

      {/* Action Buttons (Absolute Bottom Left) */}
      <div className="absolute bottom-0 left-0 flex items-center justify-start gap-3">
        <button
          onClick={() => {
            setOpen(false);
            onCancel();
          }}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold"
          dir="ltr"
        >
          <span dir="rtl">{t('common.cancel')}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {!locked && (
          <button
            onClick={onCreate}
            disabled={createTruck.isPending || !plateComplete}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm disabled:opacity-50"
            dir="ltr"
          >
            <span dir="rtl">{t('trucks.addEntity', { entity: entityName })}</span>
            <img src="/transportCompany/trucks/whitePlus.svg" alt="" className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
