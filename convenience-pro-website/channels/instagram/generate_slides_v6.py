#!/usr/bin/env python3
"""
Generate Instagram ad slides for ConveniencePro - Version 6
Color psychology:
- Slide 1: Subtle warm (peach/coral) - catches attention
- Slide 2: Subtle cool blue - communicates honesty/trust
- Slide 3: Subtle purple/violet - draws in with intrigue
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Mobile portrait dimensions (9:16)
WIDTH = 1080
HEIGHT = 1920

# Extremely subtle color backgrounds (color psychology)
# Each is just a few percent away from pure white
COLOR_ATTENTION = '#FFF8F5'   # Very light warm peach - attention-catching
COLOR_HONESTY = '#F5F8FF'     # Very light cool blue - honesty/trust
COLOR_INTRIGUE = '#F8F5FF'    # Very light purple - intrigue/mystery

TEXT_COLOR = '#000000'  # Pure black

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_blank_slide(bg_color):
    """Create a blank slide with specified background color"""
    return Image.new('RGB', (WIDTH, HEIGHT), hex_to_rgb(bg_color))

def create_blank_slide_alpha(bg_color):
    """Create a blank slide with alpha channel"""
    rgb = hex_to_rgb(bg_color)
    return Image.new('RGBA', (WIDTH, HEIGHT), rgb + (255,))

def create_accumulated_tool_slides():
    """Create accumulated slides with tools spread top/center/bottom - warm attention-catching background"""
    tools = [
        "vCard Generator",
        "PDF Merger",
        "Icon Generator"
    ]

    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90, index=2)  # Light
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90)
        except:
            font = ImageFont.load_default()

    # Positions: near top, center, near bottom
    positions = [
        300,   # Near top
        960,   # Center
        1620   # Near bottom
    ]

    # Create 3 versions: showing 1 tool, 2 tools, 3 tools
    for count in range(1, 4):
        img = create_blank_slide(COLOR_ATTENTION)  # Warm peach background
        draw = ImageDraw.Draw(img)

        for i in range(count):
            tool = tools[i]
            bbox = draw.textbbox((0, 0), tool, font=font)
            text_width = bbox[2] - bbox[0]
            x = (WIDTH - text_width) // 2
            y = positions[i]
            draw.text((x, y), tool, fill=TEXT_COLOR, font=font)

        img.save(f'slide1_step{count}.png')

    print("✓ Created 3 tool slides (subtle warm background - attention)")

def create_slide_2():
    """Slide 2: Value proposition - cool blue background for honesty/trust"""
    img = create_blank_slide(COLOR_HONESTY)  # Cool blue background
    draw = ImageDraw.Draw(img)

    try:
        large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 106, index=2)  # Light
        medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 108, index=2)
    except:
        try:
            large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 106)
            medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 108)
        except:
            large_font = ImageFont.load_default()
            medium_font = ImageFont.load_default()

    messages = [
        ("200+ powerful tools", large_font),
        ("100% free", medium_font),
    ]

    start_y = (HEIGHT // 2) - 150
    spacing = 220

    for i, (text, font) in enumerate(messages):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)
        draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    img.save('slide2.png')
    print("✓ Slide 2 created (subtle blue background - honesty/trust)")

def create_slide_3_elements():
    """Slide 3: ConveniencePro.cc centered on C - purple background for intrigue"""

    # Create C logo first (with alpha channel for transparency)
    img_c = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))  # Fully transparent
    draw_c = ImageDraw.Draw(img_c)

    try:
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
    c_y = (HEIGHT // 2) - (c_height // 2)

    # Draw C with 25% transparency (alpha = 64 out of 255)
    draw_c.text((c_x, c_y), c_text, fill=(0, 0, 0, 64), font=c_font)

    # Stretch vertically
    img_c_stretched = img_c.resize((WIDTH, int(HEIGHT * 1.15)), Image.Resampling.LANCZOS)
    img_c_stretched = img_c_stretched.crop((0, int(HEIGHT * 0.075), WIDTH, int(HEIGHT * 1.075)))

    # Convert to RGB with purple background
    img_c_rgb = create_blank_slide(COLOR_INTRIGUE)  # Purple background
    img_c_rgb.paste(img_c_stretched, (0, 0), img_c_stretched)
    img_c_rgb.save('slide3_c.png')

    # Create ConveniencePro.cc text on purple background
    img_text = create_blank_slide(COLOR_INTRIGUE)  # Purple background
    draw_text = ImageDraw.Draw(img_text)

    try:
        brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 114, index=2)  # Light
    except:
        try:
            brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 114)
        except:
            brand_font = ImageFont.load_default()

    brand_text = "ConveniencePro.cc"
    bbox = draw_text.textbbox((0, 0), brand_text, font=brand_font)
    brand_width = bbox[2] - bbox[0]
    brand_height = bbox[3] - bbox[1]
    brand_x = (WIDTH - brand_width) // 2
    brand_y = (HEIGHT // 2) - (brand_height // 2)

    draw_text.text((brand_x, brand_y), brand_text, fill=TEXT_COLOR, font=brand_font)
    img_text.save('slide3_text.png')

    # Create combined version: C BEHIND text
    # Start with purple background
    bg_rgb = hex_to_rgb(COLOR_INTRIGUE)
    img_combined = Image.new('RGBA', (WIDTH, HEIGHT), bg_rgb + (255,))

    # Paste C first (background layer)
    img_combined.paste(img_c_stretched, (0, 0), img_c_stretched)

    # Create text layer
    img_text_alpha = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw_combined = ImageDraw.Draw(img_text_alpha)
    draw_combined.text((brand_x, brand_y), brand_text, fill=(0, 0, 0, 255), font=brand_font)

    # Paste text on top of C
    img_combined.paste(img_text_alpha, (0, 0), img_text_alpha)

    # Convert to RGB
    img_combined_rgb = create_blank_slide(COLOR_INTRIGUE)
    img_combined_rgb.paste(img_combined, (0, 0), img_combined)
    img_combined_rgb.save('slide3_combined.png')

    print("✓ Slide 3 created (subtle purple background - intrigue)")

if __name__ == '__main__':
    print("Generating Instagram ad slides (Version 6 - Color Psychology)...")
    print(f"- Slide 1: {COLOR_ATTENTION} (warm - attention)")
    print(f"- Slide 2: {COLOR_HONESTY} (blue - honesty/trust)")
    print(f"- Slide 3: {COLOR_INTRIGUE} (purple - intrigue)")
    create_accumulated_tool_slides()
    create_slide_2()
    create_slide_3_elements()
    print("\nAll slides created with subtle color psychology!")
