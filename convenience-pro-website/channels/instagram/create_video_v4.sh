#!/bin/bash
# Create animated ConveniencePro Instagram ad - Color Psychology Version
# Subtle color transitions play on the subconscious:
# - Warm peach (attention) → Cool blue (honesty) → Purple (intrigue)

cd "$(dirname "$0")"

# Create blank slides in each color for smooth transitions
echo "Creating color transition frames..."
ffmpeg -f lavfi -i color=c=#FFF8F5:s=1080x1920:d=1 -frames:v 1 -y blank_warm.png 2>/dev/null
ffmpeg -f lavfi -i color=c=#F5F8FF:s=1080x1920:d=1 -frames:v 1 -y blank_blue.png 2>/dev/null
ffmpeg -f lavfi -i color=c=#F8F5FF:s=1080x1920:d=1 -frames:v 1 -y blank_purple.png 2>/dev/null

echo "Creating Slide 1 animation (warm background - attention)..."

# Slide 1: Fade in tools one at a time on warm background
# The warm peach background subconsciously catches attention
ffmpeg -loop 1 -t 0.5 -i blank_warm.png \
       -loop 1 -t 1.0 -i slide1_step1.png \
       -loop 1 -t 1.0 -i slide1_step2.png \
       -loop 1 -t 1.5 -i slide1_step3.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=0.5:offset=0.5[f2]; \
[f2][3:v]xfade=transition=fade:duration=0.5:offset=1.0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide1_animated.mp4 2>/dev/null

echo "✓ Slide 1 animation created (warm peach - attention)"

echo "Creating transition from warm to cool blue..."
# Create a smooth color transition between slide 1 and slide 2
# This gradually shifts from warm (attention) to cool (trust)
ffmpeg -loop 1 -t 0.5 -i slide1_step3.png \
       -loop 1 -t 0.5 -i slide2.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y transition1_2.mp4 2>/dev/null

echo "Creating Slide 2 (cool blue - honesty/trust)..."
# Slide 2: Cool blue background communicates honesty and trust
ffmpeg -loop 1 -i slide2.png -t 2.5 -pix_fmt yuv420p -c:v libx264 -r 30 -y slide2_video.mp4 2>/dev/null

echo "✓ Slide 2 created (cool blue - honesty/trust)"

echo "Creating transition from cool blue to purple..."
# Smooth transition from blue (trust) to purple (intrigue)
ffmpeg -loop 1 -t 0.5 -i slide2.png \
       -loop 1 -t 0.5 -i slide3_text.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y transition2_3.mp4 2>/dev/null

echo "Creating Slide 3 animation (purple - intrigue)..."
# Slide 3: Purple background draws in with intrigue and mystery
# ConveniencePro.cc fades in, then C fades in behind
ffmpeg -loop 1 -t 0.5 -i blank_purple.png \
       -loop 1 -t 1.0 -i slide3_text.png \
       -loop 1 -t 1.0 -i slide3_combined.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=1.0:offset=0.5[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide3_animated.mp4 2>/dev/null

echo "✓ Slide 3 animation created (purple - intrigue)"

echo "Combining all slides with smooth color transitions..."
# Create concat file
cat > concat_color.txt << EOF
file 'slide1_animated.mp4'
file 'transition1_2.mp4'
file 'slide2_video.mp4'
file 'transition2_3.mp4'
file 'slide3_animated.mp4'
EOF

# Combine all slides with color transitions
ffmpeg -f concat -safe 0 -i concat_color.txt -c copy -y conveniencepro_ad.mp4 2>/dev/null

echo ""
echo "✓ Final video created: conveniencepro_ad.mp4"
echo ""

# Show video info
ffmpeg -i conveniencepro_ad.mp4 2>&1 | grep -A 2 "Duration" | head -3

echo ""
echo "Color Psychology Applied:"
echo "  → Warm peach: Catches attention subconsciously"
echo "  → Cool blue: Communicates honesty and trust"
echo "  → Purple: Draws viewer in with intrigue"
echo ""
echo "Video successfully created with subtle color transitions!"
