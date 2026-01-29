import sys
import os

print("Checking imports...")
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.getcwd() 
print(f"CWD: {root_dir}")

# Simulate main.py paths
sys.path.append(os.path.join(root_dir, 'facial features component'))
sys.path.append(os.path.join(root_dir, 'recommendations component'))
sys.path.append(os.path.join(root_dir, 'VR component'))

try:
    print("Importing FaceAnalyzer...")
    from predict import get_analyzer
    print("SUCCESS: FaceAnalyzer")
except Exception as e:
    print(f"FAIL: FaceAnalyzer - {e}")

try:
    print("Importing Recommendation...")
    from fashion_recommender import get_outfit_recommendations
    print("SUCCESS: Recommendation")
except Exception as e:
    print(f"FAIL: Recommendation - {e}")

try:
    print("Importing VR...")
    from generate_clothing import get_clothing_generator
    print("SUCCESS: VR")
except Exception as e:
    print(f"FAIL: VR - {e}")
