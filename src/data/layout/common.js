import {
  MAIL_TO_URL,
  LOCATION_URL,
  LINKEDIN_URL,
  GITHUB_URL,
  TELEGRAM_URL,
  INSTAGRAM_URL,
  WHATSAPP_URL,
  MOBILE,
  EMAIL,
  PLACE
} from '@/constants/constants';


export const socialLinks = [
  { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', href: LINKEDIN_URL, className: 'linkedin' },
  { id: 'github', name: 'GitHub', icon: 'fab fa-github', href: GITHUB_URL, className: 'github' },
  { id: 'email', name: 'Email', icon: 'fas fa-envelope', href: MAIL_TO_URL, className: 'email' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', href: WHATSAPP_URL, className: 'whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram-plane', href: TELEGRAM_URL, className: 'telegram' },
  { id: 'instagram', name: 'Instagram', icon: 'fab fa-instagram', href: INSTAGRAM_URL, className: 'instagram' },
];

export const sectionQuickLinks = [
  { id: 'home', label: 'Home', href: '/#home', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'about', label: 'About', href: '/#about', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'skills', label: 'Skills', href: '/#skills', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'education', label: 'Education', href: '/#education', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'work', label: 'Projects', href: '/#work', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'experience', label: 'Experience', href: '/#experience', iconClass: 'fas fa-chevron-circle-right' },
  { id: 'contact', label: 'Contact', href: '/#contact', iconClass: 'fas fa-chevron-circle-right' },
];

export const footerContactInfo = [
  {
    href: `tel:${MOBILE}`,
    iconClass: 'fas fa-phone',
    label: 'Phone',
    value: MOBILE,
  },
  {
    href: MAIL_TO_URL,
    iconClass: 'fas fa-envelope',
    label: 'Email',
    value: EMAIL,
  },
  {
    href: LOCATION_URL,
    iconClass: 'fas fa-map-marked-alt',
    label: 'Location',
    value: PLACE,
  },
];

// Footer social links – URLs from constants where applicable
export const footerSocialLinks = [
  { href: LINKEDIN_URL, iconClass: 'fab fa-linkedin', className: 'linkedin' },
  { href: 'https://github.com/AnkitBhujeja', iconClass: 'fab fa-github', className: 'github' },
  { href: MAIL_TO_URL, iconClass: 'fas fa-envelope', className: 'email' },
  {
    href: `whatsapp://send?text=Hey! I'd like to chat with you.&phone=${MOBILE}`,
    iconClass: 'fab fa-whatsapp',
    className: 'whatsapp',
  },
  { href: 'https://t.me/abhujeja/', iconClass: 'fab fa-telegram-plane', className: 'telegram' },
];
