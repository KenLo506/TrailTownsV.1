# TrailTowns Icons

This folder contains custom icons for the TrailTowns app.

## Current Setup

- `trailtowns_icons.png` - Full sprite sheet with all 21 icons

## Using the Icons

The app currently uses `TrailIcon` component which maps icon names to MaterialCommunityIcons as placeholders. To use the custom icons:

### Option 1: Crop Individual Icons (Recommended)

1. Open `trailtowns_icons.png` in an image editor
2. Crop each icon individually
3. Save them as separate PNG files with these names:
   - `fox-head.png`
   - `compass.png`
   - `map.png`
   - `signpost.png`
   - `plus.png`
   - `gear.png`
   - `tree.png`
   - `mountains.png`
   - `campfire.png`
   - `lantern.png`
   - `tent.png`
   - `bridge.png`
   - `paw-print.png`
   - `hiking-boot.png`
   - `water-bottle.png`
   - `camera.png`
   - `backpack.png`
   - `shop.png`
   - `bicycle.png`
   - `trophy.png`

4. Update `components/TrailIcon.tsx` to use Image component instead of MaterialCommunityIcons

### Option 2: Use Online Tools

You can use online sprite sheet splitters or image editors to extract individual icons:
- https://www.spritecow.com/ (for sprite sheet extraction)
- GIMP, Photoshop, or any image editor with crop functionality

### Option 3: Automated Extraction (Python)

A Python script can be created to automatically crop icons if you know the grid layout. Contact developer for assistance.

## Icon Usage Map

See `ICON_GUIDE.md` in the parent `assets` folder for detailed icon usage mapping.
