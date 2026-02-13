# TrailTowns Icons Guide

This document maps the custom icons from `trailtowns_icons.png` to their usage in the app.

## Icon Mapping

### App & Branding
- **fox-head** → App icon, user avatar, profile picture
- **Trail Towns Logo** → Header logo, splash screen

### Navigation & Map
- **compass** → Navigation, direction features
- **map** → Map view, location features
- **signpost** → Points of interest, directions

### Actions & UI
- **plus** (2x) → Add stamp button, create actions
- **gear** → Settings, configuration

### Nature & Outdoor
- **tree** → Header logo, nature features
- **mountains** → Mountain trails, elevation
- **campfire** → Rest stops, camping spots
- **lantern** → Night features, lighting
- **tent** → Camping, shelter
- **bridge** → Trail landmarks, crossings
- **paw-print** → Wildlife tracking, exploration

### Gear & Items
- **hiking-boot** → Hiking gear, equipment
- **water-bottle** → Supplies, hydration
- **camera** → Photo features, gallery
- **backpack** → Inventory, supplies

### Activities & Locations
- **shop** → Trail towns, stores, POIs
- **bicycle** → Cycling activities
- **trophy** → Achievements, leaderboard

## Current Implementation

The icons are currently referenced via MaterialCommunityIcons as placeholders. To use the custom icons:

1. **Option 1: Crop individual icons** (Recommended)
   - Crop each icon from the sprite sheet
   - Save as individual PNG files in `assets/icons/`
   - Update `CustomIcon.tsx` to use Image component

2. **Option 2: Use sprite sheet**
   - Implement sprite sheet positioning
   - Reference specific regions of the image
   - More complex but keeps one file

## Icon Usage Locations

- **Header**: tree → fox-head or Trail Towns logo
- **Home Screen**: map, plus, compass, signpost
- **Profile Screen**: fox-head (avatar), hiking-boot, backpack, camera
- **Leaderboard**: trophy
- **Tab Bar**: map, trophy, account (fox-head)
- **Stamps**: Various nature/outdoor icons based on stamp type
