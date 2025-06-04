from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
import re
from config import settings
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., description="Name of the user")
    email: EmailStr = Field(..., description="Email address of the user")
    age: int = Field(..., ge=0, description="Age of the user, must be a non-negative integer")
    is_admin: bool = Field(default=False, description="Whether the user is an administrator")

class UserCreate(UserBase):
    password: str = Field(..., description="Password of the user")
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < settings.MIN_PASSWORD_LENGTH:
            raise ValueError(f'Password must be at least {settings.MIN_PASSWORD_LENGTH} characters long')
        if settings.PASSWORD_REQUIRE_UPPER and not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if settings.PASSWORD_REQUIRE_LOWER and not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if settings.PASSWORD_REQUIRE_NUMBERS and not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if settings.PASSWORD_REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class User(UserBase):
    id: int = Field(..., description="Unique identifier for the user")
    password: str = Field(..., description="Hashed password of the user")
    created_at: datetime = Field(..., description="User creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")
    is_active: bool = Field(True, description="Whether the user account is active")
    failed_login_attempts: int = Field(0, description="Number of failed login attempts")

class UserResponse(UserBase):
    id: int = Field(..., description="Unique identifier for the user")
    created_at: datetime = Field(..., description="User creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")
    is_active: bool = Field(True, description="Whether the user account is active")

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, description="Updated name of the user")
    email: Optional[EmailStr] = Field(None, description="Updated email address of the user")
    age: Optional[int] = Field(None, ge=0, description="Updated age of the user, must be a non-negative integer")
    
    @validator('email', pre=True, always=True)
    def validate_email(cls, v):
        if v is None:
            return v
        return EmailStr.validate(v)

class PaginatedResponse(BaseModel):
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Number of items per page")
    total_pages: int = Field(..., description="Total number of pages")

class UserSearchResponse(PaginatedResponse):
    users: List[UserResponse] = Field(..., description="List of users")

class UserStats(BaseModel):
    total_users: int = Field(..., description="Total number of users")
    active_users: int = Field(..., description="Number of active users")
    average_age: float = Field(..., description="Average age of users")

class FavouriteAnime(BaseModel):
    anime_id: int = Field(..., description="Unique identifier for the anime")
    title: str = Field(..., description="Title of the anime")
    added_at: datetime = Field(..., description="When the anime was added to favorites")

class WatchedAnime(BaseModel):
    anime_id: int = Field(..., description="Unique identifier for the anime")
    title: str = Field(..., description="Title of the anime")
    watched_at: datetime = Field(..., description="When the anime was watched")
    rating: Optional[int] = Field(None, ge=1, le=10, description="User's rating of the anime (1-10)")

class AnimeRecommendation(BaseModel):
    anime_id: int = Field(..., description="Unique identifier for the anime")
    title: str = Field(..., description="Title of the anime")
    recommended_at: datetime = Field(..., description="When the anime was recommended")
    is_viewed: bool = Field(False, description="Whether the recommendation has been viewed")

class AnimeStats(BaseModel):
    favorites_count: int = Field(..., description="Number of favorite animes")
    watched_count: int = Field(..., description="Number of watched animes")
    unviewed_recommendations: int = Field(..., description="Number of unviewed recommendations")
    average_rating: float = Field(..., description="Average rating of watched animes")

