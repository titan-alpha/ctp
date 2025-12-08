#!/usr/bin/env python3
"""
Generate Instagram ad slides for ConveniencePro - Version 3
Mobile portrait 9:16 (1080x1920), sleeker font, transparent C behind text
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Mobile portrait dimensions (9:16)
WIDTH = 1080
HEIGHT = 1920

# Colors
BACKGROUND = '#FFFFFF'  # Pure white
TEXT_COLOR = '#000000'  # Pure black

def create_blank_slide():
    """Create a blank white slide"""
    return Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)

def create_blank_slide_alpha():
    """Create a blank slide with alpha channel"""
    return Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 255))

def create_accumulated_tool_slides():
    """Create accumulated slides showing 1, then 1+2, then 1+2+3 tools"""
    tools = [
        "vCard Generator",
        "PDF Merger",
        "Icon Generator"
    ]

    try:
        # Use Helvetica Light for sleeker look (less weight than regular)
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 75, index=2)  # index 2 is light
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 75)
        except:
            font = ImageFont.load_default()

    # Center vertically in the portrait layout
    start_y = (HEIGHT // 2) - 150
    spacing = 180

    # Create 3 versions: showing 1 tool, 2 tools, 3 tools
    for count in range(1, 4):
        img = create_blank_slide()
        draw = ImageDraw.Draw(img)

        for i in range(count):
            tool = tools[i]
            bbox = draw.textbbox((0, 0), tool, font=font)
            text_width = bbox[2] - bbox[0]
            x = (WIDTH - text_width) // 2
            y = start_y + (i * spacing)
            draw.text((x, y), tool, fill=TEXT_COLOR, font=font)

        img.save(f'slide1_step{count}.png')

    print("✓ Created 3 accumulated tool slides (portrait)")

def create_slide_2():
    """Slide 2: Value proposition - sleeker font"""
    img = create_blank_slide()
    draw = ImageDraw.Draw(img)

    try:
        large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 110, index=2)  # Light
        medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90, index=2)
    except:
        try:
            large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 110)
            medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90)
        except:
            large_font = ImageFont.load_default()
            medium_font = ImageFont.load_default()

    messages = [
        ("200+ powerful tools", large_font),
        ("100% free", medium_font),
    ]

    # Center vertically
    start_y = (HEIGHT // 2) - 100
    spacing = 180

    for i, (text, font) in enumerate(messages):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)
        draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    img.save('slide2.png')
    print("✓ Slide 2 created (portrait)")

def create_slide_3_elements():
    """Slide 3: Create C behind ConveniencePro text with 50% transparency"""

    # Create C logo first (with alpha channel for transparency)
    img_c = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))  # Transparent background
    draw_c = ImageDraw.Draw(img_c)

    try:
        # Large C logo
        c_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 350, index=2)  # Light
    except:
        try:
            c_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 350)
        except:
            c_font = ImageFont.load_default()

    c_text = "C"
    bbox = draw_c.textbbox((0, 0), c_text, font=c_font)
    c_width = bbox[2] - bbox[0]
    c_height = bbox[3] - bbox[1]
    c_x = (WIDTH - c_width) // 2
    c_y = (HEIGHT // 2) - (c_height // 2) - 50

    # Draw C with 50% transparency (alpha = 128 out of 255)
    draw_c.text((c_x, c_y), c_text, fill=(0, 0, 0, 128), font=c_font)

    # Stretch vertically for extra tall height
    img_c_stretched = img_c.resize((WIDTH, int(HEIGHT * 1.15)), Image.Resampling.LANCZOS)
    # Crop back to original height
    img_c_stretched = img_c_stretched.crop((0, int(HEIGHT * 0.075), WIDTH, int(HEIGHT * 1.075)))

    # Convert to RGB for saving (composite on white background)
    img_c_rgb = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    img_c_rgb.paste(img_c_stretched, (0, 0), img_c_stretched)
    img_c_rgb.save('slide3_c.png')

    # Create ConveniencePro text only (on white background)
    img_text = create_blank_slide()
    draw_text = ImageDraw.Draw(img_text)

    try:
        brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 95, index=2)  # Light
    except:
        try:
            brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 95)
        except:
            brand_font = ImageFont.load_default()

    brand_text = "ConveniencePro"
    bbox = draw_text.textbbox((0, 0), brand_text, font=brand_font)
    brand_width = bbox[2] - bbox[0]
    brand_x = (WIDTH - brand_width) // 2
    brand_y = (HEIGHT // 2) - 20

    draw_text.text((brand_x, brand_y), brand_text, fill=TEXT_COLOR, font=brand_font)
    img_text.save('slide3_text.png')

    # Create combined version: C BEHIND text (layer C first, then text on top)
    # Start with C as the background layer
    img_combined = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 255))

    # Paste C first (it's the background layer)
    img_combined.paste(img_c_stretched, (0, 0), img_c_stretched)

    # Create text layer with transparency
    img_text_alpha = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
    draw_combined = ImageDraw.Draw(img_text_alpha)
    draw_combined.text((brand_x, brand_y), brand_text, fill=(0, 0, 0, 255), font=brand_font)

    # Paste text on top of C
    img_combined.paste(img_text_alpha, (0, 0), img_text_alpha)

    # Convert to RGB
    img_combined_rgb = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    img_combined_rgb.paste(img_combined, (0, 0), img_combined)
    img_combined_rgb.save('slide3_combined.png')

    print("✓ Slide 3 elements created (C at 50% opacity behind text)")

if __name__ == '__main__':
    print("Generating Instagram ad slides (Version 3 - Mobile Portrait 9:16)...")
    create_accumulated_tool_slides()
    create_slide_2()
    create_slide_3_elements()
    print("\nAll slides created successfully!")
