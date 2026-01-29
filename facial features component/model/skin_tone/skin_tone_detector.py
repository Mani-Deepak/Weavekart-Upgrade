"""
Skin Tone Detection Module
Detects and classifies skin tone using color analysis in LAB color space
"""
import cv2
import numpy as np

class SkinToneDetector:
    """
    Detects skin tone from facial region using LAB color space analysis
    Classifies into Fitzpatrick scale (I-VI) and descriptive categories
    """
    
    def __init__(self):
        # Fitzpatrick scale boundaries based on L* value in LAB color space
        # L* ranges from 0 (black) to 100 (white)
        self.fitzpatrick_boundaries = {
            'Type I': (70, 100),    # Very Fair - Always burns, never tans
            'Type II': (60, 70),    # Fair - Usually burns, tans minimally
            'Type III': (50, 60),   # Medium - Sometimes burns, tans uniformly
            'Type IV': (40, 50),    # Olive - Rarely burns, tans easily
            'Type V': (30, 40),     # Brown - Very rarely burns, tans very easily
            'Type VI': (0, 30)      # Dark Brown/Black - Never burns, deeply pigmented
        }
        
        self.descriptive_categories = {
            'Very Fair': (70, 100),
            'Fair': (60, 70),
            'Medium': (50, 60),
            'Olive': (40, 50),
            'Brown': (30, 40),
            'Dark Brown': (20, 30),
            'Very Dark': (0, 20)
        }
    
    def extract_skin_region(self, image, face_box):
        """
        Extract skin region from face, excluding eyes, mouth, and background
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Skin region mask and cropped face
        """
        x1, y1, x2, y2 = face_box
        face = image[y1:y2, x1:x2].copy()
        
        # Convert to YCrCb color space for skin detection
        ycrcb = cv2.cvtColor(face, cv2.COLOR_BGR2YCrCb)
        
        # Define skin color range in YCrCb
        # These values work well for diverse skin tones
        lower_skin = np.array([0, 133, 77], dtype=np.uint8)
        upper_skin = np.array([255, 173, 127], dtype=np.uint8)
        
        # Create skin mask
        skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
        
        # Apply morphological operations to clean up the mask
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)
        skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
        
        # Apply Gaussian blur to smooth
        skin_mask = cv2.GaussianBlur(skin_mask, (3, 3), 0)
        
        return skin_mask, face
    
    def calculate_skin_tone(self, face, skin_mask):
        """
        Calculate average skin tone from masked region
        
        Args:
            face: BGR face image
            skin_mask: Binary mask of skin pixels
            
        Returns:
            Average L*, a*, b* values
        """
        # Convert to LAB color space (perceptually uniform)
        lab = cv2.cvtColor(face, cv2.COLOR_BGR2LAB)
        
        # Extract skin pixels only
        skin_pixels = lab[skin_mask > 0]
        
        if len(skin_pixels) == 0:
            # No skin detected, return default values
            return None, None, None
        
        # Calculate mean L*, a*, b* values
        # NOTE: OpenCV stores L* in range 0-255, need to convert to 0-100
        mean_l_opencv = np.mean(skin_pixels[:, 0])
        mean_a = np.mean(skin_pixels[:, 1])
        mean_b = np.mean(skin_pixels[:, 2])
        
        # Convert L* from OpenCV range (0-255) to standard range (0-100)
        mean_l = mean_l_opencv * (100.0 / 255.0)
        
        return mean_l, mean_a, mean_b
    
    def classify_fitzpatrick(self, l_value):
        """
        Classify skin tone into Fitzpatrick scale based on L* value
        
        Args:
            l_value: L* value from LAB color space (0-100)
            
        Returns:
            Fitzpatrick type (I-VI)
        """
        if l_value is None:
            return "Unknown"
        
        for fitz_type, (lower, upper) in self.fitzpatrick_boundaries.items():
            if lower <= l_value < upper:
                return fitz_type
        
        return "Type VI"  # Default to darkest if below range
    
    def classify_descriptive(self, l_value):
        """
        Classify skin tone into descriptive category
        
        Args:
            l_value: L* value from LAB color space (0-100)
            
        Returns:
            Descriptive category
        """
        if l_value is None:
            return "Unknown"
        
        for category, (lower, upper) in self.descriptive_categories.items():
            if lower <= l_value < upper:
                return category
        
        return "Very Dark"  # Default to darkest if below range
    
    def detect(self, image, face_box):
        """
        Main detection method
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Tuple of (descriptive_category, fitzpatrick_type, l_value)
        """
        try:
            # Extract skin region
            skin_mask, face = self.extract_skin_region(image, face_box)
            
            # Calculate skin tone
            mean_l, mean_a, mean_b = self.calculate_skin_tone(face, skin_mask)
            
            if mean_l is None:
                return "Unknown", "Unknown", None
            
            # Classify
            fitzpatrick = self.classify_fitzpatrick(mean_l)
            descriptive = self.classify_descriptive(mean_l)
            
            return descriptive, fitzpatrick, mean_l
            
        except Exception as e:
            print(f"Error in skin tone detection: {e}")
            return "Unknown", "Unknown", None
    
    def get_skin_tone_info(self, image, face_box):
        """
        Get detailed skin tone information
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Dictionary with skin tone details
        """
        descriptive, fitzpatrick, l_value = self.detect(image, face_box)
        
        return {
            'descriptive_category': descriptive,
            'fitzpatrick_scale': fitzpatrick,
            'l_value': round(l_value, 2) if l_value is not None else None
        }
