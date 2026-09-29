# Photobooth

A simple client-side photobooth for GitHub Pages.

## Features

- Browser webcam
- Three automatically captured photos
- Adjustable countdown
- Persistent bottom image using `localStorage`
- 2 × 4 inch photo strip
- Browser printing
- No backend required

## GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`.
3. Open the repository's **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select the branch containing these files and `/ (root)`.
6. Save.

GitHub Pages will provide an HTTPS URL. Camera access requires a secure context, so use the HTTPS GitHub Pages address.

## Printing

The CSS defines the print page as exactly 2 × 4 inches.

For the most accurate result, use:

- Scale: 100%
- Margins: None
- Paper: 2 × 4 inches
- Headers/footers: Off

Your printer driver may have its own paper-size or borderless-print settings. If the printer does not support a true 2 × 4 custom paper size, use its driver/software to define the paper size rather than changing the website's dimensions.

## Persistent image

The uploaded bottom image is stored as a data URL in browser `localStorage`.

This means:

- Refreshing the page keeps the image.
- Closing and reopening the browser normally keeps the image.
- The image is stored only in that browser on that device.
- Clearing site data/browser storage removes it.
- Very large images may exceed the browser's localStorage quota.

## Configuration

The main settings are at the top of `app.js`:

```js
const CONFIG = {
  photos: 3,
  countdownSeconds: 3,
  storageKey: "photobooth-bottom-image"
};
```

The UI currently lets the user change the countdown, so `countdownSeconds` is mainly the default value.
