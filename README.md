# Photobooth

A simple client-side photobooth for GitHub Pages.

## Features

- Browser webcam
- Three automatically captured photos
- Adjustable countdown
- Persistent bottom image using `localStorage`
- 2 × 4 inch photo strip
- Browser printing

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