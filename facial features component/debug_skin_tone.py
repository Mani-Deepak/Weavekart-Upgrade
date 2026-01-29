"""
Debug script to show detailed skin tone analysis
This will help verify the skin tone detection is working correctly
"""
import os
import sys
import cv2
import numpy as np
from pathlib import Path
from dotenv import load_dotenv
from model.skin_tone.skin_tone_detector import SkinToneDetector

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Load paths
faceProto = os.getenv("FACEDETECTOR")
faceModel = os.getenv("FACEMODEL")

# Load face detection model
faceNet = cv2.dnn.readNet(faceModel, faceProto)
skin_detector = SkinToneDetector()

def getFaceBox(net, image, conf_threshold=0.7):
    imageHeight = image.shape[0]
    imageWidth = image.shape[1]
    blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), [104, 117, 123], True, False)
    net.setInput(blob)
    detections = net.forward()
    faceBoxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * imageWidth)
            y1 = int(detections[0, 0, i, 4] * imageHeight)
            x2 = int(detections[0, 0, i, 5] * imageWidth)
            y2 = int(detections[0, 0, i, 6] * imageHeight)
            faceBoxes.append([x1, y1, x2, y2])
    return faceBoxes

# Get image path
if len(sys.argv) > 1:
    image_path = sys.argv[1]
else:
    image_path = "Dataset/004005.jpg"

print("\n" + "="*70)
print("SKIN TONE DETECTION - DEBUG MODE")
print("="*70)
print(f"\nAnalyzing: {image_path}\n")

# Read image
image = cv2.imread(image_path)
if image is None:
    print("❌ Could not read image")
    sys.exit(1)

# Detect face
faceBoxes = getFaceBox(faceNet, image)
if not faceBoxes:
    print("❌ No face detected")
    sys.exit(1)

faceBox = faceBoxes[0]
print(f"✅ Face detected at: {faceBox}\n")

# Extract skin region
skin_mask, face = skin_detector.extract_skin_region(image, faceBox)

# Get LAB values
lab = cv2.cvtColor(face, cv2.COLOR_BGR2LAB)
skin_pixels = lab[skin_mask > 0]

if len(skin_pixels) > 0:
    # Raw OpenCV values (0-255 range)
    mean_l_opencv = np.mean(skin_pixels[:, 0])
    mean_a_opencv = np.mean(skin_pixels[:, 1])
    mean_b_opencv = np.mean(skin_pixels[:, 2])
    
    # Converted L* value (0-100 range)
    mean_l_standard = mean_l_opencv * (100.0 / 255.0)
    
    print("DEBUG INFORMATION:")
    print("-" * 70)
    print(f"Number of skin pixels detected: {len(skin_pixels)}")
    print(f"\nRAW OpenCV LAB values (0-255 range):")
    print(f"  L* (OpenCV): {mean_l_opencv:.2f}")
    print(f"  a*:          {mean_a_opencv:.2f}")
    print(f"  b*:          {mean_b_opencv:.2f}")
    print(f"\nCONVERTED L* value (0-100 standard range):")
    print(f"  L* (Standard): {mean_l_standard:.2f}")
    print("-" * 70)
    
    # Get classification
    skin_tone, fitzpatrick, l_value = skin_detector.detect(image, faceBox)
    
    print(f"\nCLASSIFICATION RESULTS:")
    print("-" * 70)
    print(f"  Skin Tone:         {skin_tone}")
    print(f"  Fitzpatrick Scale: {fitzpatrick}")
    print(f"  L* Value Used:     {l_value:.2f}")
    print("-" * 70)
    
    print(f"\nFITZPATRICK SCALE REFERENCE:")
    print("-" * 70)
    print(f"  Type I   (Very Fair):  L* 70-100")
    print(f"  Type II  (Fair):       L* 60-70")
    print(f"  Type III (Medium):     L* 50-60")
    print(f"  Type IV  (Olive):      L* 40-50")
    print(f"  Type V   (Brown):      L* 30-40")
    print(f"  Type VI  (Dark):       L* 0-30")
    print("-" * 70)
    
    print(f"\n✅ Analysis complete!")
    print("="*70 + "\n")
else:
    print("❌ No skin pixels detected in mask")
