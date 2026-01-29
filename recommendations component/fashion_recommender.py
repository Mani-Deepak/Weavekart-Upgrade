import os
import sys
import json
import pandas as pd
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from keywords import FashionAttributeExtractor

# --- ROBUST PATH ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_CSV_PATH = os.path.join(SCRIPT_DIR, "outfits_60_dataset_with_gender.csv")

# Initialize embeddings model (singleton pattern)
_embeddings = None
_vectorstore = None
_extractor = None

def get_embeddings():
    """Get or initialize embeddings model"""
    global _embeddings
    if _embeddings is None:
        try:
            print("[INFO] Loading HuggingFace embeddings model...")
            _embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            print("[SUCCESS] HuggingFace Embeddings Model loaded.")
        except Exception as e:
            print(f"[ERROR] Error loading embeddings: {e}")
            raise
    return _embeddings

def get_extractor():
    """Get or initialize fashion attribute extractor"""
    global _extractor
    if _extractor is None:
        print("[INFO] Initializing Fashion Attribute Extractor...")
        _extractor = FashionAttributeExtractor()
        print("[SUCCESS] Fashion Attribute Extractor initialized.")
    return _extractor

def initialize_vectorstore_from_csv(csv_path):
    """Initialize vector store from outfit CSV file"""
    global _vectorstore

    try:
        embeddings = get_embeddings()

        try:
            df = pd.read_csv(csv_path)
            print(f"[INFO] CSV loaded with {len(df)} outfits")
        except FileNotFoundError:
            print(f"[ERROR] CSV file not found at {csv_path}")
            return None

        df = df.fillna('')

        if df.empty:
            print(f"[WARNING] No outfits found in {csv_path}")
            return None
        
        print(f"[INFO] Loading {len(df)} outfits from {csv_path} into vector store...")

        docs = []
        for i, outfit in df.iterrows():
            # Create rich content for better matching using the semantic_text field
            # and other attributes
            content = (
                f"{outfit['semantic_text']}\n"
                f"Product: {outfit['name']} ({outfit['category']})\n"
                f"Gender: {outfit['gender']}\n"
                f"Occasions: {outfit['occasions']}\n"
                f"Seasons: {outfit['seasons']}\n"
                f"Places: {outfit['places']}\n"
                f"Styles: {outfit['styles']}\n"
                f"Fabric: {outfit['fabric']}\n"
                f"Colors: {outfit['colors']}\n"
                f"Suitable for body types: {outfit['suitable_body_types']}\n"
                f"Suitable for skin tones: {outfit['suitable_skin_tones']}\n"
                f"Origin: {outfit['origin']}\n"
                f"Rating: {outfit['rating']}/5\n"
                f"Price: ₹{outfit['price']}"
            )

            doc = Document(
                page_content=content,
                metadata={
                    "product_id": str(outfit['product_id']),
                    "name": str(outfit['name']),
                    "gender": str(outfit['gender']),
                    "category": str(outfit['category']),
                    "occasions": str(outfit['occasions']),
                    "seasons": str(outfit['seasons']),
                    "places": str(outfit['places']),
                    "styles": str(outfit['styles']),
                    "fabric": str(outfit['fabric']),
                    "colors": str(outfit['colors']),
                    "suitable_body_types": str(outfit['suitable_body_types']),
                    "suitable_skin_tones": str(outfit['suitable_skin_tones']),
                    "origin": str(outfit['origin']),
                    "weaver_name": str(outfit['weaver_name']),
                    "rating": float(outfit['rating']),
                    "price": int(outfit['price']),
                    "semantic_text": str(outfit['semantic_text'])
                }
            )
            docs.append(doc)

        print("[INFO] Creating Chroma vector store...")
        # Persist vector store to disk for faster startup on subsequent runs
        persist_dir = os.path.join(SCRIPT_DIR, "chroma_db")
        _vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            persist_directory=persist_dir
        )
        print("[SUCCESS] Vector store created successfully.")
        return _vectorstore

    except KeyError as e:
        print(f"[ERROR] Missing column in CSV file: {e}")
        print("Ensure your CSV has the required columns")
        return None
    except Exception as e:
        print(f"[ERROR] Error creating vector store: {e}")
        import traceback
        traceback.print_exc()
        raise

def get_vectorstore():
    """Get or initialize vector store"""
    global _vectorstore
    if _vectorstore is None:
        _vectorstore = initialize_vectorstore_from_csv(DEFAULT_CSV_PATH)
    return _vectorstore

def get_outfit_recommendations(user_description, top_n=10, gender_filter=None):
    """
    Get outfit recommendations based on user description using semantic search
    
    Args:
        user_description (str): Natural language description of what the user wants
        top_n (int): Number of recommendations to return
        gender_filter (str): Optional filter for gender ('Male', 'Female', 'Unisex', or None for all)
    
    Returns:
        list: List of outfit recommendations with matching scores
    """
    try:
        vectorstore = get_vectorstore()
        extractor = get_extractor()

        if vectorstore is None:
            return {"error": "Vector store not initialized or CSV file not found/empty"}

        # Extract attributes from user description
        print(f"\n{'='*60}")
        print(f"[INFO] Extracting attributes from user description...")
        print(f"{'='*60}")
        extracted_attrs = extractor.extract(user_description)
        print(json.dumps(extracted_attrs, indent=2))
        print(f"{'='*60}\n")

        # Build search query from extracted attributes and original description
        query_parts = [user_description]  # Start with original description
        
        # Add extracted attributes to enhance the query
        if extracted_attrs['suitable_body_types']:
            query_parts.append(f"Body type: {', '.join(extracted_attrs['suitable_body_types'])}")
        
        if extracted_attrs['suitable_skin_tones']:
            query_parts.append(f"Skin tone: {', '.join(extracted_attrs['suitable_skin_tones'])}")
        
        if extracted_attrs['occasions']:
            query_parts.append(f"Occasions: {', '.join(extracted_attrs['occasions'])}")
        
        if extracted_attrs['seasons']:
            query_parts.append(f"Seasons: {', '.join(extracted_attrs['seasons'])}")
        
        if extracted_attrs['places']:
            query_parts.append(f"Places: {', '.join(extracted_attrs['places'])}")
        
        if extracted_attrs['styles']:
            query_parts.append(f"Styles: {', '.join(extracted_attrs['styles'])}")
        
        if extracted_attrs['fabric']:
            query_parts.append(f"Fabrics: {', '.join(extracted_attrs['fabric'])}")
        
        if extracted_attrs['colors']:
            query_parts.append(f"Colors: {', '.join(extracted_attrs['colors'])}")

        search_query = "\n".join(query_parts)
        
        print(f"[DEBUG] Search Query:")
        print(f"{'='*60}")
        print(search_query)
        print(f"{'='*60}\n")

        # Perform similarity search
        print(f"[INFO] Searching for top {top_n} matches...")
        matched_docs_and_scores = vectorstore.similarity_search_with_score(search_query, k=top_n * 2)  # Get more to filter
        
        print(f"[SUCCESS] Found {len(matched_docs_and_scores)} matches")
        
        # Debug: Print raw scores
        print(f"\n[DEBUG] Raw similarity scores:")
        for idx, (doc, score) in enumerate(matched_docs_and_scores[:5]):
            print(f"  Match {idx+1}: {doc.metadata.get('name', 'Unknown')} - Score: {score:.4f}")

        recommendations = []
        for doc, score in matched_docs_and_scores:
            outfit_dict = doc.metadata.copy()

            # Apply gender filter if specified
            if gender_filter and outfit_dict['gender'] not in [gender_filter, 'Unisex']:
                continue

            # Convert L2 distance to similarity percentage
            # Chroma uses L2 distance by default, where smaller = more similar
            if score < 0.5:
                similarity_percentage = 100
            elif score < 1.0:
                similarity_percentage = 100 - (score * 50)  # 0.5 -> 75%, 1.0 -> 50%
            else:
                similarity_percentage = max(0, 50 - ((score - 1.0) * 25))  # 1.5 -> 37.5%, 2.0 -> 25%

            outfit_dict['matching_percentage'] = round(similarity_percentage, 2)
            outfit_dict['raw_distance'] = round(float(score), 4)
            outfit_dict['extracted_attributes'] = extracted_attrs

            recommendations.append(outfit_dict)
            
            # Stop when we have enough recommendations after filtering
            if len(recommendations) >= top_n:
                break

        # Sort by matching percentage (highest first)
        recommendations.sort(key=lambda x: x['matching_percentage'], reverse=True)

        print(f"\n[DEBUG] Top 5 recommendations:")
        for idx, rec in enumerate(recommendations[:5]):
            print(f"  {idx+1}. {rec.get('name')} ({rec.get('category')}) - {rec['matching_percentage']}%")
            print(f"      Styles: {rec.get('styles')}, Colors: {rec.get('colors')}")

        return recommendations

    except Exception as e:
        print(f"[ERROR] Error in recommendation logic: {e}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

if __name__ == "__main__":
    # Example usage
    print("\n" + "="*80)
    print("FASHION RECOMMENDATION SYSTEM")
    print("="*80 + "\n")
    
    user_description = """
    Hi, I have a pear shaped body and olive skin. I am looking for something 
    to wear to a beach wedding in the summer. I love boho styles and prefer 
    breathable fabrics like linen or cotton. Please avoid black, I want bright colors like yellow or teal.
    """
    
    print(f"User Description:\n{user_description}\n")
    
    recommendations = get_outfit_recommendations(user_description, top_n=5)
    
    if isinstance(recommendations, dict) and "error" in recommendations:
        print(f"[ERROR] {recommendations['error']}")
    else:
        print("\n" + "="*80)
        print("RECOMMENDATIONS")
        print("="*80 + "\n")
        
        for idx, outfit in enumerate(recommendations, 1):
            print(f"{idx}. {outfit['name']} ({outfit['product_id']})")
            print(f"   Category: {outfit['category']}")
            print(f"   Gender: {outfit['gender']}")
            print(f"   Match Score: {outfit['matching_percentage']}%")
            print(f"   Occasions: {outfit['occasions']}")
            print(f"   Seasons: {outfit['seasons']}")
            print(f"   Places: {outfit['places']}")
            print(f"   Styles: {outfit['styles']}")
            print(f"   Fabric: {outfit['fabric']}")
            print(f"   Colors: {outfit['colors']}")
            print(f"   Body Types: {outfit['suitable_body_types']}")
            print(f"   Skin Tones: {outfit['suitable_skin_tones']}")
            print(f"   Price: ₹{outfit['price']}")
            print(f"   Rating: {outfit['rating']}/5")
            print(f"   Origin: {outfit['origin']} (by {outfit['weaver_name']})")
            print()
        
        # Save to JSON file
        output_file = "recommendations.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(recommendations, f, indent=2)
        print(f"[SUCCESS] Recommendations saved to {output_file}")
