"""
Interactive script to test facial attribute detection with any image
Usage: python test_single_image.py <path_to_image>
Or run without arguments to be prompted for image path
"""
import os
import sys
import cv2
from pathlib import Path
from dotenv import load_dotenv
from model.skin_tone.skin_tone_detector import SkinToneDetector
from model.face_shape.face_shape_detector import FaceShapeDetector

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Load paths from .env
faceProto = os.getenv("FACEDETECTOR")
faceModel = os.getenv("FACEMODEL")
genderProto = os.getenv("GENDERDETECTOR")
genderModel = os.getenv("GENDERMODEL")
APPROOT = os.getenv("APPROOT")

# Load models
print("Loading models...")
faceNet = cv2.dnn.readNet(faceModel, faceProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)
skin_detector = SkinToneDetector()
face_shape_detector = FaceShapeDetector()
print("✅ Models loaded successfully!\n")

def getFaceBox(net, image, conf_threshold=0.7):
    """Detect faces in image"""
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
            # Draw rectangle on image
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
    return image, faceBoxes

def detectGender(image, faceBox):
    """Detect gender from face region"""
    MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
    genderList = ['Male', 'Female']
    padding = 20
    face = image[max(0, faceBox[1]-padding):
        min(faceBox[3]+padding, image.shape[0]-1), max(0, faceBox[0]-padding):
        min(faceBox[2]+padding, image.shape[1]-1)]
    blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
    genderNet.setInput(blob)
    genderPreds = genderNet.forward()
    gender = genderList[genderPreds[0].argmax()]
    return gender

def process_image(image_path):
    """Process a single image and display results"""
    print("="*70)
    print(f"Processing: {image_path}")
    print("="*70 + "\n")
    
    # Check if file exists
    if not os.path.exists(image_path):
        print(f"❌ Error: File not found - {image_path}")
        return False
    
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Error: Could not read image - {image_path}")
        return False
    
    # Detect faces
    resultImg, faceBoxes = getFaceBox(faceNet, image)
    
    if not faceBoxes:
        print("❌ No face detected in the image")
        print("   Try with a different image with a clear frontal face\n")
        return False
    
    print(f"✅ Detected {len(faceBoxes)} face(s)\n")
    
    # Process each face
    for idx, faceBox in enumerate(faceBoxes):
        if len(faceBoxes) > 1:
            print(f"\n--- Face #{idx+1} ---\n")
        
        # Detect attributes
        gender = detectGender(image, faceBox)
        skin_tone, fitzpatrick, l_value = skin_detector.detect(image, faceBox)
        face_shape = face_shape_detector.detect(image, faceBox)
        
        # Display results
        print("DETECTED ATTRIBUTES:")
        print("-" * 70)
        print(f"  Gender:            {gender}")
        print(f"  Skin Tone:         {skin_tone}")
        print(f"  Fitzpatrick Scale: {fitzpatrick}")
        if l_value:
            print(f"  L* Value:          {l_value:.2f}")
        print(f"  Face Shape:        {face_shape}")
        print("-" * 70)
    
    # Save result
    output_filename = "result_" + os.path.basename(image_path)
    output_path = os.path.join(APPROOT, "results", output_filename)
    cv2.imwrite(output_path, resultImg)
    print(f"\n✅ Result saved to: results/{output_filename}")
    print("="*70 + "\n")
    
    return True

def main():
    """Main function"""
    print("\n" + "="*70)
    print("FACIAL ATTRIBUTE DETECTION - Single Image Test")
    print("="*70 + "\n")
    
    # Get image path from command line or user input
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        print("Enter the path to your image:")
        print("(You can drag and drop the image file here)\n")
        image_path = input("Image path: ").strip().strip('"').strip("'")
    
    if not image_path:
        print("❌ No image path provided")
        return
    
    # Process the image
    success = process_image(image_path)
    
    if success:
        print("✅ Detection completed successfully!\n")
    else:
        print("\n💡 Tips:")
        print("   - Make sure the image has a clear, frontal face")
        print("   - Supported formats: .jpg, .jpeg, .png")
        print("   - Try with better lighting if detection fails\n")

if __name__ == "__main__":
    main()
