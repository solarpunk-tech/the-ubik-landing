import type { SVGProps } from "react";

const GoogleCalendar = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 48 48">
    <path fill="#fff" d="M34 46H14a4 4 0 0 1-4-4V14h28v28a4 4 0 0 1-4 4Z" />
    <path fill="#1a73e8" d="M42 14H6V9a4 4 0 0 1 4-4h4v3.5a1.5 1.5 0 0 0 3 0V5h14v3.5a1.5 1.5 0 0 0 3 0V5h4a4 4 0 0 1 4 4Z" />
    <rect width="3" height="6" x="12.5" y="2" fill="#1967d2" rx="1.5" />
    <rect width="3" height="6" x="32.5" y="2" fill="#1967d2" rx="1.5" />
    <path fill="#4285f4" d="M10 21h9v9h-9z" />
    <path fill="#34a853" d="M19 21h9v9h-9z" />
    <path fill="#fbbc04" d="M10 30h9v8h-9z" />
    <path fill="#ea4335" d="M19 30h9v8h9v-9h-9z" />
    <path fill="#1a73e8" d="M28 21h10v9H28z" />
  </svg>
);

export { GoogleCalendar };
