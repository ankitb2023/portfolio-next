export const EMAIL = process.env.NEXT_PUBLIC_EMAIL;
export const MOBILE = process.env.NEXT_PUBLIC_MOBILE;
export const PLACE = process.env.NEXT_PUBLIC_PLACE;

export const MAIL_TO_URL = `mailto:${EMAIL}?subject=Hi&body=Hello%20Ankit,`;
export const LOCATION_URL = "https://www.google.com/maps/place/" + PLACE.replace(/\s/g, '+');
export const WHATSAPP_URL = `whatsapp://send?text=Hey! I'd like to chat with you.&phone=${MOBILE}`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/ankit-bhujeja/";
export const GITHUB_URL = "https://github.com/AnkitBhujeja";
export const TELEGRAM_URL = "https://t.me/abhujeja";
export const INSTAGRAM_URL = "https://www.instagram.com/ankit_bhujeja";

export const MEMORY_KEY = 'portfolio_visitor_memory';;
export const CONTACT_MEMORY_KEY = 'portfolio_contact_draft';