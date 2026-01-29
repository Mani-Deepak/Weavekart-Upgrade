from fastapi import FastAPI
from pymongo import MongoClient
from passlib.context import CryptContext
from datetime import datetime
import random, string

app = FastAPI()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

MONGO_URI = "mongodb+srv://Vardhan:vardhan@2005@cluster0.592u1ya.mongodb.net/?appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["fashionDB"]

def generate_app_id():
    now = datetime.now().strftime("%Y%m%d%H%M%S")
    rand = ''.join(random.choices(string.digits, k=4))
    return f"APP{now}{rand}"

def user_collections(app_id):
    return {
        "main": db[f"user_{app_id}_main"],
        "personal": db[f"user_{app_id}_personal"],
        "cart": db[f"user_{app_id}_cart"],
        "orders": db[f"user_{app_id}_orders"],
        "products": db[f"user_{app_id}_products"],
        "logs": db[f"user_{app_id}_logs"]
    }

@app.post("/api/users/register")
def register(data: dict):
    app_id = generate_app_id()
    cols = user_collections(app_id)

    cols["main"].insert_one({
        "application_id": app_id,
        "email": data["email"],
        "password": pwd.hash(data["password"]),
        "created_at": datetime.now()
    })

    cols["personal"].insert_one({"application_id": app_id})
    cols["cart"].insert_one({"application_id": app_id, "items": []})
    cols["orders"].insert_one({"application_id": app_id, "orders": []})
    cols["products"].insert_one({"application_id": app_id, "products": []})
    cols["logs"].insert_one({"application_id": app_id, "logins": []})

    return {"message": "User created", "application_id": app_id}

@app.post("/api/users/login")
def login(data: dict):
    app_id = data["application_id"]
    cols = user_collections(app_id)

    user = cols["main"].find_one({"application_id": app_id})
    if not user or not pwd.verify(data["password"], user["password"]):
        return {"error": "Invalid credentials"}

    cols["logs"].update_one({}, {"$push": {"logins": {"time": datetime.now()}}})
    return {"message": "Login successful"}
