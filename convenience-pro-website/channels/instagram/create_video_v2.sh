#!/bin/bash
# Create animated ConveniencePro Instagram ad with fade-in effects
# Updated timing: 3 seconds per slide = 9 seconds total

cd "$(dirname "$0")"

# Create blank white slide for initial fade-in
ffmpeg -f lavfi -i color=c=white:s=1080x1080:d=1 -frames:v 1 -y blank.png

echo "Creating Slide 1 animation (tools fade in with 0.5s stagger)..."

# Slide 1: Fade in tools one at a time - 3 seconds total
# - 0.0-0.5s: Fade in tool 1
# - 0.5-1.0s: Fade in tool 2
# - 1.0-1.5s: Fade in tool 3
# - 1.5-3.0s: Hold on all three (extended from before)
ffmpeg -loop 1 -t 0.5 -i blank.png \
       -loop 1 -t 1.0 -i slide1_step1.png \
       -loop 1 -t 1.0 -i slide1_step2.png \
       -loop 1 -t 1.5 -i slide1_step3.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=0.5:offset=0.5[f2]; \
[f2][3:v]xfade=transition=fade:duration=0.5:offset=1.0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide1_animated.mp4

echo "Slide 1 animation created (3 seconds)"

echo "Creating Slide 2 (static, 3 seconds)..."
# Slide 2: Static for 3 seconds
ffmpeg -loop 1 -i slide2.png -t 3 -pix_fmt yuv420p -c:v libx264 -r 30 -y slide2_video.mp4

echo "Creating Slide 3 animation (ConveniencePro fades in, then C behind)..."
# Slide 3: ConveniencePro fades in first, then C fades in behind - 3 seconds total
# - 0.0-1.0s: Fade in ConveniencePro text
# - 1.0-2.0s: Fade in C behind
# - 2.0-3.0s: Hold
ffmpeg -loop 1 -t 1.0 -i blank.png \
       -loop 1 -t 1.0 -i slide3_text.png \
       -loop 1 -t 1.0 -i slide3_combined.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=1.0:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=1.0:offset=1.0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide3_animated.mp4

echo "Slide 3 animation created (3 seconds)"

echo "Combining all slides into final video..."
# Create concat file
cat > concat_animated.txt << EOF
file 'slide1_animated.mp4'
file 'slide2_video.mp4'
file 'slide3_animated.mp4'
EOF

# Combine all three slides
ffmpeg -f concat -safe 0 -i concat_animated.txt -c copy -y conveniencepro_ad.mp4

echo ""
echo "✓ Final video created: conveniencepro_ad.mp4"
echo ""

# Show video info
ffmpeg -i conveniencepro_ad.mp4 2>&1 | grep -A 2 "Duration"

echo ""
echo "Video successfully created!"
