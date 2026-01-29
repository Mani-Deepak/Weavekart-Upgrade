# How to Test with Your Own Images

## Quick Start

### Method 1: Drag and Drop (Easiest)

1. Run the script:
   ```bash
   python test_single_image.py
   ```

2. When prompted, **drag and drop** your image file into the terminal

3. Press Enter

4. View results in the terminal and check `results/` folder for annotated image

---

### Method 2: Command Line

Run with image path as argument:

```bash
python test_single_image.py "path/to/your/image.jpg"
```

**Examples**:

```bash
# Windows
python test_single_image.py "C:\Users\YourName\Pictures\photo.jpg"

# Relative path
python test_single_image.py "my_photo.jpg"
```

---

### Method 3: Add Images to Dataset Folder

1. Copy your image(s) to the `Dataset/` folder

2. Rename them following the pattern: `004006.jpg`, `004007.jpg`, etc.

3. Run the main script:
   ```bash
   python predict.py
   ```

4. All images in `Dataset/` will be processed

---

## What You'll Get

### Console Output

```
======================================================================
Processing: C:\Users\...\my_photo.jpg
======================================================================

✅ Detected 1 face(s)

DETECTED ATTRIBUTES:
----------------------------------------------------------------------
  Gender:            Female
  Skin Tone:         Fair
  Fitzpatrick Scale: Type II
  L* Value:          65.23
  Face Shape:        Oval
----------------------------------------------------------------------

✅ Result saved to: results/result_my_photo.jpg
======================================================================
```

### Saved Image

- Original image with **green bounding box** around detected face
- Saved in `results/` folder
- Filename: `result_<original_filename>.jpg`

---

## Tips for Best Results

### ✅ Good Images

- **Clear frontal face** (looking at camera)
- **Good lighting** (natural or well-lit)
- **High resolution** (at least 300x300 pixels)
- **Unobstructed face** (no sunglasses, masks, or hands covering face)

### ❌ Avoid

- Side profiles or extreme angles
- Very dark or overexposed images
- Blurry or low-resolution images
- Multiple overlapping faces

---

## Supported Image Formats

- `.jpg` / `.jpeg`
- `.png`
- `.bmp`
- `.tiff`

---

## Example Workflow

1. **Take or find a photo** with a clear face

2. **Run the test script**:
   ```bash
   python test_single_image.py
   ```

3. **Drag and drop** your image when prompted

4. **View results** in terminal

5. **Check annotated image** in `results/` folder

---

## Troubleshooting

### "No face detected"

- Try a different image with clearer face
- Ensure face is frontal (not side profile)
- Check lighting (not too dark)

### "Could not read image"

- Check file path is correct
- Ensure file format is supported
- Try copying image to same folder as script

### "File not found"

- Use absolute path or copy image to project folder
- Remove quotes if path has spaces
- On Windows, use forward slashes `/` or double backslashes `\\`

---

## Quick Test

Try with the sample image:

```bash
python test_single_image.py "Dataset/004005.jpg"
```

This should work immediately and show you the expected output format!
