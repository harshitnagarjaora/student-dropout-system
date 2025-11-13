# backend/models.py
"""
Database models for Student Dropout Prediction System
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

# Import from database.py in the same directory
try:
    from database import Base
except ImportError:
    print("Error: Could not import Base from database.py")
    print("Make sure database.py exists in the same folder")
    raise

class Student(Base):
    """Student table to store student information and predictions"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    roll_no = Column(String(50), unique=True, nullable=False)
    attendance = Column(Float)
    avg_marks = Column(Float)
    fee_status = Column(String(50))
    risk_level = Column(String(20))  # Low, Medium, High
    risk_score = Column(Float)
    reason = Column(Text)
    counseling_msg = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationship with alerts
    alerts = relationship("Alert", back_populates="student")

class Alert(Base):
    """Alert table to store alerts sent to students"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    date = Column(DateTime, default=datetime.now)
    message = Column(Text)
    
    # Relationship with student
    student = relationship("Student", back_populates="alerts")

# Test that models load correctly
if __name__ == "__main__":
    print("✅ Models loaded successfully!")
    print(f"   Student model: {Student.__tablename__}")
    print(f"   Alert model: {Alert.__tablename__}")