# AIVA - AI-Powered Fashion Stylist

Aiva is an intelligent fashion platform that revolutionizes the online shopping experience by combining computer vision, semantic search, and generative AI. It acts as a personal stylist, analyzing your facial features to recommend outfits that perfectly match your look and even lets you virtually try them on.

## 🚀 Key Features

### 1. 🔍 Facial Attribute Analysis
- **Smart Detection**: automatically detects Gender, Skin Tone (Fitzpatrick Scale), and Face Shape from a user's photo.
- **Privacy First**: Analysis happens locally or on a secure backend; images aren't stored permanently.

### 2. 👗 Personalized Recommendations
- **Semantic Search**: Uses a Vector Store (ChromaDB) to understand natural language queries like "boho dress for a beach wedding".
- **Attribute Matching**: Filters products that specifically suit your detected body type, skin tone, and face shape.
- **Context Aware**: Understands occasions, seasons, and fabric preferences.

### 3. ✨ virtual Try-On (Generative AI)
- **AI-Generated Styling**: Visualize how an outfit would look on you using Stable Diffusion.
- **Pose Preservation**: Keeps your original pose while swapping the clothing based on your description.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Lucide React

### Backend & API
- **Server**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Image Processing**: OpenCV, NumPy

### AI/ML Pipeline
- **Facial Analysis**: FaceNet, Custom Skin Tone/Face Shape classifiers
- **Recommendations**: LangChain, ChromaDB (Vector Database)
- **Generative AI**: Stable Diffusion, ControlNet, Diffusers

## 📦 Project Structure

```
Aiva/
├── backend/                 # FastAPI Server & Logic
│   ├── main.py             # API Entry point
│   └── requirements.txt    # Python dependencies
├── frontend/                # React Application
│   ├── src/                # Frontend source code
│   └── package.json        # Node.js dependencies
├── facial features component/ # Standalone facial analysis logic
├── recommendations component/ # Recommendation engine logic
└── VR component/            # Stable Diffusion generation logic
```
<<<<<<< HEAD

## ⚡ Getting Started

### Prerequisites
- Python 3.9+
- Node.js & npm
- (Optional) NVIDIA GPU for faster AI generation

### 1. Setup Backend
The backend handles all AI operations.

```bash
# 1. Navigate to the project root
cd Aiva

# 2. Install Python dependencies
pip install -r backend/requirements.txt

# 3. Start the Server (Run from ROOT directory)
python -m uvicorn backend.main:app --reload
```
*Server will start at `http://localhost:8000`*

> **Note**: If you get a "ModuleNotFoundError", ensure you are running the command from the **root** `Aiva` folder, NOT inside `backend`.

### 2. Setup Frontend
The frontend is the user interface.

```bash
# 1. Open a NEW terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start React App
npm run dev
```
*App will open at `http://localhost:5173`*

### 3. Login
We use a **Mock Authentication** system for demonstration.
- **Email**: `admin@aiva.com` (or any email)
- **Password**: `password` (or any password)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
=======
