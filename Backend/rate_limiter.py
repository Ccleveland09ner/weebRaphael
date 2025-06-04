from typing import Dict, Tuple
import time
from collections import defaultdict
from config import settings
from exceptions import RateLimitExceededError
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        self._requests: Dict[str, list] = defaultdict(list)
        self._user_limits: Dict[str, int] = defaultdict(lambda: settings.RATE_LIMIT_PER_USER)
    
    def _cleanup_old_requests(self, key: str, window: int):
        """Remove requests older than the time window."""
        current_time = time.time()
        self._requests[key] = [
            req_time for req_time in self._requests[key]
            if current_time - req_time < window
        ]
    
    def check_rate_limit(self, key: str, window: int = 60) -> Tuple[bool, int]:
        """
        Check if a request should be rate limited.
        
        Args:
            key: The key to rate limit (IP or user ID)
            window: Time window in seconds
            
        Returns:
            Tuple[bool, int]: (is_allowed, remaining_requests)
        """
        try:
            self._cleanup_old_requests(key, window)
            limit = self._user_limits[key]
            current_requests = len(self._requests[key])
            
            if current_requests >= limit:
                return False, 0
            
            return True, limit - current_requests
        except Exception as e:
            logger.error(f"Error checking rate limit for {key}: {str(e)}")
            return True, 0  # Fail open in case of errors
    
    def add_request(self, key: str):
        """Add a request to the rate limiter."""
        try:
            self._requests[key].append(time.time())
        except Exception as e:
            logger.error(f"Error adding request for {key}: {str(e)}")
    
    def set_user_limit(self, user_id: str, limit: int):
        """Set a custom rate limit for a specific user."""
        self._user_limits[user_id] = limit
    
    def get_user_limit(self, user_id: str) -> int:
        """Get the rate limit for a specific user."""
        return self._user_limits[user_id]
    
    def reset_user_limit(self, user_id: str):
        """Reset a user's rate limit to the default."""
        self._user_limits[user_id] = settings.RATE_LIMIT_PER_USER

# Create a global rate limiter instance
rate_limiter = RateLimiter() 