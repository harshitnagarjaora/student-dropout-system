# backend/ml_model/train_model.py
"""
Machine Learning Model Training Script
Trains a Random Forest model to predict student dropout risk
"""

import sys
import os
# Add parent directory to path to import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import warnings
warnings.filterwarnings('ignore')

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic student data for training
    Since we don't have real data yet, we'll create realistic synthetic data
    """
    print("📊 Generating synthetic training data...")
    np.random.seed(42)  # For reproducibility
    
    data = []
    
    for i in range(n_samples):
        # Generate attendance (60-100%)
        attendance = np.random.normal(75, 15)
        attendance = np.clip(attendance, 0, 100)
        
        # Generate marks (correlated with attendance)
        marks_base = attendance * 0.7 + np.random.normal(0, 10)
        marks = np.clip(marks_base, 0, 100)
        
        # Failed subjects (based on marks)
        if marks < 35:
            failed_subjects = np.random.choice([3, 4, 5], p=[0.4, 0.4, 0.2])
        elif marks < 50:
            failed_subjects = np.random.choice([1, 2, 3], p=[0.5, 0.3, 0.2])
        else:
            failed_subjects = np.random.choice([0, 1], p=[0.8, 0.2])
        
        # Pending fees (more likely for low performers)
        if marks < 40:
            has_pending_fees = np.random.choice([0, 1], p=[0.6, 0.4])
        else:
            has_pending_fees = np.random.choice([0, 1], p=[0.85, 0.15])
        
        # Assignment completion (correlated with marks)
        assignment_completion = np.clip(marks + np.random.normal(10, 5), 0, 100)
        
        # Determine risk level (our target variable)
        # Risk Level Logic:
        # High (2): Very poor performance
        # Medium (1): Below average performance  
        # Low (0): Good performance
        
        if attendance < 60 or marks < 35 or failed_subjects > 3:
            risk_level = 2  # High risk
        elif attendance < 75 or marks < 50 or failed_subjects > 1:
            risk_level = 1  # Medium risk
        else:
            risk_level = 0  # Low risk
        
        # Add some randomness (10% noise)
        if np.random.random() < 0.1:
            risk_level = np.random.choice([0, 1, 2])
        
        data.append({
            'roll_no': f'2024{i:04d}',
            'name': f'Student_{i}',
            'attendance_percentage': round(attendance, 1),
            'average_marks': round(marks, 1),
            'failed_subjects': failed_subjects,
            'has_pending_fees': has_pending_fees,
            'assignment_completion': round(assignment_completion, 1),
            'risk_level': risk_level
        })
    
    return pd.DataFrame(data)

def train_model():
    """
    Main function to train the dropout prediction model
    """
    print("\n" + "="*60)
    print("🎓 STUDENT DROPOUT PREDICTION MODEL TRAINING")
    print("="*60)
    
    # Step 1: Generate training data
    print("\n1️⃣ Generating Training Data...")
    df = generate_synthetic_data(1000)
    print(f"   ✅ Generated {len(df)} training samples")
    
    # Display data statistics
    print("\n2️⃣ Data Statistics:")
    print(f"   📊 Dataset shape: {df.shape}")
    
    risk_counts = df['risk_level'].value_counts().sort_index()
    risk_labels = {0: 'Low Risk   🟢', 1: 'Medium Risk 🟡', 2: 'High Risk  🔴'}
    print("\n   Risk Level Distribution:")
    for level, count in risk_counts.items():
        percentage = (count/len(df)*100)
        print(f"      {risk_labels[level]}: {count:4d} samples ({percentage:.1f}%)")
    
    # Step 2: Prepare features
    print("\n3️⃣ Preparing Features...")
    feature_columns = [
        'attendance_percentage', 
        'average_marks', 
        'failed_subjects',
        'has_pending_fees', 
        'assignment_completion'
    ]
    
    X = df[feature_columns]
    y = df['risk_level']
    
    print(f"   📝 Features used for training:")
    for i, col in enumerate(feature_columns, 1):
        print(f"      {i}. {col}")
    
    # Step 3: Split data
    print("\n4️⃣ Splitting Data...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   📚 Training samples: {len(X_train)}")
    print(f"   🧪 Testing samples:  {len(X_test)}")
    
    # Step 4: Scale features
    print("\n5️⃣ Scaling Features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("   ✅ Features scaled successfully")
    
    # Step 5: Train model
    print("\n6️⃣ Training Random Forest Model...")
    print("   🌲 Building forest with 100 trees...")
    
    model = RandomForestClassifier(
        n_estimators=100,      # Number of trees
        max_depth=10,          # Maximum depth of trees
        min_samples_split=5,   # Minimum samples to split
        min_samples_leaf=2,    # Minimum samples in leaf
        random_state=42,       # For reproducibility
        n_jobs=-1             # Use all CPU cores
    )
    
    model.fit(X_train_scaled, y_train)
    print("   ✅ Model trained successfully!")
    
    # Step 6: Evaluate model
    print("\n7️⃣ Model Evaluation:")
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"   🎯 Overall Accuracy: {accuracy:.2%}")
    
    # Feature importance
    print("\n   📊 Feature Importance (what matters most):")
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for _, row in feature_importance.iterrows():
        bar_length = int(row['importance'] * 50)
        bar = '█' * bar_length
        print(f"      {row['feature']:22s} {row['importance']:.3f} {bar}")
    
    # Classification report
    print("\n   📋 Detailed Performance by Risk Level:")
    print("   " + "-"*50)
    report = classification_report(y_test, y_pred, 
                                  target_names=['Low Risk', 'Medium Risk', 'High Risk'],
                                  output_dict=True)
    
    for risk_level in ['Low Risk', 'Medium Risk', 'High Risk']:
        metrics = report[risk_level]
        print(f"   {risk_level:12s} - Precision: {metrics['precision']:.2f}, "
              f"Recall: {metrics['recall']:.2f}, F1: {metrics['f1-score']:.2f}")
    
    # Step 7: Save model and scaler
    print("\n8️⃣ Saving Model Files...")
    
    # Save model
    model_path = 'model.pkl'
    joblib.dump(model, model_path)
    print(f"   💾 Model saved to: ml_model/{model_path}")
    
    # Save scaler
    scaler_path = 'scaler.pkl'
    joblib.dump(scaler, scaler_path)
    print(f"   💾 Scaler saved to: ml_model/{scaler_path}")
    
    print("\n" + "="*60)
    print("✅ MODEL TRAINING COMPLETED SUCCESSFULLY!")
    print("="*60)
    
    return model, scaler, df

if __name__ == "__main__":
    # Train the model
    model, scaler, training_data = train_model()
    
    print("\n💡 Next Steps:")
    print("   1. Model is ready for predictions")
    print("   2. You can now generate sample CSV files")
    print("   3. Run the FastAPI server to use the model")
    
    # Ask if user wants to generate sample CSVs
    print("\n" + "-"*60)
    user_input = input("📁 Generate sample CSV files for testing? (y/n): ")
    
    if user_input.lower() == 'y':
        print("\nGenerating sample CSV files...")
        # We'll create this function in the next step
        print("Sample CSV generation will be added in the next step!")
    else:
        print("\n✅ Training complete! Model is ready to use.")