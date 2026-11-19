# KAYARABUKO SAFARIS — PROJECT SCOPE OF WORK & CLIENT ONBOARDING BRIEF
**Project Reference:** Custom Safari Booking Platform & Digital Architecture  
**Invoice Number:** 00020  
**Invoice Date:** October 06, 2026  
**Total Project Investment:** KSH 45,000  
**Client:** KayArabuko Safaris (Nakuru, Kenya)  
**Lead Architect & Developer:** Hillary Chajira (`hillarychajira0@gmail.com` | `+254 718 030 816`)  
**Payment Method:** Safaricom M-Pesa Send Money (`0718030816`)

---

## 1. Executive Summary

KayArabuko Safaris is positioned not merely as a travel operator, but as:
> *"Explore. Conserve. Empower."*  
> *"Not just a destination... but a story."*  
> *"Story tellers and custodians of our African cultures."*

To translate this vision into a market-competing commercial platform, we are delivering an enterprise-grade web application built to compete with international safari marketplaces (e.g., SafariBookings) and luxury Kenyan safari outfits. 

This document serves as the formal **Scope of Work (SOW)** corresponding to **Invoice #00020**, breaking down each line item, the technical deliverables included, and the specific information needed from KayArabuko to bring the platform live.

---

## 2. Itemized Breakdown & Deliverable Scope (Invoice #00020)

### Item 01: Domain Name Purchase
* **Amount:** KSH 3,500
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Acquisition and registration of the official custom domain (e.g., `kayarabukosafaris.com` or `kayarabuko.com`).
  * Full DNS records configuration (A, CNAME, TXT, MX) for fast global resolution.
  * Integration with professional business email records (e.g., Google Workspace / Zoho Mail).
  * Domain locking and registrar privacy protection to guard against domain theft or spam.
* **Commercial Value to KayArabuko:** Establishes instant digital legitimacy, protects brand trademark rights, and builds authority with international safari clients and payment providers.

---

### Item 02: Website Hosting (Firebase Cloud Infrastructure)
* **Amount:** KSH 5,000
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Provisioning of Google Firebase / Google Cloud global edge infrastructure.
  * SSL Encryption Certificates (HTTPS 256-bit) for 100% secure browsing and cardholder safety.
  * Cloud Storage bucket setup (`legaprimed.firebasestorage.app`) for high-resolution wildlife and destination photography.
  * Global Content Delivery Network (CDN) deployment ensuring sub-second load times for safari travellers visiting the website from the USA, Europe, the UK, Asia, and Kenya.
  * Automated 99.9% uptime monitoring and protection against traffic spikes during peak migration booking seasons.
* **Commercial Value to KayArabuko:** Guarantees zero downtime and lightning-fast speeds worldwide, ensuring international guests never abandon an inquiry due to a slow website.

---

### Item 03: Website Content & Editorial Safari Copywriting
* **Amount:** KSH 6,500
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Original, evocative storytelling copy tailored to the KayArabuko brand philosophy: *"Explore. Conserve. Empower."*
  * **27 Destination Profiles:** Comprehensive guides covering Kenya’s top national parks and conservancies (Maasai Mara, Amboseli, Lake Nakuru, Tsavo East & West, Samburu, Ol Pejeta, Mount Kenya, Diani Beach, Watamu, etc.) including best travel seasons, wildlife highlights, and cultural notes.
  * **10 Flagship Safari Package Itineraries:** Detailed day-by-day itineraries, inclusions, exclusions, accommodation tiers, and packing advice.
  * Cultural and conservation narratives spotlighting authentic Kenyan heritage and responsible tourism.
  * Professional conversion copywriting across the homepage, call-to-actions, inquiry forms, and trust badges.
* **Commercial Value to KayArabuko:** Eliminates generic AI-sounding text. High-quality editorial copy convinces international travellers to trust KayArabuko with multi-thousand dollar safari bookings.

---

### Item 04: Website Design (UI/UX) — Custom Kenyan Visual Identity
* **Amount:** KSH 10,000
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Tailor-made, elegant African editorial design system crafted specifically for KayArabuko:
    * **Primary Green (`#0B4B2E`) & Deep Forest Green (`#063B25`):** Conservation, trust, wilderness.
    * **Warm Gold (`#C7942D`) & Light Gold (`#E2C477`):** Heritage, premium safari hospitality.
    * **Warm Cream (`#F6E4C8`) & Ivory (`#FFF9EE`):** Elegant storytelling and readable contrast.
    * **Charcoal (`#1F2A24`):** High-readability typography.
  * Sophisticated editorial typography pairing: Literary Serif for headlines and crisp modern Sans-Serif for user interfaces.
  * **100% Mobile-First Responsive Design:** Smooth slide-out mobile drawer navigation, tactile buttons, touch-friendly filter panels, and zero horizontal scrolling on all phone and tablet screens.
  * **Interactive Search Bar ("Find My Safari"):** Smart filtering by destination, style, budget, and duration.
  * Dynamic destination card grids, guest reviews showcase, and multi-step safari custom planner wizard.
* **Commercial Value to KayArabuko:** A distinctive luxury aesthetic that elevates KayArabuko above typical tour agencies and commands premium booking rates.

---

### Item 05: Backend Development & Safari Booking Engine
* **Amount:** KSH 15,000
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Complete serverless database architecture built on Google Cloud Firestore (`organizations/kayarabuko-safaris/`).
  * Multi-collection database schema supporting:
    * **Destinations & Safari Packages Database** (live price changes, inclusions, itineraries).
    * **Bookings & Inquiries Pipeline** (capturing guest details, dates, party size, custom requests).
    * **Direct Lead Generation API** (`/api/leads` and `/api/bookings`) with real-time Firestore persistence.
    * **Quotations & Proposal Engine** (generating shareable proposals for prospective clients).
    * **Naturalist & Driver-Guide Roster** (tracking KPSGA certifications, languages, assignments).
    * **Fleet Management** (custom 4x4 Safari Land Cruisers and vans).
  * **Administrative Control Panel (`/admin`):** Secure private dashboard where the KayArabuko management team can manage safaris, view bookings, edit company settings, and update media links in real time.
* **Commercial Value to KayArabuko:** Replaces chaotic WhatsApp/spreadsheet tracking with an automated commercial booking system, accelerating response times and closing bookings faster.

---

### Item 06: Search Engine Optimization (SEO) & Structured Data
* **Amount:** KSH 5,000
* **Quantity:** 1x
* **Scope & Deliverables:**
  * Complete Technical SEO infrastructure in Next.js App Router.
  * Rich Google Schema markup (`JSON-LD`):
    * `TravelAgency` & `LocalBusiness` structured data for Google Knowledge Graph.
    * `TouristTrip` & `Product` schemas on all safari itineraries for search rich snippets.
    * `TouristDestination` schemas on all 27 destination guides.
    * `FAQPage` and `BreadcrumbList` schemas for enhanced Google SERP visibility.
  * Automatic XML sitemap generation (`/sitemap.xml`) and dynamic `robots.txt`.
  * OpenGraph (OG) and Twitter Card metadata for rich previews when links are shared on WhatsApp, Facebook, iMessage, and LinkedIn.
  * Target keyword optimization for high-value phrases (e.g., *"Kenya luxury safari"*, *"Maasai Mara migration tour"*, *"Nakuru safari operator"*).
* **Commercial Value to KayArabuko:** Drives consistent, free organic traffic from international travellers actively searching for Kenya safari operators on Google.

---

## 3. Financial Summary

| Item # | Description | Unit Price | Qty | Total (KSH) |
| :--- | :--- | :--- | :---: | :--- |
| **01** | Domain Name Purchase | KSH 3,500 | 1x | KSH 3,500 |
| **02** | Website Hosting (Firebase Cloud Infrastructure) | KSH 5,000 | 1x | KSH 5,000 |
| **03** | Website Content & Editorial Safari Copywriting | KSH 6,500 | 1x | KSH 6,500 |
| **04** | Website Design (UI/UX) — Custom African Identity | KSH 10,000 | 1x | KSH 10,000 |
| **05** | Backend Development & Safari Booking Engine | KSH 15,000 | 1x | KSH 15,000 |
| **06** | Search Engine Optimization (SEO) & Structured Data | KSH 5,000 | 1x | KSH 5,000 |
| | **TOTAL DUE AMOUNT:** | | | **KSH 45,000** |

* **Payment Method:** Safaricom M-Pesa Send Money: `0718030816` (Hillary Chajira)

---

## 4. Client Onboarding Questionnaire: Details Needed from KayArabuko

To finalize the integration and publish the website live under KayArabuko's official brand profile, please provide the details outlined below:

### Section A: Official Business Information
1. **Registered Business Name:** __________________________________________________
2. **Physical Office Address (Nakuru):** ____________________________________________
3. **Nairobi or Coastal Branch Office (if any):** _____________________________________
4. **KRA PIN (for invoicing / footer display):** _______________________________________
5. **KATO Membership Number (if accredited):** ____________________________________
6. **Tourism Regulatory Authority (TRA) License #:** _______________________________

### Section B: Official Communication Channels
1. **Primary Telephone Number:** __________________________________________________
2. **Official WhatsApp Business Number:** _________________________________________ *(Used for the instant chat button on the website)*
3. **General Inquiries Email:** _____________________________________________________
4. **Reservations / Bookings Email:** _______________________________________________
5. **24/7 Guest Emergency Contact Number:** _______________________________________ *(Displayed on client safari vouchers & itineraries)*

### Section C: Social Media Profiles
*Please provide the exact URLs or @handles for each platform:*
1. **Instagram:** __________________________________________________________________
2. **Facebook Page:** _____________________________________________________________
3. **TikTok:** ____________________________________________________________________
4. **LinkedIn:** __________________________________________________________________
5. **YouTube Channel:** ___________________________________________________________
6. **TripAdvisor / Google Business Profile Link:** __________________________________

### Section D: Payment & Financial Details
1. **Safaricom M-Pesa Till Number OR Paybill & Account Number:** __________________
2. **Account Name (as displayed on M-Pesa prompt):** ________________________________
3. **Bank Details for International Wire / SWIFT Transfers (Optional):**
   * Bank Name: __________________________________________________________________
   * Account Name: ________________________________________________________________
   * Account Number / IBAN: ______________________________________________________
   * SWIFT / BIC Code: ___________________________________________________________
4. **Default Safari Booking Deposit (% required to confirm, e.g., 30%):** _____________

### Section E: Brand Media & Photography Assets
*Please share a Google Drive or Dropbox link containing:*
1. **High-Resolution Logo Files:** Transparent background (.PNG or .SVG preferred), both dark and light versions.
2. **Safari Vehicle Photos:** Images of your customized 4x4 Safari Land Cruisers or Safari Vans (exterior and interior).
3. **Guide / Team Photos:** Photos of your professional naturalist safari driver-guides in uniform.
4. **Authentic Field Photos/Videos:** Any high-quality images taken on previous KayArabuko game drives in the Maasai Mara, Amboseli, Nakuru, Tsavo, or the coast.

---

## 5. Next Steps & Launch Timeline

1. **Information Submission:** Client fills out and returns the checklist in Section 4.
2. **Final Asset Injection:** Logo, contacts, and custom pricing configurations are updated in the live Firebase database.
3. **Domain & DNS Pointing:** Domain is pointed to the Firebase hosting server.
4. **Testing & Sign-Off:** Full walkthrough of inquiry submissions, mobile responsiveness, and admin management.
5. **Platform Go-Live:** Official public launch.
