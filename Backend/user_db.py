from typing import Optional, List, Dict, Any
from passlib.context import CryptContext
from config import settings
import sqlite3
import schemas
from exceptions import UserNotFoundError, DuplicateEntryError, DatabaseError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Drop existing users table to recreate with correct schema
    cursor.execute('DROP TABLE IF EXISTS users')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            age INTEGER NOT NULL CHECK(age >= 0),
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            is_admin BOOLEAN DEFAULT 0,
            failed_login_attempts INTEGER DEFAULT 0
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_name ON users(name)')
    
    conn.commit()
    conn.close()

def create_user(user: schemas.UserCreate) -> schemas.User:
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        hashed_password = pwd_context.hash(user.password)
        now = datetime.utcnow().isoformat()
        cursor.execute(
            '''
            INSERT INTO users (name, email, age, password, created_at, updated_at, is_admin)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (user.name, user.email, user.age, hashed_password, now, now, user.is_admin)
        )
        conn.commit()

        cursor.execute('SELECT * FROM users WHERE email = ?', (user.email,))
        row = cursor.fetchone()
        
        return schemas.User(
            id=row['id'],
            name=row['name'],
            email=row['email'],
            age=row['age'],
            password=row['password'],
            created_at=datetime.fromisoformat(row['created_at']),
            updated_at=datetime.fromisoformat(row['updated_at']),
            last_login=None,
            is_active=True,
            is_admin=bool(row['is_admin']),
            failed_login_attempts=0
        )
    except sqlite3.IntegrityError as e:
        conn.rollback()
        raise DuplicateEntryError("Email already exists") from e
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to create user: {str(e)}") from e
    finally:
        conn.close()

def get_user_by_email(email: str) -> Optional[schemas.User]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        row = cursor.fetchone()
        
        if row:
            return schemas.User(
                id=row['id'],
                name=row['name'],
                email=row['email'],
                age=row['age'],
                password=row['password'],
                created_at=datetime.fromisoformat(row['created_at']),
                updated_at=datetime.fromisoformat(row['updated_at']),
                last_login=datetime.fromisoformat(row['last_login']) if row['last_login'] else None,
                is_active=bool(row['is_active']),
                is_admin=bool(row['is_admin']),
                failed_login_attempts=row['failed_login_attempts']
            )
        return None
    except Exception as e:
        raise DatabaseError(f"Failed to get user by email: {str(e)}") from e
    finally:
        conn.close()

def update_user(user_id: int, update_data: schemas.UserUpdate) -> schemas.User:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        update_fields = []
        params = []
        
        if update_data.name is not None:
            update_fields.append("name = ?")
            params.append(update_data.name)
        
        if update_data.email is not None:
            update_fields.append("email = ?")
            params.append(update_data.email)
        
        if update_data.age is not None:
            update_fields.append("age = ?")
            params.append(update_data.age)
        
        if not update_fields:
            raise ValueError("No fields to update")
        
        now = datetime.utcnow().isoformat()
        update_fields.append("updated_at = ?")
        params.append(now)
        params.append(user_id)
        
        query = f"""
            UPDATE users 
            SET {', '.join(update_fields)}
            WHERE id = ?
        """
        
        cursor.execute(query, params)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise UserNotFoundError(f"User with id {user_id} not found")
        
        cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        row = cursor.fetchone()
        
        return schemas.User(
            id=row['id'],
            name=row['name'],
            email=row['email'],
            age=row['age'],
            password=row['password'],
            created_at=datetime.fromisoformat(row['created_at']),
            updated_at=datetime.fromisoformat(row['updated_at']),
            last_login=datetime.fromisoformat(row['last_login']) if row['last_login'] else None,
            is_active=bool(row['is_active']),
            is_admin=bool(row['is_admin']),
            failed_login_attempts=row['failed_login_attempts']
        )
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to update user: {str(e)}") from e
    finally:
        conn.close()

def delete_user(user_id: int) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to delete user: {str(e)}") from e
    finally:
        conn.close()

def search_users(
    query: str,
    page: int = 1,
    page_size: int = 10
) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            '''
            SELECT COUNT(*) 
            FROM users 
            WHERE name LIKE ? OR email LIKE ?
            ''',
            (f'%{query}%', f'%{query}%')
        )
        total = cursor.fetchone()[0]
        
        offset = (page - 1) * page_size
        cursor.execute(
            '''
            SELECT * 
            FROM users 
            WHERE name LIKE ? OR email LIKE ?
            ORDER BY name
            LIMIT ? OFFSET ?
            ''',
            (f'%{query}%', f'%{query}%', page_size, offset)
        )
        
        users = []
        for row in cursor.fetchall():
            users.append(schemas.User(
                id=row['id'],
                name=row['name'],
                email=row['email'],
                age=row['age'],
                password=row['password'],
                created_at=datetime.fromisoformat(row['created_at']),
                updated_at=datetime.fromisoformat(row['updated_at']),
                last_login=datetime.fromisoformat(row['last_login']) if row['last_login'] else None,
                is_active=bool(row['is_active']),
                is_admin=bool(row['is_admin']),
                failed_login_attempts=row['failed_login_attempts']
            ))
        
        return {
            'users': users,
            'total': total,
            'page': page,
            'page_size': page_size,
            'total_pages': (total + page_size - 1) // page_size
        }
    except Exception as e:
        raise DatabaseError(f"Failed to search users: {str(e)}") from e
    finally:
        conn.close()

def update_last_login(user_id: int) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        now = datetime.utcnow().isoformat()
        cursor.execute(
            'UPDATE users SET last_login = ? WHERE id = ?',
            (now, user_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to update last login: {str(e)}") from e
    finally:
        conn.close()

def increment_failed_login_attempts(user_id: int) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
            (user_id,)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to increment failed login attempts: {str(e)}") from e
    finally:
        conn.close()

def reset_failed_login_attempts(user_id: int) -> None:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'UPDATE users SET failed_login_attempts = 0 WHERE id = ?',
            (user_id,)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise DatabaseError(f"Failed to reset failed login attempts: {str(e)}") from e
    finally:
        conn.close()

def get_user_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT COUNT(*) FROM users')
        total_users = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM users WHERE last_login IS NOT NULL')
        active_users = cursor.fetchone()[0]
        
        cursor.execute('SELECT AVG(age) FROM users')
        avg_age = cursor.fetchone()[0] or 0
        
        return {
            'total_users': total_users,
            'active_users': active_users,
            'average_age': round(avg_age, 2)
        }
    except Exception as e:
        raise DatabaseError(f"Failed to get user stats: {str(e)}") from e
    finally:
        conn.close()

init_db()