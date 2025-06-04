from pydantic_settings import BaseSettings
from typing import List
import secrets
import logging
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Password Settings
    MIN_PASSWORD_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPER: bool = True
    PASSWORD_REQUIRE_LOWER: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./anime.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://*.netlify.app"
    ]
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Cache
    CACHE_TTL: int = 3600
    CACHE_MAX_SIZE: int = 1000
    
    # API URLs
    SITE_URL: str = "http://localhost:8000"
    ANIME_API_URL: str = "https://graphql.anilist.co"
    ANIME_IMAGE_URL: str = "https://cdn.myanimelist.net/images/anime"
    ANILIST_API_URL: str = "https://graphql.anilist.co"
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields

settings = Settings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)