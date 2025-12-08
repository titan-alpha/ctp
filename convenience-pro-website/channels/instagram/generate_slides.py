#!/usr/bin/env python3
"""
Generate Instagram ad slides for ConveniencePro
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Slide dimensions (Instagram square format)
WIDTH = 1080
HEIGHT = 1080

# Colors
BACKGROUND = '#1a1a2e'  # Dark blue/navy
TEXT_COLOR = '#ffffff'  # White
ACCENT_COLOR = '#00d4ff'  # Bright cyan

def create_slide_1():
    """Slide 1: Tool examples"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(img)

    # Try to use system fonts, fallback to default
    try:
        title_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 80)
        subtitle_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 60)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Tool examples
    tools = [
        "vCard Generator",
        "PDF Merger",
        "Icon Generator"
    ]

    # Calculate vertical spacing
    start_y = HEIGHT // 3
    spacing = 150

    for i, tool in enumerate(tools):
        text = tool
        bbox = draw.textbbox((0, 0), text, font=subtitle_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)

        # Draw text with slight shadow effect
        draw.text((x+3, y+3), text, fill='#000000', font=subtitle_font)
        draw.text((x, y), text, fill=ACCENT_COLOR, font=subtitle_font)

    img.save('channels/instagram/slide1.png')
    print("✓ Slide 1 created")

def create_slide_2():
    """Slide 2: Value proposition"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(img)

    try:
        large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90)
        medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 70)
        small_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 50)
    except:
        large_font = ImageFont.load_default()
        medium_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Main message
    messages = [
        ("200+ powerful tools", large_font, ACCENT_COLOR),
        ("100% free", medium_font, TEXT_COLOR),
        ("Your files never", small_font, TEXT_COLOR),
        ("leave your computer", small_font, TEXT_COLOR)
    ]

    start_y = 250
    spacing = 140

    for i, (text, font, color) in enumerate(messages):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)

        # Shadow
        draw.text((x+2, y+2), text, fill='#000000', font=font)
        draw.text((x, y), text, fill=color, font=font)

    img.save('channels/instagram/slide2.png')
    print("✓ Slide 2 created")

def create_slide_3():
    """Slide 3: Brand with logo"""
    img = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(img)

    try:
        logo_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 200)
        brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 80)
    except:
        logo_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    # Large C logo
    c_text = "C"
    bbox = draw.textbbox((0, 0), c_text, font=logo_font)
    c_width = bbox[2] - bbox[0]
    c_x = (WIDTH - c_width) // 2
    c_y = 250

    # Draw C with gradient effect (simulate with multiple colors)
    draw.text((c_x+4, c_y+4), c_text, fill='#000000', font=logo_font)
    draw.text((c_x, c_y), c_text, fill=ACCENT_COLOR, font=logo_font)

    # Brand name
    brand_text = "ConveniencePro"
    bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_width = bbox[2] - bbox[0]
    brand_x = (WIDTH - brand_width) // 2
    brand_y = c_y + 280

    draw.text((brand_x+2, brand_y+2), brand_text, fill='#000000', font=brand_font)
    draw.text((brand_x, brand_y), brand_text, fill=TEXT_COLOR, font=brand_font)

    img.save('channels/instagram/slide3.png')
    print("✓ Slide 3 created")

if __name__ == '__main__':
    print("Generating Instagram ad slides...")
    create_slide_1()
    create_slide_2()
    create_slide_3()
    print("\nAll slides created successfully!")
