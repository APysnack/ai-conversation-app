export const AtomLogo = ({ size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="4" fill={color} />
    <ellipse
      cx="32"
      cy="32"
      rx="20"
      ry="6"
      stroke={color}
      strokeWidth="2"
      transform="rotate(45 32 32)"
    />
    <ellipse
      cx="32"
      cy="32"
      rx="20"
      ry="6"
      stroke={color}
      strokeWidth="2"
      transform="rotate(-45 32 32)"
    />
    <ellipse cx="32" cy="32" rx="20" ry="6" stroke={color} strokeWidth="2" />
  </svg>
);

export const MembersIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const LogoutIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const SettingsIcon = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19.4 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .11-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.027 7.027 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 14.17 2h-4.34a.5.5 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.55-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.44 8.48a.5.5 0 0 0 .11.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.55 14.16a.5.5 0 0 0-.11.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.49.39 1.03.7 1.62.94l.36 2.54c.04.24.25.42.49.42h4.34c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.55 1.62-.94l2.39.96c.23.09.52-.01.61-.22l1.92-3.32a.5.5 0 0 0-.11-.64l-2.03-1.58z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
