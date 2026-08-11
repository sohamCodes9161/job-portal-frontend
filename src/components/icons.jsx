// Lightweight inline SVG icon set — avoids pulling in an icon library dependency.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconSearch = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconBriefcase = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const IconMapPin = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconClock = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const IconRupee = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 3h12M6 8h12M6 13h4a4 4 0 0 0 0-8M6 13l7 8" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const IconFilter = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <polygon points="4 4 20 4 14 12.5 14 19 10 21 10 12.5 4 4" />
  </svg>
);

export const IconChevronLeft = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const IconX = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconMenu = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconUser = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export const IconFileText = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

export const IconUpload = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
  </svg>
);

export const IconAlertCircle = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
);

export const IconCheckCircle = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="m8.5 12.5 2.5 2.5 5-5" />
  </svg>
);

export const IconLogOut = (p) => (
  <svg width="17" height="17" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const IconLayoutDashboard = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const IconPlus = (p) => (
  <svg width="17" height="17" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconEdit = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const IconTrash = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
);

export const IconUsers = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconInbox = (p) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

export const IconCheck = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
