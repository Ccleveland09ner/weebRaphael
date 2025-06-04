class AnimeError(Exception):
    """Base exception for anime-related errors."""
    pass

class UserError(Exception):
    """Base exception for user-related errors."""
    pass

class DatabaseError(Exception):
    """Base exception for database-related errors."""
    pass

class AuthenticationError(Exception):
    """Base exception for authentication-related errors."""
    pass

class ValidationError(Exception):
    """Base exception for validation-related errors."""
    pass

class RateLimitError(Exception):
    """Exception for rate limiting errors."""
    pass

class CacheError(Exception):
    """Exception for caching errors."""
    pass

class AnimeNotFoundError(AnimeError):
    """Exception raised when an anime is not found."""
    pass

class UserNotFoundError(UserError):
    """Exception raised when a user is not found."""
    pass

class DuplicateEntryError(DatabaseError):
    """Exception raised when trying to create a duplicate entry."""
    pass

class InvalidCredentialsError(AuthenticationError):
    """Exception raised when credentials are invalid."""
    pass

class TokenExpiredError(AuthenticationError):
    """Exception raised when a token has expired."""
    pass

class InvalidTokenError(AuthenticationError):
    """Exception raised when a token is invalid."""
    pass

class PasswordValidationError(ValidationError):
    """Exception raised when password validation fails."""
    pass

class RateLimitExceededError(RateLimitError):
    """Exception raised when rate limit is exceeded."""
    pass 