import auth
import schemas
import user_db
from exceptions import AuthenticationError, UserCreationError

def create_user(user: schemas.UserCreate) -> schemas.User:
    try:
        return user_db.create_user(user)
    except ValueError as e:
        raise UserCreationError(f"Error creating user: {e}")

def login_user(username: str, password: str) -> schemas.User | None:
    user = user_db.get_user_by_email(username)
    if not user:
        return None
    
    if not auth.verify_password(password, user.password):
        raise AuthenticationError("Invalid credentials")
    
    return user