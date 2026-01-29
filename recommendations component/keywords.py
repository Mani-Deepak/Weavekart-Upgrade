import spacy
from spacy.pipeline import EntityRuler
import json

class FashionAttributeExtractor:
    def __init__(self):
        # 1. Load the small English model
        self.nlp = spacy.load("en_core_web_sm")
        
        # 2. Initialize EntityRuler to add custom logic
        # We place it before 'ner' so our rules take precedence
        if "entity_ruler" not in self.nlp.pipe_names:
            self.ruler = self.nlp.add_pipe("entity_ruler", before="ner")
        else:
            self.ruler = self.nlp.get_pipe("entity_ruler")
            
        # 3. Define the Knowledge Base (The "Brain")
        # You can expand these lists with as many synonyms as needed
        self.patterns = self._build_patterns({
            "SUITABLE_BODY_TYPE": ["hourglass", "pear", "apple", "rectangle", "inverted triangle", "athletic", "petite", "curvy", "tall", "plus size"],
            "SUITABLE_SKIN_TONE": ["fair", "pale", "light", "medium", "olive", "tan", "dark", "deep", "warm tone", "cool tone", "neutral tone"],
            "OCCASION": ["wedding", "party", "office", "work", "casual", "formal", "date", "gym", "cocktail", "business", "festival", "interview", "brunch"],
            "SEASON": ["summer", "winter", "spring", "autumn", "fall", "rainy", "monsoon", "hot", "cold"],
            "PLACE": ["beach", "city", "mountain", "resort", "countryside", "club", "home", "outdoor", "indoor"],
            "STYLE": ["boho", "bohemian", "minimalist", "vintage", "streetwear", "classic", "chic", "preppy", "grunge", "elegant", "retro", "avant-garde"],
            "FABRIC": ["cotton", "silk", "wool", "linen", "polyester", "denim", "leather", "velvet", "chiffon", "satin", "nylon", "cashmere", "rayon"],
            "COLOR": ["red", "blue", "green", "black", "white", "beige", "navy", "pink", "pastel", "yellow", "purple", "orange", "gold", "silver", "teal"]
        })
        
        self.ruler.add_patterns(self.patterns)

    def _build_patterns(self, taxonomy):
        """Converts simple lists into Spacy patterns."""
        patterns = []
        for label, keywords in taxonomy.items():
            for keyword in keywords:
                # Add pattern for exact match (case insensitive)
                patterns.append({"label": label, "pattern": [{"LOWER": keyword.lower()}]})
                # Handle multi-word patterns specifically if needed (simple split here)
                if " " in keyword:
                    token_pattern = [{"LOWER": t.lower()} for t in keyword.split()]
                    patterns.append({"label": label, "pattern": token_pattern})
        return patterns

    def extract(self, text):
        doc = self.nlp(text)
        
        # Initialize output structure
        results = {
            "suitable_body_types": [],
            "suitable_skin_tones": [],
            "occasions": [],
            "seasons": [],
            "places": [],
            "styles": [],
            "fabric": [],
            "colors": []
        }
        
        # Map internal labels to user requested keys
        label_map = {
            "SUITABLE_BODY_TYPE": "suitable_body_types",
            "SUITABLE_SKIN_TONE": "suitable_skin_tones",
            "OCCASION": "occasions",
            "SEASON": "seasons",
            "PLACE": "places",
            "STYLE": "styles",
            "FABRIC": "fabric",
            "COLOR": "colors"
        }

        # Extract entities
        for ent in doc.ents:
            if ent.label_ in label_map:
                key = label_map[ent.label_]
                # Avoid duplicates
                if ent.text.lower() not in results[key]:
                    results[key].append(ent.text.lower())
                    
        return results

# --- Usage Example ---
if __name__ == "__main__":
    extractor = FashionAttributeExtractor()
    
    user_description = """
    i want a dress for a wedding in the summer in gujarat.i have round face and fair skin
    """
    
    details = extractor.extract(user_description)
    
    # Save to recommendations.json
    with open("recommendations.json", "w") as f:
        json.dump(details, f, indent=2)
    
    print("Recommendations saved to recommendations.json")
    print(json.dumps(details, indent=2))