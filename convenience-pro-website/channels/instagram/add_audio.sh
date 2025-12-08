#!/bin/bash
# Add music from "Still" to the Instagram ad
# Fade out audio at the end

cd "$(dirname "$0")"

AUDIO="assets/still.wav"
VIDEO="conveniencepro_ad.mp4"
OUTPUT="conveniencepro_ad_with_music.mp4"

# Get video duration
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO")

echo "Video duration: ${DURATION}s"
echo "Adding music from: $AUDIO"

# Calculate fade out start (last 1.5 seconds)
FADE_START=$(echo "$DURATION - 1.5" | bc)

echo "Audio fade out starts at: ${FADE_START}s"

# Add audio with fade out at the end
ffmpeg -i "$VIDEO" -i "$AUDIO" \
  -filter_complex "\
[1:a]atrim=0:${DURATION},\
afade=t=out:st=${FADE_START}:d=1.5[audio]" \
  -map 0:v -map "[audio]" \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  -y "$OUTPUT" 2>/dev/null

echo ""
echo "✓ Video with music created: $OUTPUT"
echo ""

# Show file info
ls -lh "$OUTPUT"
ffmpeg -i "$OUTPUT" 2>&1 | grep -A 3 "Duration"

echo ""
echo "Features:"
echo "  → Music: Still (Trap) - beginning section"
echo "  → Audio fade out: Last 1.5 seconds"
echo "  → Video unchanged (visuals only)"
echo ""
