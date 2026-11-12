"""Derive the crescent PNGs @bilo-io/ui-native inlines from @bilo-io/ui's brand mark.

React Native has no CSS `filter: invert(1)` on every platform, so the dark-theme
mark is a second, pre-inverted file rather than a runtime filter. Both are cut to
128px (sharp at 3x for the 28px default) so inlining them stays cheap.

    python3 packages/ui-native/scripts/logo-assets.py   # needs Pillow
"""

from pathlib import Path

from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent.parent / "ui" / "src" / "styles" / "brand" / "midnite-logo.png"
OUT = HERE.parent / "src" / "brand"
SIZE = 128

light = Image.open(SOURCE).convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS)
r, g, b, a = light.split()
dark = Image.merge("RGBA", (*ImageOps.invert(Image.merge("RGB", (r, g, b))).split(), a))

light.save(OUT / "midnite-logo-light.png", optimize=True)
dark.save(OUT / "midnite-logo-dark.png", optimize=True)
print(f"wrote {OUT.relative_to(HERE.parent.parent.parent)}/midnite-logo-{{light,dark}}.png")
