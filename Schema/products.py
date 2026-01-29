from fastapi import FastAPI, UploadFile, File, Form
from pymongo import MongoClient
from datetime import datetime
import random, string
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

# -----------------------
# Load ENV
# -----------------------
load_dotenv()

# -----------------------
# App Init
# -----------------------
app = FastAPI()

# -----------------------
# MongoDB Connection
# -----------------------
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["fashionDB"]
products = db["products_master"]

# -----------------------
# Cloudinary Config
# -----------------------
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# -----------------------
# Product ID Generator
# -----------------------
def generate_product_id():
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    rand = ''.join(random.choices(string.digits, k=4))
    return f"PROD{now}{rand}"

# -----------------------
# Upload Product With Image
# -----------------------
@app.post("/api/products/add")
async def add_product(
    user_application_id: str = Form(...),
    product_name: str = Form(...),
    product_description: str = Form(...),
    colors_available: str = Form(...),           # comma separated
    sizes_available: str = Form(...),            # JSON string
    gender: str = Form(...),
    category: str = Form(...),
    seasonal_recommended: str = Form(...),
    places: str = Form(...),
    style: str = Form(...),
    fabric_type: str = Form(...),
    material_composition: str = Form(...),
    pattern: str = Form(...),
    fit_type: str = Form(...),
    sleeve_type: str = Form(...),
    collar_style: str = Form(...),
    length_type: str = Form(...),
    country_of_origin: str = Form(...),
    rating: float = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...)
):

    # ---------------- Upload Image to Cloudinary ----------------
    upload_result = cloudinary.uploader.upload(image.file)
    image_url = upload_result["secure_url"]

    # ---------------- Convert Strings to List ----------------
    colors_list = [c.strip() for c in colors_available.split(",")]

    import json
    sizes_list = json.loads(sizes_available)

    # ---------------- Create Product Document ----------------
    product_doc = {
        "product_id": generate_product_id(),
        "user_application_id": user_application_id,
        "product_name": product_name,
        "product_description": product_description,
        "image_url": image_url,
        "colors_available": colors_list,
        "sizes_available": sizes_list,
        "gender": gender,
        "category": category,
        "seasonal_recommended": seasonal_recommended.split(","),
        "places": places.split(","),
        "style": style.split(","),
        "fabric_type": fabric_type,
        "material_composition": material_composition,
        "pattern": pattern,
        "fit_type": fit_type,
        "sleeve_type": sleeve_type,
        "collar_style": collar_style,
        "length_type": length_type,
        "country_of_origin": country_of_origin,
        "rating": rating,
        "price": price,
        "created_at": datetime.now()
    }

    products.insert_one(product_doc)

    return {
        "message": "Product uploaded successfully",
        "product_id": product_doc["product_id"],
        "image_url": image_url
    }

# -----------------------
# Get All Products
# -----------------------
@app.get("/api/products")
def get_products():
    result = []
    for p in products.find():
        p["_id"] = str(p["_id"])
        result.append(p)
    return result
