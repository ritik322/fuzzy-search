import sys
import json
import re
from rapidfuzz import fuzz
import jellyfish
from transformers import BertTokenizer, BertModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from googletrans import Translator

# Initialize models only once
test_model = SentenceTransformer('shahrukhx01/paraphrase-mpnet-base-v2-fuzzy-matcher')

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

def get_embedding(text):
    inputs = bert_tokenizer(text, return_tensors='pt', padding=True, truncation=True)
    outputs = bert_model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1).detach()
    return embeddings

def bert_similarity(name1, name2):
    embedding1 = get_embedding(name1)
    embedding2 = get_embedding(name2)
    cosine_sim = cosine_similarity(embedding1, embedding2).item()
    return cosine_sim * 100

def calculate_test_model_similarity(name1, name2):
    word1 = " ".join([char for char in name1])  # Char-level segmentation
    word2 = " ".join([char for char in name2])
    fuzzy_embeddings = test_model.encode([word1, word2])
    test_model_similarity = util.cos_sim(fuzzy_embeddings[0], fuzzy_embeddings[1])
    return test_model_similarity.item() * 100

def calculate_sbert_similarity(name1, name2):
    embeddings1 = sbert_model.encode(name1)
    embeddings2 = sbert_model.encode(name2)
    sbert_similarity = util.cos_sim(embeddings1, embeddings2).item()
    return sbert_similarity * 100

def combined_similarity(name1, name2):
    traditional_score = traditional_similarity(name1, name2)
    test_model_score = calculate_test_model_similarity(name1, name2)
    ml_score = test_model_score * 1
    final_score = (0.6 * traditional_score) + (0.4 * ml_score)
    return final_score

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
