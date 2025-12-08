#!/bin/bash
# Create ConveniencePro Instagram ad - V6
# - Text fades in/out over 0.1 seconds
# - 0.25s blank pauses between shots
# - Final slide extended by 2.5s
# - Blue C at 25% transparency
# - iPhone 15 Pro Max aspect ratio (1080x2340)

cd "$(dirname "$0")"

echo "Creating color background frames..."
ffmpeg -f lavfi -i color=c=#FFF8F5:s=1080x2340:d=1 -frames:v 1 -y blank_warm.png 2>/dev/null
ffmpeg -f lavfi -i color=c=#F5F8FF:s=1080x2340:d=1 -frames:v 1 -y blank_blue.png 2>/dev/null
ffmpeg -f lavfi -i color=c=#F8F5FF:s=1080x2340:d=1 -frames:v 1 -y blank_purple.png 2>/dev/null

echo "Creating Slide 1 animation (tools fade in, then fade out)..."
# Slide 1: Tools fade in with stagger, hold, then fade out to blank
# Total: ~2.5s tools showing, 0.1s fade out
ffmpeg -loop 1 -t 0.5 -i blank_warm.png \
       -loop 1 -t 1.0 -i slide1_step1.png \
       -loop 1 -t 1.0 -i slide1_step2.png \
       -loop 1 -t 1.6 -i slide1_step3.png \
       -loop 1 -t 0.1 -i blank_warm.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=0.5:offset=0.5[f2]; \
[f2][3:v]xfade=transition=fade:duration=0.5:offset=1.0[f3]; \
[f3][4:v]xfade=transition=fade:duration=0.1:offset=3.1[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide1_animated.mp4 2>/dev/null

echo "✓ Slide 1 animation created"

# 0.25s blank warm pause
ffmpeg -loop 1 -i blank_warm.png -t 0.25 -pix_fmt yuv420p -c:v libx264 -r 30 -y pause1.mp4 2>/dev/null

# Color transition warm → blue
ffmpeg -loop 1 -t 0.5 -i blank_warm.png \
       -loop 1 -t 0.5 -i blank_blue.png \
       -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y trans1_2_color.mp4 2>/dev/null

# 0.25s blank blue pause
ffmpeg -loop 1 -i blank_blue.png -t 0.25 -pix_fmt yuv420p -c:v libx264 -r 30 -y pause2.mp4 2>/dev/null

echo "Creating Slide 2 (fade in 0.1s, 'free' grows 2% over 2.3s, fade out 0.1s)..."
# Slide 2: Fade in, smooth growth of 'free', fade out
# Total: 0.1s fade in, 2.3s hold with growth, 0.1s fade out = 2.5s total
ffmpeg -loop 1 -t 0.1 -i blank_blue.png \
       -loop 1 -t 2.3 -i slide2_start.png \
       -loop 1 -t 2.3 -i slide2_end.png \
       -loop 1 -t 0.1 -i blank_blue.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.1:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=2.3:offset=0.1[f2]; \
[f2][3:v]xfade=transition=fade:duration=0.1:offset=2.4[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide2_animated.mp4 2>/dev/null

echo "✓ Slide 2 animation created (with 'free' growth)"

# 0.25s blank blue pause
ffmpeg -loop 1 -i blank_blue.png -t 0.25 -pix_fmt yuv420p -c:v libx264 -r 30 -y pause3.mp4 2>/dev/null

# Color transition blue → purple
ffmpeg -loop 1 -t 0.5 -i blank_blue.png \
       -loop 1 -t 0.5 -i blank_purple.png \
       -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=0[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y trans2_3_color.mp4 2>/dev/null

# 0.25s blank purple pause
ffmpeg -loop 1 -i blank_purple.png -t 0.25 -pix_fmt yuv420p -c:v libx264 -r 30 -y pause4.mp4 2>/dev/null

echo "Creating Slide 3 (text fade in 0.1s, blue C fades in, hold 2.5s extra)..."
# Slide 3: Fade in text quickly, then fade in blue C behind, hold for 2.5s+ total
# Text fades in: 0.1s
# C fades in behind: 1.0s
# Hold with both: 2.5s
ffmpeg -loop 1 -t 0.1 -i blank_purple.png \
       -loop 1 -t 1.0 -i slide3_text.png \
       -loop 1 -t 2.5 -i slide3_combined.png \
       -filter_complex "\
[0:v][1:v]xfade=transition=fade:duration=0.1:offset=0[f1]; \
[f1][2:v]xfade=transition=fade:duration=1.0:offset=0.1[out]" \
       -map "[out]" -pix_fmt yuv420p -c:v libx264 -r 30 -y slide3_animated.mp4 2>/dev/null

echo "✓ Slide 3 animation created (extended 2.5s)"

echo "Combining all segments..."
cat > concat_final.txt << EOF
file 'slide1_animated.mp4'
file 'pause1.mp4'
file 'trans1_2_color.mp4'
file 'pause2.mp4'
file 'slide2_animated.mp4'
file 'pause3.mp4'
file 'trans2_3_color.mp4'
file 'pause4.mp4'
file 'slide3_animated.mp4'
EOF

ffmpeg -f concat -safe 0 -i concat_final.txt -c copy -y conveniencepro_ad.mp4 2>/dev/null

echo ""
echo "✓ Final video created: conveniencepro_ad.mp4"
echo ""

ffmpeg -i conveniencepro_ad.mp4 2>&1 | grep -A 2 "Duration" | head -3

echo ""
echo "Video Features:"
echo "  → Aspect ratio: 19.5:9 (1080x2340)"
echo "  → Device: iPhone 15 Pro Max optimized"
echo "  → Text fades: 0.1 seconds"
echo "  → Blank pauses: 0.25 seconds between shots"
echo "  → Blue C logo at 25% transparency"
echo "  → Final slide extended by 2.5 seconds"
echo "  → Color psychology: Warm → Blue → Purple"
echo ""
