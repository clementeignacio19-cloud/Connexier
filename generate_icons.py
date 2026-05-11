#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs('icons', exist_ok=True)

for size in [192, 512]:
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background rounded rect
    r = size // 5
    bg = (8, 12, 20, 255)
    draw.rounded_rectangle([0, 0, size, size], radius=r, fill=bg)

    # Accent circle glow
    cx, cy = size // 2, size // 2
    glow_r = int(size * 0.35)
    for i in range(8, 0, -1):
        alpha = int(30 * (i / 8))
        draw.ellipse(
            [cx - glow_r - i*2, cy - glow_r - i*2,
             cx + glow_r + i*2, cy + glow_r + i*2],
            fill=(10, 132, 255, alpha)
        )

    # "C" letter as brand mark
    font_size = int(size * 0.45)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    text = "Cx"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1]

    draw.text((x, y), text, fill=(10, 132, 255, 255), font=font)

    img.save(f'icons/icon-{size}.png', 'PNG')
    print(f"Generated icons/icon-{size}.png")

print("Icons generated!")
