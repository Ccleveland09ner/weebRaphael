from typing import Any, Optional, Dict
import time
from config import settings
from exceptions import CacheError
import logging

logger = logging.getLogger(__name__)

class Cache:
    def __init__(self, ttl: int = settings.CACHE_TTL, max_size: int = settings.CACHE_MAX_SIZE):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._ttl = ttl
        self._max_size = max_size
    
    def _is_expired(self, timestamp: float) -> bool:
        return time.time() - timestamp > self._ttl
    
    def _cleanup(self):
        """Remove expired entries and enforce max size."""
        current_time = time.time()
        expired_keys = [
            key for key, data in self._cache.items()
            if self._is_expired(data['timestamp'])
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        if len(self._cache) > self._max_size:
            # Remove oldest entries
            sorted_items = sorted(
                self._cache.items(),
                key=lambda x: x[1]['timestamp']
            )
            for key, _ in sorted_items[:len(self._cache) - self._max_size]:
                del self._cache[key]
    
    def get(self, key: str) -> Optional[Any]:
        """Get a value from the cache."""
        try:
            if key not in self._cache:
                return None
            
            data = self._cache[key]
            if self._is_expired(data['timestamp']):
                del self._cache[key]
                return None
            
            return data['value']
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {str(e)}")
            raise CacheError(f"Failed to get cache key: {str(e)}")
    
    def set(self, key: str, value: Any) -> None:
        """Set a value in the cache."""
        try:
            self._cleanup()
            self._cache[key] = {
                'value': value,
                'timestamp': time.time()
            }
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {str(e)}")
            raise CacheError(f"Failed to set cache key: {str(e)}")
    
    def delete(self, key: str) -> None:
        """Delete a value from the cache."""
        try:
            if key in self._cache:
                del self._cache[key]
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {str(e)}")
            raise CacheError(f"Failed to delete cache key: {str(e)}")
    
    def clear(self) -> None:
        """Clear all values from the cache."""
        try:
            self._cache.clear()
        except Exception as e:
            logger.error(f"Error clearing cache: {str(e)}")
            raise CacheError(f"Failed to clear cache: {str(e)}")
    
    def get_stats(self) -> Dict[str, int]:
        """Get cache statistics."""
        return {
            'size': len(self._cache),
            'max_size': self._max_size,
            'ttl': self._ttl
        }

# Create a global cache instance
cache = Cache() 