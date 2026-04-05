import { LOCATION_URL, MAIL_TO_URL, LINKEDIN_URL } from "@/constants/constants";

export const contactLinks = [
  {
    href: MAIL_TO_URL,
    iconClass: 'fas fa-envelope',
    label: 'Email',
    value: process.env.NEXT_PUBLIC_EMAIL,
  },
  {
    href: LOCATION_URL,
    iconClass: 'fas fa-map-marker-alt',
    label: 'Location',
    value: process.env.NEXT_PUBLIC_PLACE,
  },
  {
    href: LINKEDIN_URL,
    iconClass: 'fab fa-linkedin-in',
    label: 'LinkedIn',
    value: 'ankit-bhujeja',
  },
];