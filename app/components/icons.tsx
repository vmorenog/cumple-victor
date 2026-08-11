// Iconos y ornamentos SVG inline.

export function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path
        d="M50 6 C30 6 14 22 14 42 C14 62 34 78 50 94 C66 78 86 62 86 42 C86 22 70 6 50 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M50 14 C34 14 22 26 22 42 C22 58 38 72 50 82 C62 72 78 58 78 42 C78 26 66 14 50 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.5"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="Bookman Old Style, Georgia, serif"
        fontStyle="italic"
        fontSize="42"
        fontWeight="700"
        fill="currentColor"
      >
        V
      </text>
    </svg>
  );
}

export function ReservaStamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="10"
        fontWeight="bold"
        fill="currentColor"
        letterSpacing="1.5"
      >
        RESERVA
      </text>
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="bold"
        fill="currentColor"
      >
        CUMPLE
      </text>
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="8"
        fill="currentColor"
        letterSpacing="1"
      >
        — 2026 —
      </text>
    </svg>
  );
}

export function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 40" aria-hidden="true" className={className}>
      <path
        d="M8 20 C 40 4, 80 36, 130 20 S 220 4, 252 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="130" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
