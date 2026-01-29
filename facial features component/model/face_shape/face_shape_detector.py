"""
Face Shape Detection Module
Detects and classifies face shape using facial geometry analysis
"""
import cv2
import numpy as np

class FaceShapeDetector:
    """
    Detects face shape from facial region using geometric analysis
    Classifies into 7 standard face shapes
    """
    
    def __init__(self):
        self.face_shapes = [
            'Oval',
            'Round', 
            'Square',
            'Rectangle',
            'Heart',
            'Diamond',
            'Triangle'
        ]
    
    def detect_facial_landmarks(self, image, face_box):
        """
        Detect facial landmarks using contour analysis
        Since we don't have dlib/mediapipe in requirements, we'll use
        a simplified geometric approach based on face contours
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Dictionary with key facial measurements
        """
        x1, y1, x2, y2 = face_box
        face = image[y1:y2, x1:x2].copy()
        
        # Get face dimensions
        face_height = y2 - y1
        face_width = x2 - x1
        
        # Convert to grayscale for edge detection
        gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Edge detection
        edges = cv2.Canny(blurred, 50, 150)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Calculate measurements from face dimensions
        measurements = {
            'face_width': face_width,
            'face_height': face_height,
            'face_ratio': face_height / face_width if face_width > 0 else 1.0,
            # Estimate jaw, forehead, and cheekbone widths based on face region
            'jaw_width': self._estimate_jaw_width(face, face_width, face_height),
            'forehead_width': self._estimate_forehead_width(face, face_width, face_height),
            'cheekbone_width': self._estimate_cheekbone_width(face, face_width, face_height)
        }
        
        return measurements
    
    def _estimate_jaw_width(self, face, face_width, face_height):
        """
        Estimate jaw width from lower portion of face
        """
        # Sample bottom 20% of face
        lower_region = face[int(face_height * 0.8):, :]
        
        # Convert to grayscale if needed
        if len(lower_region.shape) == 3:
            lower_gray = cv2.cvtColor(lower_region, cv2.COLOR_BGR2GRAY)
        else:
            lower_gray = lower_region
        
        # Find edges in lower region
        edges = cv2.Canny(lower_gray, 50, 150)
        
        # Count edge pixels per row and find average width
        row_widths = []
        for row in edges:
            edge_pixels = np.where(row > 0)[0]
            if len(edge_pixels) > 1:
                width = edge_pixels[-1] - edge_pixels[0]
                row_widths.append(width)
        
        if row_widths:
            return np.mean(row_widths)
        else:
            return face_width * 0.7  # Default estimate
    
    def _estimate_forehead_width(self, face, face_width, face_height):
        """
        Estimate forehead width from upper portion of face
        """
        # Sample top 25% of face
        upper_region = face[:int(face_height * 0.25), :]
        
        # Convert to grayscale if needed
        if len(upper_region.shape) == 3:
            upper_gray = cv2.cvtColor(upper_region, cv2.COLOR_BGR2GRAY)
        else:
            upper_gray = upper_region
        
        # Find edges in upper region
        edges = cv2.Canny(upper_gray, 50, 150)
        
        # Count edge pixels per row and find average width
        row_widths = []
        for row in edges:
            edge_pixels = np.where(row > 0)[0]
            if len(edge_pixels) > 1:
                width = edge_pixels[-1] - edge_pixels[0]
                row_widths.append(width)
        
        if row_widths:
            return np.mean(row_widths)
        else:
            return face_width * 0.85  # Default estimate
    
    def _estimate_cheekbone_width(self, face, face_width, face_height):
        """
        Estimate cheekbone width from middle portion of face
        """
        # Sample middle 30-60% of face (cheekbone region)
        middle_region = face[int(face_height * 0.3):int(face_height * 0.6), :]
        
        # Convert to grayscale if needed
        if len(middle_region.shape) == 3:
            middle_gray = cv2.cvtColor(middle_region, cv2.COLOR_BGR2GRAY)
        else:
            middle_gray = middle_region
        
        # Find edges in middle region
        edges = cv2.Canny(middle_gray, 50, 150)
        
        # Count edge pixels per row and find average width
        row_widths = []
        for row in edges:
            edge_pixels = np.where(row > 0)[0]
            if len(edge_pixels) > 1:
                width = edge_pixels[-1] - edge_pixels[0]
                row_widths.append(width)
        
        if row_widths:
            return np.mean(row_widths)
        else:
            return face_width * 0.95  # Default estimate (widest part)
    
    def classify_face_shape(self, measurements):
        """
        Classify face shape based on geometric measurements
        
        Args:
            measurements: Dictionary with facial measurements
            
        Returns:
            Face shape classification
        """
        face_ratio = measurements['face_ratio']
        jaw_width = measurements['jaw_width']
        forehead_width = measurements['forehead_width']
        cheekbone_width = measurements['cheekbone_width']
        face_width = measurements['face_width']
        
        # Calculate relative ratios
        jaw_ratio = jaw_width / face_width if face_width > 0 else 0.7
        forehead_ratio = forehead_width / face_width if face_width > 0 else 0.85
        cheekbone_ratio = cheekbone_width / face_width if face_width > 0 else 0.95
        
        # Classification logic based on ratios
        
        # OVAL: Face length > width, balanced proportions
        if face_ratio > 1.3 and face_ratio < 1.6:
            if abs(jaw_ratio - forehead_ratio) < 0.15:
                return 'Oval'
        
        # ROUND: Face length ≈ width, soft curves
        if face_ratio >= 0.9 and face_ratio <= 1.2:
            if jaw_ratio > 0.75 and forehead_ratio > 0.75:
                return 'Round'
        
        # SQUARE: Face length ≈ width, strong jawline
        if face_ratio >= 0.9 and face_ratio <= 1.2:
            if jaw_ratio > 0.8 and abs(jaw_ratio - forehead_ratio) < 0.1:
                return 'Square'
        
        # RECTANGLE/OBLONG: Face length > width, similar width throughout
        if face_ratio >= 1.6:
            if abs(jaw_ratio - forehead_ratio) < 0.15:
                return 'Rectangle'
        
        # HEART: Wide forehead, narrow jaw
        if forehead_ratio > jaw_ratio + 0.15:
            if forehead_ratio > 0.85:
                return 'Heart'
        
        # TRIANGLE: Narrow forehead, wide jaw
        if jaw_ratio > forehead_ratio + 0.15:
            if jaw_ratio > 0.8:
                return 'Triangle'
        
        # DIAMOND: Narrow forehead and jaw, wide cheekbones
        if cheekbone_ratio > jaw_ratio + 0.1 and cheekbone_ratio > forehead_ratio + 0.1:
            if face_ratio > 1.2:
                return 'Diamond'
        
        # Default to Oval if no clear match
        return 'Oval'
    
    def detect(self, image, face_box):
        """
        Main detection method
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Face shape classification
        """
        try:
            # Get facial measurements
            measurements = self.detect_facial_landmarks(image, face_box)
            
            # Classify face shape
            face_shape = self.classify_face_shape(measurements)
            
            return face_shape
            
        except Exception as e:
            print(f"Error in face shape detection: {e}")
            return "Unknown"
    
    def get_face_shape_info(self, image, face_box):
        """
        Get detailed face shape information
        
        Args:
            image: BGR image
            face_box: [x1, y1, x2, y2] face bounding box
            
        Returns:
            Dictionary with face shape details
        """
        try:
            measurements = self.detect_facial_landmarks(image, face_box)
            face_shape = self.classify_face_shape(measurements)
            
            return {
                'face_shape': face_shape,
                'face_ratio': round(measurements['face_ratio'], 2),
                'measurements': {
                    'width': measurements['face_width'],
                    'height': measurements['face_height']
                }
            }
        except Exception as e:
            print(f"Error in face shape detection: {e}")
            return {
                'face_shape': 'Unknown',
                'face_ratio': None,
                'measurements': None
            }
