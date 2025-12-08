#!/usr/bin/env python3
"""
Generate Instagram ad slides for ConveniencePro - Version 2
White background, black text, fade animations
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Slide dimensions (Instagram square format)
WIDTH = 1080
HEIGHT = 1080

# Colors - Updated to white background, black text
BACKGROUND = '#FFFFFF'  # Pure white
TEXT_COLOR = '#000000'  # Pure black

def create_blank_slide():
    """Create a blank white slide"""
    return Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)

def create_tool_slides():
    """Create individual slides for each tool (for fade-in animation)"""
    tools = [
        "vCard Generator",
        "PDF Merger",
        "Icon Generator"
    ]

    try:
        # Use bold font for 15% more weight
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 70, index=1)  # index 1 is bold
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 70)
        except:
            font = ImageFont.load_default()

    # Create individual tool images
    for i, tool in enumerate(tools):
        img = create_blank_slide()
        draw = ImageDraw.Draw(img)

        bbox = draw.textbbox((0, 0), tool, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Position for this tool
        start_y = 300
        spacing = 170
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)

        draw.text((x, y), tool, fill=TEXT_COLOR, font=font)
        img.save(f'channels/instagram/tool_{i+1}.png')

    print(f"✓ Created {len(tools)} individual tool slides")

def create_accumulated_tool_slides():
    """Create accumulated slides showing 1, then 1+2, then 1+2+3 tools"""
    tools = [
        "vCard Generator",
        "PDF Merger",
        "Icon Generator"
    ]

    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 70, index=1)
    except:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 70)
        except:
            font = ImageFont.load_default()

    start_y = 300
    spacing = 170

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

        img.save(f'channels/instagram/slide1_step{count}.png')

    print("✓ Created 3 accumulated tool slides")

def create_slide_2():
    """Slide 2: Value proposition - removed privacy text"""
    img = create_blank_slide()
    draw = ImageDraw.Draw(img)

    try:
        large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 100, index=1)
        medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 80, index=1)
    except:
        try:
            large_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 100)
            medium_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 80)
        except:
            large_font = ImageFont.load_default()
            medium_font = ImageFont.load_default()

    messages = [
        ("200+ powerful tools", large_font),
        ("100% free", medium_font),
    ]

    start_y = 380
    spacing = 160

    for i, (text, font) in enumerate(messages):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (WIDTH - text_width) // 2
        y = start_y + (i * spacing)
        draw.text((x, y), text, fill=TEXT_COLOR, font=font)

    img.save('channels/instagram/slide2.png')
    print("✓ Slide 2 created")

def create_slide_3_elements():
    """Slide 3: Create separate elements for ConveniencePro text and C logo"""

    # Create ConveniencePro text
    img_text = create_blank_slide()
    draw_text = ImageDraw.Draw(img_text)

    try:
        brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90, index=1)
    except:
        try:
            brand_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 90)
        except:
            brand_font = ImageFont.load_default()

    brand_text = "ConveniencePro"
    bbox = draw_text.textbbox((0, 0), brand_text, font=brand_font)
    brand_width = bbox[2] - bbox[0]
    brand_x = (WIDTH - brand_width) // 2
    brand_y = 480

    draw_text.text((brand_x, brand_y), brand_text, fill=TEXT_COLOR, font=brand_font)
    img_text.save('channels/instagram/slide3_text.png')

    # Create large C logo with extra tall height
    img_c = create_blank_slide()
    draw_c = ImageDraw.Draw(img_c)

    try:
        # Much larger C that will be behind the text
        c_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 280, index=1)
    except:
        try:
            c_font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 280)
        except:
            c_font = ImageFont.load_default()

    c_text = "C"
    bbox = draw_c.textbbox((0, 0), c_text, font=c_font)
    c_width = bbox[2] - bbox[0]
    c_height = bbox[3] - bbox[1]
    c_x = (WIDTH - c_width) // 2
    c_y = 250

    draw_c.text((c_x, c_y), c_text, fill=TEXT_COLOR, font=c_font)

    # Stretch vertically for "extra tall height"
    img_c_stretched = img_c.resize((WIDTH, int(HEIGHT * 1.15)), Image.Resampling.LANCZOS)
    # Crop back to original height
    img_c_stretched = img_c_stretched.crop((0, int(HEIGHT * 0.075), WIDTH, int(HEIGHT * 1.075)))
    img_c_stretched.save('channels/instagram/slide3_c.png')

    # Create combined version (C behind text)
    img_combined = create_blank_slide()
    # Paste C first (background)
    c_img = Image.open('channels/instagram/slide3_c.png')
    img_combined.paste(c_img, (0, 0))

    # Draw text on top
    draw_combined = ImageDraw.Draw(img_combined)
    draw_combined.text((brand_x, brand_y), brand_text, fill=TEXT_COLOR, font=brand_font)
    img_combined.save('channels/instagram/slide3_combined.png')

    print("✓ Slide 3 elements created")

if __name__ == '__main__':
    print("Generating Instagram ad slides (Version 2)...")
    create_accumulated_tool_slides()
    create_slide_2()
    create_slide_3_elements()
    print("\nAll slides created successfully!")
