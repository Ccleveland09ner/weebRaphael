import spacy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
import aiohttp
from dotenv import load_dotenv
from typing import List, Dict, Any, Tuple, Set
from aiohttp import ClientTimeout

load_dotenv()

anime_api_url = os.getenv("ANIME_API_URL")
if not anime_api_url:
    raise ValueError("ANIME_API_URL environment variable is not set")

nlp = spacy.load("en_core_web_sm")

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
    """
    Extract adjectives and nouns from user input using spaCy.
    
    Args:
        user_input (str): The input text to analyze
        
    Returns:
        Tuple[Set[str], Set[str]]: A tuple containing sets of adjectives and nouns
        
    Raises:
        ValueError: If input is empty or None
    """
    if not user_input or not user_input.strip():
        raise ValueError("Input text cannot be empty")
        
    doc = nlp(user_input.lower())
    adjectives, nouns = set(), set()
    for token in doc:
        if token.pos_ == "ADJ":
            adjectives.add(token.text)
        elif token.pos_ == "NOUN":
            nouns.add(token.text)
    return adjectives, nouns

def map_to_genre(keywords: Set[str], threshold: float = 0.5) -> List[str]:
    """
    Map keywords to anime genres using cosine similarity.
    
    Args:
        keywords (Set[str]): Set of keywords to map
        threshold (float): Similarity threshold for genre matching
        
    Returns:
        List[str]: List of matched genres
        
    Raises:
        ValueError: If keywords set is empty
    """
    if not keywords:
        raise ValueError("Keywords set cannot be empty")
        
    user_vec = nlp(" ".join(keywords)).vector
    matched_genres = []
    for genre, words in genre_map.items():
        genre_vec = nlp(" ".join(words)).vector
        score = cosine_similarity([user_vec], [genre_vec])[0][0]

        if score >= threshold:
            matched_genres.append((genre, score))
    matched_genres.sort(key=lambda x: x[1], reverse=True)

    return [genre for genre, _ in matched_genres] if matched_genres else ["miscellaneous"]

async def get_anime_data(genre: str, page: int = 1, per_page: int = 10) -> List[Dict[str, Any]]:
    """
    Fetch anime data from the API based on genre.
    
    Args:
        genre (str): Genre to search for
        page (int): Page number for pagination
        per_page (int): Number of items per page
        
    Returns:
        List[Dict[str, Any]]: List of anime data
        
    Raises:
        Exception: If API request fails
    """
    query = '''
    query ($genre: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(genre: $genre, type: ANIME, sort: SCORE_DESC) {
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
            }
        }
    }
    '''
    variables = {
        "genre": genre,
        "page": page,
        "perPage": per_page
    }
    
    timeout = ClientTimeout(total=30)  # 30 seconds timeout
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.post(anime_api_url, json={"query": query, "variables": variables}) as response:
                if response.status == 200:
                    data = await response.json()
                    return data['data']['Page']['media']
                else:
                    error_text = await response.text()
                    raise Exception(f"Error fetching anime data: {response.status} - {error_text}")
        except aiohttp.ClientError as e:
            raise Exception(f"Network error while fetching anime data: {str(e)}")
            
async def get_anime_recommendations(user_input: str, page: int = 1, per_page: int = 10) -> List[Dict[str, Any]]:
    """
    Get anime recommendations based on user input.
    
    Args:
        user_input (str): User's description or preferences
        page (int): Page number for pagination
        per_page (int): Number of items per page
        
    Returns:
        List[Dict[str, Any]]: List of anime recommendations
        
    Raises:
        ValueError: If user_input is invalid
    """
    if not user_input or not user_input.strip():
        raise ValueError("User input cannot be empty")
        
    try:
        adjectives, nouns = extract_keywords(user_input)
        mapped_genres = map_to_genre(adjectives.union(nouns))
        anime_list = await get_anime_data(mapped_genres[0], page, per_page)
        
        if anime_list:
            recommendations = []
            for anime in anime_list:
                recommendations.append({
                    "anime_id": anime["id"],
                    "title": anime["title"]["romaji"] or anime["title"]["english"],
                    "description": anime["description"],
                    "cover_image": anime["coverImage"]["large"],
                    "rating": anime["averageScore"] / 10 if anime["averageScore"] else None,
                    "genres": anime["genres"],
                    "popularity": anime["popularity"]
                })
            return recommendations
        else:
            return [{"message": f"No recommendations found for: {user_input}"}]
    except Exception as e:
        return [{"error": f"Failed to get recommendations: {str(e)}"}]