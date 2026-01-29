from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import sys
import shutil
import cv2
import numpy as np
import json
from uuid import uuid4

# Add component directories to path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
sys.path.append(os.path.join(root_dir, 'facial features component'))
sys.path.append(os.path.join(root_dir, 'recommendations component'))
sys.path.append(os.path.join(root_dir, 'VR component'))

# Import Components
try:
    from predict import get_analyzer
    FACE_ANALYSIS_AVAILABLE = True
except Exception as e:
    print(f"Warning: Facial analysis component not available: {e}")
    FACE_ANALYSIS_AVAILABLE = False

try:
    from fashion_recommender import get_outfit_recommendations
    RECOMMENDATION_AVAILABLE = True
except Exception as e:
    print(f"Warning: Recommendation component not available: {e}")
    RECOMMENDATION_AVAILABLE = False


# DEMO_MODE Flag
DEMO_MODE = os.getenv("DEMO_MODE", "False").lower() == "true"

try:
    if DEMO_MODE:
        print("DEMO_MODE is enabled. VR component will be mocked.")
        VR_AVAILABLE = True # Pretend it's available
        # Define mock functions if not importing
        def get_clothing_generator(): return None, None
        def generate_outfit(*args): pass
    else:
        from generate_clothing import get_clothing_generator, generate_outfit
        VR_AVAILABLE = True
except Exception as e:
    print(f"Warning: VR component not available: {e}")
    VR_AVAILABLE = False

app = FastAPI(title="Aiva Fashion API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static for serving generated images
os.makedirs("generated_images", exist_ok=True)
app.mount("/static", StaticFiles(directory="generated_images"), name="static")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Aiva Fashion API",
        "mode": "DEMO" if DEMO_MODE else "FULL",
        "components": {
            "face_analysis": FACE_ANALYSIS_AVAILABLE,
            "recommendations": RECOMMENDATION_AVAILABLE,
            "virtual_try_on": VR_AVAILABLE
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze-face")
async def analyze_face(file: UploadFile = File(...)):
    if not FACE_ANALYSIS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Face analysis service unavailable")
    
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # In DEMO_MODE, you might also want to mock analysis if memory is tight,
        # but for now we keep it real as requested unless it crashes.
        analyzer = get_analyzer()
        results = analyzer.analyze_image(img)
        
        # Convert numpy types to native python types for JSON serialization
        processed_results = []
        for res in results:
            processed = res.copy()
            processed['box'] = [int(x) for x in res['box']]
            # Add logic to convert other numpy types if necessary
            processed_results.append(processed)
            
        return {"faces": processed_results}
    except Exception as e:
        print(f"Error in analyze_face: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-outfits")
async def recommend_outfits(
    description: str = Form(...),
    gender_filter: str = Form(None),
    top_n: int = Form(10)
):
    if not RECOMMENDATION_AVAILABLE:
        raise HTTPException(status_code=503, detail="Recommendation service unavailable")
    
    try:
        recommendations = get_outfit_recommendations(
            user_description=description,
            top_n=top_n,
            gender_filter=gender_filter
        )
        
        if isinstance(recommendations, dict) and "error" in recommendations:
            raise HTTPException(status_code=500, detail=recommendations["error"])
            
        return {"recommendations": recommendations}
    except Exception as e:
        print(f"Error in recommend_outfits: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Global VR model cache
_vr_pipe = None
_vr_pose_model = None

@app.post("/generate-try-on")
async def generate_try_on(
    file: UploadFile = File(...),
    description: str = Form(...)
):
    if not VR_AVAILABLE:
        raise HTTPException(status_code=503, detail="VR service unavailable")
        
    global _vr_pipe, _vr_pose_model
    
    try:
        # Save uploaded file
        file_id = str(uuid4())
        
        # In DEMO_MODE, we just copy input to output to "mock" the generation
        input_filename = f"input_{file_id}.jpg"
        output_filename = f"output_{file_id}.png"
        
        # Use simple filenames for demo to avoid clutter/complexity
        # For simplicity, we save the input as the 'output' just with different extension
        # or just copy it.
        
        output_path = f"generated_images/{output_filename}"
        
        # Read file content
        content = await file.read()
        
        # Write content to output path directly (mocking generation)
        # Note: If input is JPG and we name it PNG, modern browsers/OS handle it, 
        # but to be correct we should use CV2 or PIL to save if we want format conversion.
        # Here we just write bytes.
        
        if DEMO_MODE:
            print(f"DEMO_MODE: Mocking generation for {description}")
            with open(output_path, "wb") as f:
                f.write(content)
        else:
            # REAL MODE
            # Load models if not loaded
            if _vr_pipe is None:
                print("Loading VR models...")
                _vr_pipe, _vr_pose_model = get_clothing_generator()
                
            temp_input_path = f"generated_images/{input_filename}"
            with open(temp_input_path, "wb") as buffer:
                buffer.write(content)
                
            generate_outfit(
                _vr_pipe, 
                _vr_pose_model, 
                temp_input_path, 
                description, 
                output_path
            )
        
        return {
            "status": "success",
            "image_url": f"/static/{output_filename}",
            "is_demo": DEMO_MODE
        }
        
    except Exception as e:
        print(f"Error in generate_try_on: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
