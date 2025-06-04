import sqlite3
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

class AnimeDatabase:
    def __init__(self, db_path: str = "anime.db"):
        """
        Initialize the anime database.
        
        Args:
            db_path (str): Path to the SQLite database file
        """
        self.db_path = db_path
        self._create_tables()
    
    def _create_tables(self):
        """Create necessary database tables if they don't exist."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Favorites table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS favorites (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    anime_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, anime_id)
                )
            ''')
            
            # Watched table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS watched (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    anime_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
                    UNIQUE(user_id, anime_id)
                )
            ''')
            
            # Recommendations table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS recommendations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    anime_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    recommended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_viewed BOOLEAN DEFAULT 0
                )
            ''')
            
            conn.commit()
    
    def add_favorite(self, user_id: str, anime_id: int, title: str) -> bool:
        """
        Add an anime to user's favorites.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            title (str): Anime title
            
        Returns:
            bool: True if added successfully, False otherwise
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO favorites (user_id, anime_id, title) VALUES (?, ?, ?)",
                    (user_id, anime_id, title)
                )
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False
    
    def remove_favorite(self, user_id: str, anime_id: int) -> bool:
        """
        Remove an anime from user's favorites.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            
        Returns:
            bool: True if removed successfully, False otherwise
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM favorites WHERE user_id = ? AND anime_id = ?",
                (user_id, anime_id)
            )
            conn.commit()
            return cursor.rowcount > 0
    
    def add_watched(self, user_id: str, anime_id: int, title: str, rating: Optional[int] = None) -> bool:
        """
        Add an anime to user's watched list.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            title (str): Anime title
            rating (Optional[int]): User's rating (1-10)
            
        Returns:
            bool: True if added successfully, False otherwise
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO watched (user_id, anime_id, title, rating) VALUES (?, ?, ?, ?)",
                    (user_id, anime_id, title, rating)
                )
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False
    
    def update_watched_rating(self, user_id: str, anime_id: int, rating: int) -> bool:
        """
        Update the rating for a watched anime.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            rating (int): New rating (1-10)
            
        Returns:
            bool: True if updated successfully, False otherwise
        """
        if not 1 <= rating <= 10:
            return False
            
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE watched SET rating = ? WHERE user_id = ? AND anime_id = ?",
                (rating, user_id, anime_id)
            )
            conn.commit()
            return cursor.rowcount > 0
    
    def add_recommendation(self, user_id: str, anime_id: int, title: str) -> bool:
        """
        Add an anime recommendation for a user.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            title (str): Anime title
            
        Returns:
            bool: True if added successfully, False otherwise
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO recommendations (user_id, anime_id, title) VALUES (?, ?, ?)",
                    (user_id, anime_id, title)
                )
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False
    
    def get_user_favorites(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get user's favorite animes.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            List[Dict[str, Any]]: List of favorite animes
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT anime_id, title, added_at FROM favorites WHERE user_id = ? ORDER BY added_at DESC",
                (user_id,)
            )
            return [
                {
                    "anime_id": row[0],
                    "title": row[1],
                    "added_at": row[2]
                }
                for row in cursor.fetchall()
            ]
    
    def get_user_watched(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get user's watched animes.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            List[Dict[str, Any]]: List of watched animes
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT anime_id, title, watched_at, rating FROM watched WHERE user_id = ? ORDER BY watched_at DESC",
                (user_id,)
            )
            return [
                {
                    "anime_id": row[0],
                    "title": row[1],
                    "watched_at": row[2],
                    "rating": row[3]
                }
                for row in cursor.fetchall()
            ]
    
    def get_user_recommendations(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get user's anime recommendations.
        
        Args:
            user_id (str): User identifier
            limit (int): Maximum number of recommendations to return
            
        Returns:
            List[Dict[str, Any]]: List of recommendations
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT anime_id, title, recommended_at, is_viewed 
                FROM recommendations 
                WHERE user_id = ? 
                ORDER BY recommended_at DESC 
                LIMIT ?
                """,
                (user_id, limit)
            )
            return [
                {
                    "anime_id": row[0],
                    "title": row[1],
                    "recommended_at": row[2],
                    "is_viewed": bool(row[3])
                }
                for row in cursor.fetchall()
            ]
    
    def mark_recommendation_viewed(self, user_id: str, anime_id: int) -> bool:
        """
        Mark a recommendation as viewed.
        
        Args:
            user_id (str): User identifier
            anime_id (int): Anime identifier
            
        Returns:
            bool: True if marked successfully, False otherwise
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE recommendations SET is_viewed = 1 WHERE user_id = ? AND anime_id = ?",
                (user_id, anime_id)
            )
            conn.commit()
            return cursor.rowcount > 0
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's anime statistics.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            Dict[str, Any]: User statistics
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Get counts
            cursor.execute("SELECT COUNT(*) FROM favorites WHERE user_id = ?", (user_id,))
            favorites_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM watched WHERE user_id = ?", (user_id,))
            watched_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM recommendations WHERE user_id = ? AND is_viewed = 0", (user_id,))
            unviewed_recommendations = cursor.fetchone()[0]
            
            # Get average rating
            cursor.execute("SELECT AVG(rating) FROM watched WHERE user_id = ? AND rating IS NOT NULL", (user_id,))
            avg_rating = cursor.fetchone()[0] or 0
            
            return {
                "favorites_count": favorites_count,
                "watched_count": watched_count,
                "unviewed_recommendations": unviewed_recommendations,
                "average_rating": round(avg_rating, 2) if avg_rating else 0
            }
    
    def delete_user_data(self, user_id: str) -> bool:
        """
        Delete all anime-related data for a user.
        This should be called when a user is deleted from the main user database.
        
        Args:
            user_id (str): User identifier
            
        Returns:
            bool: True if all data was deleted successfully
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                # Delete from all tables
                cursor.execute("DELETE FROM favorites WHERE user_id = ?", (user_id,))
                cursor.execute("DELETE FROM watched WHERE user_id = ?", (user_id,))
                cursor.execute("DELETE FROM recommendations WHERE user_id = ?", (user_id,))
                conn.commit()
                return True
        except Exception:
            return False
