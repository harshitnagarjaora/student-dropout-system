# backend/test_model.py
"""
Quick test to verify the model works
"""

import joblib
import numpy as np

print("🧪 Testing Model Predictions...")
print("-"*50)

try:
    # Load model and scaler
    print("Loading model files...")
    model = joblib.load('ml_model/model.pkl')
    scaler = joblib.load('ml_model/scaler.pkl')
    print("✅ Model loaded successfully")
    
    # Create a test student
    print("\n📊 Test Student Data:")
    test_student = {
        'attendance_percentage': 65,  # Below 75%
        'average_marks': 45,          # Below 50
        'failed_subjects': 2,          # Has backlogs
        'has_pending_fees': 1,         # Has pending fees
        'assignment_completion': 60    # Low completion
    }
    
    for key, value in test_student.items():
        print(f"   {key}: {value}")
    
    # Prepare features (must be in same order as training)
    features = np.array([[
        test_student['attendance_percentage'],
        test_student['average_marks'],
        test_student['failed_subjects'],
        test_student['has_pending_fees'],
        test_student['assignment_completion']
    ]])
    
    # Scale and predict
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0]
    
    # Map to risk levels
    risk_map = {0: "Low Risk 🟢", 1: "Medium Risk 🟡", 2: "High Risk 🔴"}
    
    print("\n🎯 Prediction Results:")
    print(f"   Risk Level: {risk_map[prediction]}")
    print(f"   Confidence Scores:")
    print(f"      Low Risk:    {probability[0]:.2%}")
    print(f"      Medium Risk: {probability[1]:.2%}")
    print(f"      High Risk:   {probability[2]:.2%}")
    
    print("\n✅ Model is working correctly!")
    
except FileNotFoundError:
    print("❌ Model files not found!")
    print("   Please run: cd ml_model && python train_model.py")
except Exception as e:
    print(f"❌ Error: {e}")

print("-"*50)