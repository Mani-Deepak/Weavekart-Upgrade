''' Simplified Facial attribute extraction - Gender, Skin Tone, Face Shape '''
#--------------------------------
# Date : 24-01-2026
# Project : Facial Attribute Extraction (Simplified)
# Features: Gender, Skin Tone, Face Shape Detection
#--------------------------------
import os
import cv2
import sys
import glob
import logging
import argparse
import numpy as np
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

# Ensure model directory is in path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

try:
    from model.skin_tone.skin_tone_detector import SkinToneDetector
    from model.face_shape.face_shape_detector import FaceShapeDetector
except ImportError:
    # Try importing with package prefix if running from root
    from .model.skin_tone.skin_tone_detector import SkinToneDetector
    from .model.face_shape.face_shape_detector import FaceShapeDetector

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class FaceAnalyzer:
    def __init__(self):
        self._load_config()
        self._load_models()

    def _load_config(self):
        # Robust .env loading
        env_path = Path(os.path.dirname(os.path.abspath(__file__))) / '.env'
        load_dotenv(dotenv_path=env_path)
        
        self.faceProto = os.getenv("FACEDETECTOR")
        self.faceModel = os.getenv("FACEMODEL")
        self.genderProto = os.getenv("GENDERDETECTOR")
        self.genderModel = os.getenv("GENDERMODEL")
        
        # Verify paths existence
        if not os.path.exists(self.faceProto) or not os.path.exists(self.faceModel):
            # Try to resolve relative to current file if absolute paths fail
            base_path = os.path.dirname(os.path.abspath(__file__))
            self.faceProto = os.path.join(base_path, self.faceProto) if self.faceProto else None
            self.faceModel = os.path.join(base_path, self.faceModel) if self.faceModel else None
            self.genderProto = os.path.join(base_path, self.genderProto) if self.genderProto else None
            self.genderModel = os.path.join(base_path, self.genderModel) if self.genderModel else None

    def _load_models(self):
        print("Loading models...")
        #Load face detection model
        self.faceNet = cv2.dnn.readNet(self.faceModel, self.faceProto)
        #Load gender detection model
        self.genderNet = cv2.dnn.readNet(self.genderModel, self.genderProto)
        #create instances for skin tone and face shape detection
        self.skin_detector = SkinToneDetector()
        self.face_shape_detector = FaceShapeDetector()
        print("Models loaded.")

    def getFaceBox(self, image, conf_threshold=0.7):
        image = image.copy()
        imageHeight = image.shape[0]
        imageWidth = image.shape[1]
        blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), [104, 117, 123], True, False)
        self.faceNet.setInput(blob)
        detections = self.faceNet.forward()
        faceBoxes = []
        for i in range(detections.shape[2]):
            confidence = detections[0,0,i,2]
            if confidence > conf_threshold:
                x1 = int(detections[0,0,i,3]*imageWidth)
                y1 = int(detections[0,0,i,4]*imageHeight)
                x2 = int(detections[0,0,i,5]*imageWidth)
                y2 = int(detections[0,0,i,6]*imageHeight)
                faceBoxes.append([x1,y1,x2,y2])
        return faceBoxes

    def detectGender(self, image, faceBox):
        MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
        genderList = ['Male', 'Female']
        
        padding = 20
        face = image[max(0,faceBox[1]-padding):min(faceBox[3]+padding,image.shape[0]-1),
                     max(0,faceBox[0]-padding):min(faceBox[2]+padding, image.shape[1]-1)]
        
        if face.size == 0:
            return "Unknown"
            
        blob = cv2.dnn.blobFromImage(face, 1.0, (227,227), MODEL_MEAN_VALUES, swapRB=False)

        # Predict the gender
        self.genderNet.setInput(blob)
        genderPreds = self.genderNet.forward()
        gender = genderList[genderPreds[0].argmax()]
        
        return gender

    def analyze_image(self, image_input):
        """
        Analyze an image for face attributes.
        Args:
            image_input: path to image or numpy array (cv2 image)
        Returns:
            list of dicts containing attributes for each face
        """
        if isinstance(image_input, str):
            image = cv2.imread(image_input)
            if image is None:
                raise ValueError(f"Could not read image at {image_input}")
        elif isinstance(image_input, np.ndarray):
            image = image_input
        else:
            raise ValueError("Invalid image input format")

        faceBoxes = self.getFaceBox(image)
        results = []

        if not faceBoxes:
            return []

        for faceBox in faceBoxes:
            try:
                # Detect attributes
                gender = self.detectGender(image, faceBox)
                skin_tone, fitzpatrick, _ = self.skin_detector.detect(image, faceBox)
                face_shape = self.face_shape_detector.detect(image, faceBox)
                
                results.append({
                    "box": faceBox,
                    "gender": gender,
                    "skin_tone": skin_tone,
                    "fitzpatrick": fitzpatrick,
                    "face_shape": face_shape
                })
            except Exception as e:
                print(f"Error analyzing face: {e}")
                continue

        return results

# Singleton instance
_analyzer = None

def get_analyzer():
    global _analyzer
    if _analyzer is None:
        _analyzer = FaceAnalyzer()
    return _analyzer

def main():
    ''' Loading Image from directory and detecting attributes'''
    pathImg = os.getenv("IMGPATH")
    if not pathImg:
        # Fallback for testing
        pathImg = "images/"
        
    APP_ROOT = os.getenv("APPROOT", "./")
    
    analyzer = get_analyzer()
    
    img_dir = pathImg
    if os.path.exists(img_dir):
        names = os.listdir(img_dir)
        print("\n" + "="*60)
        print("SIMPLIFIED FACIAL ATTRIBUTE DETECTION")
        print("Features: Gender, Skin Tone, Face Shape")
        print("="*60 + "\n")
        
        for name in names:
            if not name.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
                
            path = os.path.join(img_dir, name)
            print(f"Processing: {name}")
            
            image = cv2.imread(path)
            if image is None:
                continue

            results = analyzer.analyze_image(image)
            
            for idx, res in enumerate(results):
                print(f"Face #{idx+1}: Gender={res['gender']}, Skin={res['skin_tone']}, Shape={res['face_shape']}")

if __name__ == "__main__":
    main()
