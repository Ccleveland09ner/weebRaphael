from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional
import logging
from datetime import datetime

from config import settings
from schemas import (
    UserCreate, UserResponse, Token, UserUpdate,
    UserSearchResponse, UserStats, FavouriteAnime,
    WatchedAnime, AnimeRecommendation, AnimeStats
)
from user_db import (
    create_user, get_user_by_email, update_user,
    delete_user, search_users, get_user_stats,
    update_last_login, increment_failed_login_attempts,
    reset_failed_login_attempts, init_db
)
from anime_db import AnimeDatabase
from auth import (
    get_current_user, create_access_token,
    create_refresh_token, verify_refresh_token,
    hash_password, verify_password, get_current_admin
)
from rate_limiter import rate_limiter
from cache import cache
from exceptions import (
    UserNotFoundError, DuplicateEntryError,
    InvalidCredentialsError, RateLimitExceededError
)

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Anime Recommendation API",
    description="API for anime recommendations and user management",
    version="1.0.0"
)

# Initialize anime database
anime_db = AnimeDatabase()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

@app.on_event("startup")
def startup():
    init_db()

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_id = request.client.host
    is_allowed, remaining = rate_limiter.check_rate_limit(client_id)
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
    
    rate_limiter.add_request(client_id)
    response = await call_next(request)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    return response

# Authentication routes
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = get_user_by_email(form_data.username)
        if not user or not verify_password(form_data.password, user.password):
            increment_failed_login_attempts(user.id)
            raise InvalidCredentialsError()
        
        reset_failed_login_attempts(user.id)
        update_last_login(user.id)
        
        access_token = create_access_token({"sub": user.email})
        refresh_token = create_refresh_token({"sub": user.email})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

@app.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str):
    try:
        payload = verify_refresh_token(refresh_token)
        user = get_user_by_email(payload["sub"])
        if not user:
            raise InvalidCredentialsError()
        
        access_token = create_access_token({"sub": user.email})
        new_refresh_token = create_refresh_token({"sub": user.email})
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Token refresh failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

# User routes
@app.post("/users", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        return create_user(user)
    except DuplicateEntryError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

@app.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=UserResponse)
async def update_user_info(
    update_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        return update_user(current_user.id, update_data)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

@app.delete("/users/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_account(current_user: UserResponse = Depends(get_current_user)):
    try:
        if delete_user(current_user.id):
            return None
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        logger.error(f"User deletion failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )

# Admin routes
@app.get("/admin/users", response_model=UserSearchResponse)
async def admin_search_users(
    query: str,
    page: int = 1,
    page_size: int = 10,
    current_user: UserResponse = Depends(get_current_admin)
):
    try:
        return search_users(query, page, page_size)
    except Exception as e:
        logger.error(f"User search failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search users"
        )

@app.get("/admin/stats", response_model=UserStats)
async def admin_get_stats(current_user: UserResponse = Depends(get_current_admin)):
    try:
        return get_user_stats()
    except Exception as e:
        logger.error(f"Stats retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get stats"
        )

# Anime routes
@app.post("/anime/favorites", response_model=FavouriteAnime)
async def add_favorite_anime(
    anime: FavouriteAnime,
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        if anime_db.add_favorite(current_user.id, anime.anime_id, anime.title):
            return anime
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to add favorite"
        )
    except Exception as e:
        logger.error(f"Add favorite failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add favorite"
        )

@app.get("/anime/favorites", response_model=List[FavouriteAnime])
async def get_favorite_animes(current_user: UserResponse = Depends(get_current_user)):
    try:
        return anime_db.get_user_favorites(current_user.id)
    except Exception as e:
        logger.error(f"Get favorites failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get favorites"
        )

@app.post("/anime/watched", response_model=WatchedAnime)
async def add_watched_anime(
    anime: WatchedAnime,
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        if anime_db.add_watched(current_user.id, anime.anime_id, anime.title, anime.rating):
            return anime
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to add watched anime"
        )
    except Exception as e:
        logger.error(f"Add watched anime failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add watched anime"
        )

@app.get("/anime/watched", response_model=List[WatchedAnime])
async def get_watched_animes(current_user: UserResponse = Depends(get_current_user)):
    try:
        return anime_db.get_user_watched(current_user.id)
    except Exception as e:
        logger.error(f"Get watched animes failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get watched animes"
        )

@app.get("/anime/recommendations", response_model=List[AnimeRecommendation])
async def get_anime_recommendations(
    current_user: UserResponse = Depends(get_current_user),
    limit: int = 10
):
    try:
        return anime_db.get_user_recommendations(current_user.id, limit)
    except Exception as e:
        logger.error(f"Get recommendations failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get recommendations"
        )

@app.get("/anime/stats", response_model=AnimeStats)
async def get_anime_stats(current_user: UserResponse = Depends(get_current_user)):
    try:
        return anime_db.get_user_stats(current_user.id)
    except Exception as e:
        logger.error(f"Get anime stats failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get anime stats"
        )

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }