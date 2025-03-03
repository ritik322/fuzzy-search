import sys
import json
from rapidfuzz import fuzz
import jellyfish
from googletrans import Translator
import re
translator = Translator()

def is_english(name):
    """Check if the name contains only English characters."""
    return bool(re.match(r'^[a-zA-Z\s]+$', name))

def phonetic_similarity(name1, name2):
    soundex1 = jellyfish.soundex(name1)
    soundex2 = jellyfish.soundex(name2)
    metaphone1 = jellyfish.metaphone(name1)
    metaphone2 = jellyfish.metaphone(name2)
    
    soundex_similarity = fuzz.ratio(soundex1, soundex2)
    metaphone_similarity = fuzz.ratio(metaphone1, metaphone2)
    
    phonetic_score = (soundex_similarity + metaphone_similarity * 3) / 4
    return phonetic_score

def traditional_similarity(name1, name2):
    levenshtein_score = fuzz.ratio(name1, name2)
    jaro_winkler_score = jellyfish.jaro_similarity(name1, name2) * 100
    phonetic_score = phonetic_similarity(name1, name2)
    total_score = (0.5 * levenshtein_score) + (0.3 * jaro_winkler_score) + (0.2 * phonetic_score)
    return total_score

def combined_similarity(name1, name2):
    traditional_score = traditional_similarity(name1, name2)
    return traditional_score

def translate_to_english(name):
    """Translate the input name to English."""
    if is_english(name):
        return name
    try:
        translated = translator.translate(name, dest='en')
        return translated.text
    except Exception as e:
        return name  # If translation fails, return the original name

# Main function to handle command-line arguments and produce JSON output
if __name__ == "__main__":
    # Get command-line arguments
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Insufficient arguments. Provide two names to compare."}))
        sys.exit(1)
    
    name1 = sys.argv[1]
    criminals = json.loads(sys.argv[2])
    
    results = []

    translated_input_name = translate_to_english(name1)
    
    for criminal in criminals:
        criminal_name = criminal['name']  # Assume each criminal has a 'name' field
        score = combined_similarity(translated_input_name, criminal_name)
        criminal["score"] = score
        # Prepare the output data
        result = {
            "criminal_data": criminal  # Include all other data associated with the criminal
        }
        results.append(result)
        
    print(json.dumps(results))  # Output JSON-formatted string
