import os
from PIL import Image

# Folder where your images are stored
INPUT_FOLDER = "images"
OUTPUT_FOLDER = "images_webp"

# Create output folder if it doesn't exist
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Loop through files in input folder
for filename in os.listdir(INPUT_FOLDER):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        img_path = os.path.join(INPUT_FOLDER, filename)
        img = Image.open(img_path).convert("RGB")

        # Save as WebP
        new_filename = os.path.splitext(filename)[0] + ".webp"
        output_path = os.path.join(OUTPUT_FOLDER, new_filename)

        img.save(output_path, "webp", quality=80)  # quality=80 keeps it light & good quality
        print(f"Converted: {filename} → {new_filename}")

print("✅ All images converted to WebP!")
