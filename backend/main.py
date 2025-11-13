# backend/main.py
"""
FastAPI backend for Student Dropout Prediction System
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import pandas as pd
import numpy as np
import joblib
import io
from datetime import datetime
from sqlalchemy.orm import Session

# Import database components
from database import SessionLocal, engine
import models

# Import utilities
from utils.data_preprocess import merge_and_clean_data, prepare_features, validate_csv_structure
from utils.counseling import generate_counseling_message, get_risk_reasons

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Student Dropout Prediction API",
    description="AI-powered system to predict student dropout risk",
    version="1.0.0"
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model and scaler at startup
print("🤖 Loading ML model...")
try:
    model = joblib.load("ml_model/model.pkl")
    scaler = joblib.load("ml_model/scaler.pkl")
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load model: {e}")
    print("   Using fallback rule-based predictions")
    model = None
    scaler = None

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============== API ENDPOINTS ==============

@app.get("/")
def root():
    """Root endpoint - API health check"""
    return {
        "message": "Student Dropout Prediction API",
        "status": "running",
        "model_loaded": model is not None,
        "endpoints": {
            "upload": "/api/upload-and-predict",
            "students": "/api/students",
            "alert": "/api/send-alert/{student_id}",
            "counseling": "/api/student/{student_id}/counseling"
        }
    }

@app.post("/api/upload-and-predict")
async def upload_and_predict(
    attendance_file: UploadFile = File(...),
    marks_file: UploadFile = File(...),
    fees_file: UploadFile = File(...)
):
    """
    Upload CSV files and get dropout predictions
    
    Args:
        attendance_file: CSV with attendance data
        marks_file: CSV with marks data
        fees_file: CSV with fees data
    
    Returns:
        JSON with predictions for all students
    """
    try:
        print("\n📤 Processing uploaded files...")
        
        # Read CSV files into dataframes
        print("   Reading attendance file...")
        attendance_content = await attendance_file.read()
        attendance_df = pd.read_csv(io.StringIO(attendance_content.decode('utf-8')))
        validate_csv_structure(attendance_df, 'attendance')
        
        print("   Reading marks file...")
        marks_content = await marks_file.read()
        marks_df = pd.read_csv(io.StringIO(marks_content.decode('utf-8')))
        validate_csv_structure(marks_df, 'marks')
        
        print("   Reading fees file...")
        fees_content = await fees_file.read()
        fees_df = pd.read_csv(io.StringIO(fees_content.decode('utf-8')))
        validate_csv_structure(fees_df, 'fees')
        
        # Merge and clean data
        merged_df = merge_and_clean_data(attendance_df, marks_df, fees_df)
        
        # Prepare features for prediction
        features, student_info = prepare_features(merged_df)
        
        # Make predictions
        results = []
        db = next(get_db())
        
        if model and scaler:
            # Use ML model for predictions
            print("🤖 Making predictions with ML model...")
            
            # Scale features
            features_scaled = scaler.transform(features)
            
            # Get predictions and probabilities
            predictions = model.predict(features_scaled)
            probabilities = model.predict_proba(features_scaled)
            
            # Process each student
            for i, (_, row) in enumerate(student_info.iterrows()):
                # Map prediction to risk level
                risk_mapping = {0: "Low", 1: "Medium", 2: "High"}
                risk_level = risk_mapping[predictions[i]]
                
                # Get confidence score
                risk_score = float(max(probabilities[i])) * 100
                
                # Get risk reasons
                reasons = get_risk_reasons(
                    row.get('attendance_percentage', 75),
                    row.get('average_marks', 50),
                    row.get('fees_pending', 0),
                    row.get('failed_subjects', 0)
                )
                reason_text = ", ".join(reasons)
                
                # Generate counseling message
                counseling_msg = generate_counseling_message(
                    risk_level,
                    row.get('attendance_percentage', 75),
                    row.get('average_marks', 50),
                    row.get('fees_pending', 0),
                    row.get('failed_subjects', 0)
                )
                
                # Save to database
                student_record = models.Student(
                    name=row['name'],
                    roll_no=row['roll_no'],
                    attendance=row.get('attendance_percentage', 0),
                    avg_marks=row.get('average_marks', 0),
                    fee_status="Pending" if row.get('fees_pending', 0) > 0 else "Paid",
                    risk_level=risk_level,
                    risk_score=risk_score,
                    reason=reason_text,
                    counseling_msg=counseling_msg
                )
                
                # Use merge to update if exists
                existing = db.query(models.Student).filter(
                    models.Student.roll_no == row['roll_no']
                ).first()
                
                if existing:
                    existing.name = student_record.name
                    existing.attendance = student_record.attendance
                    existing.avg_marks = student_record.avg_marks
                    existing.fee_status = student_record.fee_status
                    existing.risk_level = student_record.risk_level
                    existing.risk_score = student_record.risk_score
                    existing.reason = student_record.reason
                    existing.counseling_msg = student_record.counseling_msg
                else:
                    db.add(student_record)
                
                # Prepare response
                results.append({
                    "id": i + 1,
                    "name": row['name'],
                    "roll_no": row['roll_no'],
                    "attendance": f"{row.get('attendance_percentage', 0):.1f}%",
                    "avg_marks": f"{row.get('average_marks', 0):.1f}",
                    "fee_status": "Pending" if row.get('fees_pending', 0) > 0 else "Paid",
                    "risk_level": risk_level,
                    "risk_score": f"{risk_score:.1f}%",
                    "reason": reason_text,
                    "counseling_msg": counseling_msg
                })
            
        else:
            # Fallback: Rule-based prediction if model not available
            print("📋 Using rule-based predictions (model not loaded)...")
            
            for i, (_, row) in enumerate(student_info.iterrows()):
                # Simple rule-based risk assessment
                attendance = row.get('attendance_percentage', 75)
                marks = row.get('average_marks', 50)
                failed = row.get('failed_subjects', 0)
                
                if attendance < 60 or marks < 35 or failed > 3:
                    risk_level = "High"
                elif attendance < 75 or marks < 50 or failed > 1:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"
                
                # Get reasons
                reasons = get_risk_reasons(
                    attendance, marks,
                    row.get('fees_pending', 0),
                    failed
                )
                reason_text = ", ".join(reasons)
                
                # Generate counseling
                counseling_msg = generate_counseling_message(
                    risk_level, attendance, marks,
                    row.get('fees_pending', 0), failed
                )
                
                results.append({
                    "id": i + 1,
                    "name": row['name'],
                    "roll_no": row['roll_no'],
                    "attendance": f"{attendance:.1f}%",
                    "avg_marks": f"{marks:.1f}",
                    "fee_status": "Pending" if row.get('fees_pending', 0) > 0 else "Paid",
                    "risk_level": risk_level,
                    "risk_score": "N/A",
                    "reason": reason_text,
                    "counseling_msg": counseling_msg
                })
        
        # Commit database changes
        db.commit()
        
        # Calculate summary statistics
        summary = {
            "total_students": len(results),
            "high_risk": sum(1 for r in results if r["risk_level"] == "High"),
            "medium_risk": sum(1 for r in results if r["risk_level"] == "Medium"),
            "low_risk": sum(1 for r in results if r["risk_level"] == "Low")
        }
        
        print(f"✅ Processed {len(results)} students successfully!")
        
        return JSONResponse(content={
            "success": True,
            "message": "Files processed successfully",
            "data": results,
            "summary": summary
        })
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"❌ Error processing files: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")

@app.get("/api/students")
def get_all_students():
    """Get all students with their predictions from database"""
    db = next(get_db())
    students = db.query(models.Student).all()
    
    if not students:
        return {
            "success": True,
            "message": "No students found. Please upload data first.",
            "data": []
        }
    
    return {
        "success": True,
        "data": [
            {
                "id": s.id,
                "name": s.name,
                "roll_no": s.roll_no,
                "attendance": f"{s.attendance:.1f}%",
                "avg_marks": f"{s.avg_marks:.1f}",
                "fee_status": s.fee_status,
                "risk_level": s.risk_level,
                "risk_score": f"{s.risk_score:.1f}%" if s.risk_score else "N/A",
                "reason": s.reason,
                "counseling_msg": s.counseling_msg
            }
            for s in students
        ]
    }

@app.post("/api/send-alert/{student_id}")
def send_alert(student_id: int, message: str = None):
    """Send alert to a specific student"""
    db = next(get_db())
    
    # Get student
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Create alert record
    default_message = f"Your current risk level is {student.risk_level}. Please meet your academic advisor."
    alert = models.Alert(
        student_id=student_id,
        message=message or default_message,
        date=datetime.now()
    )
    
    db.add(alert)
    db.commit()
    
    return {
        "success": True,
        "message": f"Alert sent to {student.name}",
        "alert_id": alert.id,
        "alert_message": alert.message
    }

@app.get("/api/student/{student_id}/counseling")
def get_counseling(student_id: int):
    """Get counseling recommendations for a specific student"""
    db = next(get_db())
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        "success": True,
        "student_name": student.name,
        "roll_no": student.roll_no,
        "risk_level": student.risk_level,
        "counseling_message": student.counseling_msg,
        "recommendations": [
            "Schedule regular meetings with academic advisor",
            "Join study groups for weak subjects",
            "Utilize campus resources and tutoring services",
            "Set realistic academic goals and track progress",
            "Maintain work-life balance with proper time management"
        ]
    }

@app.get("/api/stats")
def get_statistics():
    """Get overall statistics from the database"""
    db = next(get_db())
    
    total = db.query(models.Student).count()
    high_risk = db.query(models.Student).filter(models.Student.risk_level == "High").count()
    medium_risk = db.query(models.Student).filter(models.Student.risk_level == "Medium").count()
    low_risk = db.query(models.Student).filter(models.Student.risk_level == "Low").count()
    
    return {
        "success": True,
        "statistics": {
            "total_students": total,
            "high_risk": high_risk,
            "medium_risk": medium_risk,
            "low_risk": low_risk,
            "high_risk_percentage": (high_risk / total * 100) if total > 0 else 0,
            "medium_risk_percentage": (medium_risk / total * 100) if total > 0 else 0,
            "low_risk_percentage": (low_risk / total * 100) if total > 0 else 0
        }
    }

# Run with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Student Dropout Prediction API...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)