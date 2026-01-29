import requests
import cv2
import numpy as np
import os
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    print("Testing /health ...", end=" ")
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print("OK")
        else:
            print(f"FAILED ({r.status_code})")
    except Exception as e:
        print(f"ERROR: {e}")

def test_recommendation():
    print("Testing /recommend-outfits ...", end=" ")
    try:
        data = {
            "description": "red dress for summer wedding",
            "gender_filter": "Female",
            "top_n": 2
        }
        r = requests.post(f"{BASE_URL}/recommend-outfits", data=data)
        if r.status_code == 200:
            print(f"OK (Found {len(r.json().get('recommendations', []))} items)")
        else:
            print(f"FAILED ({r.status_code}): {r.text}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    print(f"Targeting: {BASE_URL}")
    test_health()
    test_recommendation()
    print("\nTo test image endpoints, run the server and use the Frontend UI!")
