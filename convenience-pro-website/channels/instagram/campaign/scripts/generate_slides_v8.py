#!/usr/bin/env python3
"""
Generate Instagram ad slides for ConveniencePro - Version 8
Updated for iPhone 15 Pro Max aspect ratio: 19.5:9 (1080x2340)
"""

from PIL import Image, ImageDraw, ImageFont
import os

# iPhone 15 Pro Max dimensions (19.5:9 aspect ratio)
WIDTH = 1080
HEIGHT = 2340  # Updated from 1920 to match iPhone 15 Pro Max

# Extremely subtle color backgrounds (color psychology)
COLOR_ATTENTION = '#FFF8F5'   # Very light warm peach - attention-catching
COLOR_HONESTY = '#F5F8FF'     # Very light cool blue - honesty/trust
COLOR_INTRIGUE = '#F8F5FF'    # Very light purple - intrigue/mystery

TEXT_COLOR = '#000000'  # Pure black
C_COLOR = '#0066FF'     # Blue for the C logo

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
    """Create accumulated slides with tools spread top/center/bottom - adjusted for taller screen"""
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

    # Positions adjusted for taller screen: near top, center, near bottom
    positions = [
        400,    # Near top (more space at top)
        1170,   # Center (HEIGHT // 2)
        1940    # Near bottom (more space at bottom)
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

    print(f"✓ Created 3 tool slides (iPhone 15 Pro Max: {WIDTH}x{HEIGHT})")

def create_slide_2():
    """Slide 2: Value proposition - cool blue background for honesty/trust
    Creates two versions: start (normal) and end (with 'Free' grown by 2%)
    All text uses Helvetica Regular (non-slanted)
    """
    # Load fonts - Regular (non-slanted) for all text
    try:
        large_font_regular = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 106, index=0)   # Regular
        medium_font_regular = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 108, index=0)  # Regular
        # 2% larger for animation
        medium_font_regular_grow = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 110, index=0)  # 108 * 1.02 ≈ 110
    except:
        try:
            large_font_regular = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 106)
            medium_font_regular = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 108)
            medium_font_regular_grow = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 110)
        except:
            large_font_regular = ImageFont.load_default()
            medium_font_regular = ImageFont.load_default()
            medium_font_regular_grow = ImageFont.load_default()

    # Adjusted spacing: 220 * 1.5 = 330
    start_y = (HEIGHT // 2) - 200
    spacing = 330

    # Create START version (normal size)
    img_start = create_blank_slide(COLOR_HONESTY)
    draw_start = ImageDraw.Draw(img_start)

    # Line 1: "200+ Powerful Tools" - all regular (non-slanted)
    y1 = start_y
    # Draw "200" in regular
    bbox_200 = draw_start.textbbox((0, 0), "200", font=large_font_regular)
    width_200 = bbox_200[2] - bbox_200[0]
    # Draw "+ Powerful Tools" in regular (non-slanted)
    bbox_rest1 = draw_start.textbbox((0, 0), "+ Powerful Tools", font=large_font_regular)
    width_rest1 = bbox_rest1[2] - bbox_rest1[0]
    # Calculate total width and center
    total_width1 = width_200 + width_rest1
    x1_start = (WIDTH - total_width1) // 2
    draw_start.text((x1_start, y1), "200", fill=TEXT_COLOR, font=large_font_regular)
    draw_start.text((x1_start + width_200, y1), "+ Powerful Tools", fill=TEXT_COLOR, font=large_font_regular)

    # Line 2: "100% Free" - all regular (non-slanted)
    y2 = start_y + spacing
    # Draw "100% " in regular (non-slanted)
    bbox_100 = draw_start.textbbox((0, 0), "100% ", font=medium_font_regular)
    width_100 = bbox_100[2] - bbox_100[0]
    # Draw "Free" in regular
    bbox_free = draw_start.textbbox((0, 0), "Free", font=medium_font_regular)
    width_free = bbox_free[2] - bbox_free[0]
    # Calculate total width and center
    total_width2 = width_100 + width_free
    x2_start = (WIDTH - total_width2) // 2
    draw_start.text((x2_start, y2), "100% ", fill=TEXT_COLOR, font=medium_font_regular)
    draw_start.text((x2_start + width_100, y2), "Free", fill=TEXT_COLOR, font=medium_font_regular)

    img_start.save('slide2_start.png')

    # Create END version (with "Free" 2% larger)
    img_end = create_blank_slide(COLOR_HONESTY)
    draw_end = ImageDraw.Draw(img_end)

    # Line 1: Same as start (all regular)
    draw_end.text((x1_start, y1), "200", fill=TEXT_COLOR, font=large_font_regular)
    draw_end.text((x1_start + width_200, y1), "+ Powerful Tools", fill=TEXT_COLOR, font=large_font_regular)

    # Line 2: "100% Free" with "Free" 2% larger (all regular)
    bbox_100_end = draw_end.textbbox((0, 0), "100% ", font=medium_font_regular)
    width_100_end = bbox_100_end[2] - bbox_100_end[0]
    bbox_free_grow = draw_end.textbbox((0, 0), "Free", font=medium_font_regular_grow)
    width_free_grow = bbox_free_grow[2] - bbox_free_grow[0]
    total_width2_end = width_100_end + width_free_grow
    x2_end = (WIDTH - total_width2_end) // 2
    draw_end.text((x2_end, y2), "100% ", fill=TEXT_COLOR, font=medium_font_regular)
    draw_end.text((x2_end + width_100_end, y2), "Free", fill=TEXT_COLOR, font=medium_font_regular_grow)

    img_end.save('slide2_end.png')

    # Also create a static version for backward compatibility
    img_start.save('slide2.png')

    print("✓ Slide 2 created (regular font, 1.5x spacing, 2% growth animation)")

def create_slide_3_elements():
    """Slide 3: ConveniencePro.cc centered on BLUE C - purple background for intrigue"""

    # Create BLUE C logo (with alpha channel for transparency)
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

    # Draw BLUE C with 25% transparency (alpha = 64 out of 255)
    c_rgb = hex_to_rgb(C_COLOR)  # Blue color
    draw_c.text((c_x, c_y), c_text, fill=c_rgb + (64,), font=c_font)

    # Stretch vertically (adjusted for taller screen)
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

    # Create combined version: BLUE C BEHIND text
    bg_rgb = hex_to_rgb(COLOR_INTRIGUE)
    img_combined = Image.new('RGBA', (WIDTH, HEIGHT), bg_rgb + (255,))

    # Paste blue C first (background layer)
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

    print("✓ Slide 3 created (BLUE C, taller screen)")

if __name__ == '__main__':
    print("Generating Instagram ad slides (Version 8 - iPhone 15 Pro Max)...")
    print(f"- Aspect Ratio: 19.5:9 ({WIDTH}x{HEIGHT})")
    print(f"- Device: iPhone 15 Pro Max optimized")
    create_accumulated_tool_slides()
    create_slide_2()
    create_slide_3_elements()
    print("\nAll slides created for iPhone 15 Pro Max!")
