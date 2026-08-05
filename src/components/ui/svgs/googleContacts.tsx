import type { SVGProps } from "react";

const GoogleContacts = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#1a73e8" />
    <circle cx="24" cy="19" r="7" fill="#fff" />
    <path fill="#fff" d="M24 28c-7.18 0-13 4.03-13 9v1a22 22 0 0 0 26 0v-1c0-4.97-5.82-9-13-9Z" />
  </svg>
);

export { GoogleContacts };
