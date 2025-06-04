import spacy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import aiohttp
from typing import List, Dict, Any, Tuple, Set
from aiohttp import ClientTimeout
from config import settings

# Initialize spaCy with a simpler model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback to blank English model if spaCy model is not available
    nlp = spacy.blank("en")

anime_api_url = settings.ANIME_API_URL

genre_map = {
    "action": ["fast-paced", "battle", "combat", "war", "hero", "explosions", "fight"],
    "romance": ["love", "relationship", "heartfelt", "emotion", "affection", "couple", "drama"],
    "fantasy": ["magic", "myth", "dragons", "adventure", "kingdom", "elf", "wizard", "supernatural"],
    "sci-fi": ["futuristic", "space", "technology", "AI", "robot", "cyber", "dystopian"],
    "slice_of_life": ["everyday", "school", "realistic", "ordinary", "friendship", "daily", "nostalgic"],
    "sports": ["competition", "team", "athletic", "training", "victory", "tournament"],
    "thriller": ["suspense", "intense", "dark", "mystery", "chase", "crime", "danger"],
    "mystery": ["detective", "investigation", "crime", "riddle", "twist", "unknown"],
    "psychological": ["mindgame", "mental", "strategy", "complex", "unsettling", "dark"],
    "supernatural": ["ghost", "paranormal", "spirit", "otherworldly", "mystical", "unknown"],
    "magic": ["wizard", "spell", "enchantment", "arcane", "sorcery", "alchemy"],
    "mecha": ["robot", "mechanical", "giant", "powerful", "engineered", "cyborg"],
    "isekai": ["other world", "reincarnation", "parallel universe", "fantasy realm"],
    "historical": ["past", "samurai", "tradition", "warrior", "dynasty", "legend"],
    "shounen": ["young male", "action-packed", "heroic", "growth", "adventure", "fighting"],
    "shoujo": ["young female", "romance", "drama", "sweet", "emotional", "friendship"],
    "seinen": ["mature male", "complex", "gritty", "psychological", "dark", "intense"],
    "josei": ["mature female", "realistic", "romance", "life", "work", "relationships"]
}

def extract_keywords(user_input: str) -> Tuple[Set[str], Set[str]]:
    """Extract keywords from user input."""
    if not user_input or not user_input.strip():
        raise ValueError("Input text cannot be empty")
    
    doc = nlp(user_input.lower())
    keywords = set()
    
    # Extract both adjectives and nouns, plus any words that match our genre keywords
    all_genre_words = set()
    for words in genre_map.values():
        all_genre_words.update(words)
    
    for token in doc:
        if token.pos_ in ["ADJ", "NOUN"] or token.text in all_genre_words:
            keywords.add(token.text)
    
    # If no keywords found, use the entire input
    if not keywords:
        keywords = set(user_input.lower().split())
    
    return keywords, keywords

def map_to_genre(keywords: Set[str], threshold: float = 0.3) -> List[str]:
    """Map keywords to anime genres."""
    if not keywords:
        return ["action"]  # Default genre if no keywords found
    
    # Convert keywords to a string for vectorization
    keywords_text = " ".join(keywords)
    keywords_vec = nlp(keywords_text).vector
    
    genre_scores = []
    for genre, related_words in genre_map.items():
        genre_text = " ".join(related_words)
        genre_vec = nlp(genre_text).vector
        
        # Calculate similarity
        similarity = cosine_similarity([keywords_vec], [genre_vec])[0][0]
        if similarity >= threshold:
            genre_scores.append((genre, similarity))
    
    # Sort by similarity score
    genre_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Return top 3 genres or "action" if no matches
    matched_genres = [genre for genre, _ in genre_scores[:3]]
    return matched_genres if matched_genres else ["action"]

async def get_anime_data(genres: List[str], page: int = 1, per_page: int = 10) -> List[Dict[str, Any]]:
    """Fetch anime data from the API."""
    query = '''
    query ($genre: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                    romaji
                    english
                }
                description
                coverImage {
                    large
                    medium
                }
                averageScore
                genres
                popularity
                status
            }
        }
    }
    '''
    
    all_results = []
    timeout = ClientTimeout(total=30)
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        for genre in genres:
            variables = {
                "genre": genre,
                "page": page,
                "perPage": per_page
            }
            
            try:
                async with session.post(anime_api_url, json={"query": query, "variables": variables}) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('data', {}).get('Page', {}).get('media'):
                            all_results.extend(data['data']['Page']['media'])
            except Exception as e:
                print(f"Error fetching anime for genre {genre}: {str(e)}")
                continue
    
    # Remove duplicates and sort by popularity
    seen_ids = set()
    unique_results = []
    for anime in all_results:
        if anime['id'] not in seen_ids:
            seen_ids.add(anime['id'])
            unique_results.append(anime)
    
    return sorted(unique_results, key=lambda x: x.get('popularity', 0), reverse=True)[:per_page]

async def get_anime_recommendations(user_input: str, page: int = 1, per_page: int = 10) -> List[Dict[str, Any]]:
    """Get anime recommendations based on user input."""
    try:
        # Extract keywords and map to genres
        keywords, _ = extract_keywords(user_input)
        matched_genres = map_to_genre(keywords)
        
        # Get anime data for all matched genres
        anime_list = await get_anime_data(matched_genres, page, per_page)
        
        if anime_list:
            return [
                {
                    "anime_id": anime["id"],
                    "title": anime["title"]["english"] or anime["title"]["romaji"],
                    "description": anime["description"],
                    "cover_image": anime["coverImage"]["large"],
                    "rating": anime["averageScore"] / 10 if anime["averageScore"] else None,
                    "genres": anime["genres"],
                    "popularity": anime["popularity"]
                }
                for anime in anime_list
            ]
        
        return [{"message": f"No recommendations found for: {user_input}"}]
    except Exception as e:
        return [{"error": f"Failed to get recommendations: {str(e)}"}]