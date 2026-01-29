''' Test script to demonstrate the simplified facial attribute detection '''
import os
import cv2
from pathlib import Path
from dotenv import load_dotenv
from model.skin_tone.skin_tone_detector import SkinToneDetector
from model.face_shape.face_shape_detector import FaceShapeDetector

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Load path from .env
faceProto = os.getenv("FACEDETECTOR")
faceModel = os.getenv("FACEMODEL")
genderProto = os.getenv("GENDERDETECTOR")
genderModel = os.getenv("GENDERMODEL")
pathImg = os.getenv("IMGPATH")

#Load models
faceNet=cv2.dnn.readNet(faceModel,faceProto)
genderNet=cv2.dnn.readNet(genderModel,genderProto)
skin_detector = SkinToneDetector()
face_shape_detector = FaceShapeDetector()

def getFaceBox(net, image, conf_threshold=0.7):
    imageHeight=image.shape[0]
    imageWidth=image.shape[1]
    blob=cv2.dnn.blobFromImage(image, 1.0, (300, 300), [104, 117, 123], True, False)
    net.setInput(blob)
    detections=net.forward()
    faceBoxes=[]
    for i in range(detections.shape[2]):
        confidence=detections[0,0,i,2]
        if confidence>conf_threshold:
            x1=int(detections[0,0,i,3]*imageWidth)
            y1=int(detections[0,0,i,4]*imageHeight)
            x2=int(detections[0,0,i,5]*imageWidth)
            y2=int(detections[0,0,i,6]*imageHeight)
            faceBoxes.append([x1,y1,x2,y2])
    return faceBoxes

def detectGender(image,faceBox):
    MODEL_MEAN_VALUES=(78.4263377603, 87.7689143744, 114.895847746)
    genderList=['Male','Female']
    padding=20
    face=image[max(0,faceBox[1]-padding):
        min(faceBox[3]+padding,image.shape[0]-1),max(0,faceBox[0]-padding)
        :min(faceBox[2]+padding, image.shape[1]-1)]
    blob=cv2.dnn.blobFromImage(face, 1.0, (227,227), MODEL_MEAN_VALUES, swapRB=False)
    genderNet.setInput(blob)
    genderPreds=genderNet.forward()
    gender=genderList[genderPreds[0].argmax()]
    return gender

# Test with sample image
test_image = pathImg + "004005.jpg"
print("\n" + "="*70)
print("FACIAL ATTRIBUTE DETECTION TEST")
print("="*70)
print(f"\nTesting with: {test_image}\n")

image = cv2.imread(test_image)
faceBoxes = getFaceBox(faceNet, image)

if faceBoxes:
    faceBox = faceBoxes[0]
    
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
    print(f"  Face Shape:        {face_shape}")
    print("-" * 70)
    print("\n✅ Detection successful!\n")
else:
    print("❌ No face detected in image\n")

print("="*70 + "\n")
