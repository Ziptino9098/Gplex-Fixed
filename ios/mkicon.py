"""The Gplex+ app's icon and launch images: a red square with a white g+, in Google+'s 2015 manner, and
white launch screens with the same mark. python3 mkicon.py <out dir>"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

RED = (221, 75, 57)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def mark(size, bg, fg, scale=0.62):
    im = Image.new("RGB", (size, size), bg)
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FONT, int(size * scale))
    text = "g+"
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=f)
    w, h = x1 - x0, y1 - y0
    d.text(((size - w) / 2 - x0, (size - h) / 2 - y0 - size * 0.03), text, font=f, fill=fg)
    return im


def main():
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    # icons: name -> pixel size
    icons = {
        "Icon-57.png": 57, "Icon-57@2x.png": 114, "Icon-60@2x.png": 120, "Icon-60@3x.png": 180,
        "Icon-72.png": 72, "Icon-72@2x.png": 144, "Icon-76.png": 76, "Icon-76@2x.png": 152,
        "AppIcon60x60@2x.png": 120, "AppIcon60x60@3x.png": 180, "AppIcon76x76.png": 76, "AppIcon76x76@2x.png": 152,
        "AppIcon83.5x83.5@2x.png": 167, "CydiaIcon.png": 60, "icon-1024.png": 1024
    }
    for name, size in icons.items():
        mark(size, RED, (255, 255, 255)).save(os.path.join(out, name))
    # launch images: white, the mark small in the middle
    shots = {"Default.png": (320, 480), "Default@2x.png": (640, 960), "Default-568h@2x.png": (640, 1136),
             "Default-667h@2x.png": (750, 1334), "Default-736h@3x.png": (1242, 2208), "Default-812h@3x.png": (1125, 2436),
             "Default-Portrait.png": (768, 1024), "Default-Portrait@2x.png": (1536, 2048)}
    for name, (w, h) in shots.items():
        im = Image.new("RGB", (w, h), (255, 255, 255))
        s = max(48, w // 6)
        m = mark(s, (255, 255, 255), RED, 0.7)
        im.paste(m, ((w - s) // 2, (h - s) // 2))
        im.save(os.path.join(out, name))
    print("icons and launch images in", out)


if __name__ == "__main__":
    main()
