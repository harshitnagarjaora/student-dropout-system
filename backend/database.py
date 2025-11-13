# backend/database.py
"""
Database configuration for the Student Dropout Prediction System
Using SQLite for development (easy setup, no installation needed)
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database (will create a file called student_dropout.db)
SQLALCHEMY_DATABASE_URL = "sqlite:///./student_dropout.db"

# Create database engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Only needed for SQLite
)

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Test that everything loads correctly
if __name__ == "__main__":
    print("✅ Database configuration loaded successfully!")
    print(f"   Database URL: {SQLALCHEMY_DATABASE_URL}")
    print(f"   Engine created: {engine}")
    print(f"   Base created: {Base}")