# Student Accommodation Browsing

A multi-page website where students can browse, compare and book student accommodation in Bloemfontein. I built it as a portfolio project to practise responsive layout, accessible UI and vanilla JavaScript.

It's a static site with no frameworks and no build tools, just HTML, CSS and JavaScript. I kept it simple on purpose so it loads fast and is easy to maintain.

## Pages

- **Home ('index.html'):** hero section, a grid of accommodations with prices and what's included, a "How it works" section (browse, compare, book), an about section, contact details and an embedded Google Map.
- **Accommodation galleries ('rhule.html', studentsa.html', 'central.html'):** one photo gallery per accommodation. Click a photo to open it in a lightbox, then use the arrow keys, on-screen buttons or a swipe to move between photos. Press Escape to close.
- **Booking ('booking.html'):** a booking request form. Clicking "Book this" on an accommodation opens the form with that accommodation already selected.

## Features

- Responsive layout for phones, tablets and desktops, with a hamburger menu on small screens
- Accommodation cards with a gallery link and a "Book this" button
- Booking form with validation, a minimum move-in date of today, and a demo confirmation message
- Lightbox gallery with keyboard, button and touch-swipe navigation
- Automatic "Photo coming soon" placeholder when an image is missing
- Scroll animations, active-section highlighting in the navbar and a back-to-top button
- Accessibility: skip link, labelled form fields, keyboard-friendly controls, visible focus styles and reduced-motion support

## Run it locally

No setup needed. Download or clone the project and open 'index.html' in your browser.

Keep the image folders in the same directory as 'index.html'. If a folder is missing, the site shows placeholders instead of photos.

## File structure

student-living-accommodation/
├── index.html               # Home page
├── booking.html             # Booking form
├── studentsa.html           # My Student SA gallery
├── central.html             # Bloemfontein Central Student Accommodation gallery
├── rhule.html               # Rhule Accommodation gallery
├── style.css                # All styles
├── script.js                # All interactivity
├── Westderne-images/        # Rhule photos
├── Willows-images/          # My Student SA photos 
├── Central-images/          # Bloemfontein Central Student Accommodation photos 

## Adding an accommodation

1. Add a new card in 'index.html' in the Accommodations section.
2. Copy an existing gallery page, rename it, and change the heading, title and image paths.
3. Add the accommodation as an option in the dropdown in 'booking.html'. The option's 'value' must match the '?property=' value in the card's "Book this" link.

## Booking form:

The form shows a confirmation message and sends a booking to my email. 

## Built with

- **HTML and CSS:** semantic markup, CSS Grid, Flexbox and custom properties
- **JavaScript (vanilla):** mobile menu, lightbox, form handling, scroll effects and image fallbacks
- **Font Awesome 6.6:** icons
- **Google Fonts (Poppins):** typography
- **Google Maps Embed:** office location

## Contact
- ** Clicking 'WhatsApp' link will redirect to 'Whatsapp' website or App
- ** Clicking 'Phone Number' link will redirect to 'Phonebook'

Portfolio project by Siyabonga Mandiwa. &copy; 2026