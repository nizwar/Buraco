#!/bin/bash

# Icon generation script for Buraco PWA
# This script converts the SVG icon to various PNG sizes
# Requires ImageMagick or similar tool

echo "Generating PWA icons for Buraco..."

# Check if convert command exists (ImageMagick)
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Please install ImageMagick to generate icons."
    echo "On macOS: brew install imagemagick"
    echo "On Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Alternatively, you can manually convert icons/icon.svg to PNG files:"
    echo "- icon-72x72.png"
    echo "- icon-96x96.png" 
    echo "- icon-128x128.png"
    echo "- icon-144x144.png"
    echo "- icon-152x152.png"
    echo "- icon-192x192.png"
    echo "- icon-384x384.png"
    echo "- icon-512x512.png"
    exit 1
fi

# Generate icons
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    echo "Generating ${size}x${size} icon..."
    convert icons/icon.svg -resize ${size}x${size} icons/icon-${size}x${size}.png
done

echo "Icon generation complete!"
echo "All PWA icons have been generated in the icons/ directory."