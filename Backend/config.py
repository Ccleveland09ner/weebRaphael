from pydantic_settings import BaseSettings
from pydantic import Extra
from typing import Optional, List
import secrets
import logging
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    API_KEY_ROTATION_DAYS: int = 30
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./anime.db")
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "https://*.netlify.app",  # Netlify domains
    ]
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_USER: int = 100
    
    # Password Requirements
    MIN_PASSWORD_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPER: bool = True
    PASSWORD_REQUIRE_LOWER: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    
    # Cache
    CACHE_TTL: int = 3600  # 1 hour
    CACHE_MAX_SIZE: int = 1000
    
    # Site Configuration
    SITE_URL: str = os.getenv("SITE_URL", "http://localhost:8000")
    ANIME_IMAGE_URL: str = os.getenv("ANIME_IMAGE_URL", "https://cdn.myanimelist.net/images/anime")
    ANILIST_API_URL: str = os.getenv("ANILIST_API_URL", "https://graphql.anilist.co")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = Extra.allow

settings = Settings()

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT
)