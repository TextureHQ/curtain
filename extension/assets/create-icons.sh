#!/bin/bash
# Create simple placeholder icons using ImageMagick if available, otherwise create placeholders

# Brand primary color: #444ae1

if command -v convert &> /dev/null; then
  convert -size 16x16 xc:'#444ae1' icon-16.png
  convert -size 32x32 xc:'#444ae1' icon-32.png
  convert -size 48x48 xc:'#444ae1' icon-48.png
  convert -size 128x128 xc:'#444ae1' icon-128.png
  echo "Icons created with ImageMagick"
else
  echo "ImageMagick not found. PNG icons already exist in repository."
  echo "To regenerate icons, install ImageMagick: brew install imagemagick"
fi
