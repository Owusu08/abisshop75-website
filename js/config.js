/* ==========================================================================
   SITE SETTINGS — edit this file to personalise the whole website.
   Anything left empty ("") is simply not shown on the site.
   ========================================================================== */
window.SITE_CONFIG = {
  name: "ABISSHOP 75 Enterprise",

  // Prices in products-data.js are shown in this currency.
  // Examples: { code: "EUR", locale: "en-GB" }   { code: "GHS", locale: "en-GH" }   { code: "USD", locale: "en-US" }
  currency: { code: "EUR", locale: "en-GB" },

  // WhatsApp number with country code, digits only (e.g. Ghana: "233241234567").
  // When set, "Request order" and the contact form can continue on WhatsApp.
  whatsapp: "",

  // Contact details (shown on the Contact page and in the footer)
  email: "",
  phone: "",
  address: "",
  hours: "",

  // Social links — full URLs, e.g. "https://instagram.com/abisshop75"
  social: { instagram: "", facebook: "", tiktok: "" },

  // true  = forms show a small "preview" note (nothing is actually sent anywhere yet)
  // false = hides that note (set this once real order/contact handling is connected)
  previewMode: true
};
