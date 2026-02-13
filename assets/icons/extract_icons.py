#!/usr/bin/env python3
"""
Script to extract individual icons from trailtowns_icons.png sprite sheet.

This script assumes the icons are arranged in a grid. You may need to adjust
the grid dimensions and icon sizes based on the actual sprite sheet layout.

Usage:
    python extract_icons.py
"""

from PIL import Image
import os

# Configuration - adjust these based on your sprite sheet
SPRITE_SHEET_PATH = 'trailtowns_icons.png'
ICON_SIZE = 128  # Size of each icon (adjust as needed)
GRID_COLS = 5    # Number of columns in the grid
GRID_ROWS = 5    # Number of rows in the grid
OUTPUT_DIR = 'extracted'

# Icon names in order (left to right, top to bottom)
ICON_NAMES = [
    'fox-head',      # Row 1
    'compass',
    'map',
    'signpost',
    'plus',
    'gear',          # Row 2
    'tree',
    'mountains',
    'campfire',
    'lantern',
    'tent',          # Row 3
    'bridge',
    'paw-print',
    'hiking-boot',
    'water-bottle',
    'camera',        # Row 4
    'backpack',
    'shop',
    'bicycle',
    'trophy',
    'trailtowns-logo',  # Row 5 (if exists)
]

def extract_icons():
    """Extract individual icons from sprite sheet."""
    # Open the sprite sheet
    try:
        sprite_sheet = Image.open(SPRITE_SHEET_PATH)
    except FileNotFoundError:
        print(f"Error: Could not find {SPRITE_SHEET_PATH}")
        print("Make sure the sprite sheet is in the same directory as this script.")
        return
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Get sprite sheet dimensions
    sheet_width, sheet_height = sprite_sheet.size
    print(f"Sprite sheet size: {sheet_width}x{sheet_height}")
    
    # Calculate spacing (if any)
    # Adjust these if icons have padding/borders
    icon_spacing_x = 0
    icon_spacing_y = 0
    
    # Extract each icon
    icon_index = 0
    for row in range(GRID_ROWS):
        for col in range(GRID_COLS):
            if icon_index >= len(ICON_NAMES):
                break
            
            # Calculate position
            x = col * (ICON_SIZE + icon_spacing_x)
            y = row * (ICON_SIZE + icon_spacing_y)
            
            # Check bounds
            if x + ICON_SIZE > sheet_width or y + ICON_SIZE > sheet_height:
                print(f"Warning: Icon at ({x}, {y}) is out of bounds")
                continue
            
            # Crop icon
            icon = sprite_sheet.crop((x, y, x + ICON_SIZE, y + ICON_SIZE))
            
            # Save icon
            icon_name = ICON_NAMES[icon_index]
            output_path = os.path.join(OUTPUT_DIR, f"{icon_name}.png")
            icon.save(output_path, 'PNG')
            print(f"Extracted: {icon_name}.png")
            
            icon_index += 1
    
    print(f"\n✅ Extracted {icon_index} icons to {OUTPUT_DIR}/")
    print("\nNext steps:")
    print("1. Review the extracted icons")
    print("2. Adjust ICON_SIZE, GRID_COLS, GRID_ROWS if needed")
    print("3. Move icons to assets/icons/")
    print("4. Update components/TrailIcon.tsx to use Image component")

if __name__ == '__main__':
    extract_icons()
