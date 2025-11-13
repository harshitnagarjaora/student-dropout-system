# backend/utils/data_preprocess.py
"""
Data preprocessing utilities for merging and cleaning CSV files
"""

import pandas as pd
import numpy as np

def merge_and_clean_data(attendance_df, marks_df, fees_df):
    """
    Merge the three CSV files and clean the data
    
    Args:
        attendance_df: DataFrame with attendance data
        marks_df: DataFrame with marks data
        fees_df: DataFrame with fees data
    
    Returns:
        merged_df: Cleaned and merged DataFrame
    """
    print("🔄 Merging and cleaning data...")
    
    # Step 1: Standardize column names (make lowercase and strip spaces)
    for df in [attendance_df, marks_df, fees_df]:
        df.columns = [col.lower().strip() for col in df.columns]
    
    # Step 2: Handle different roll_no column variations
    roll_no_variations = ['rollno', 'roll no', 'roll_no', 'roll_number', 'rollnumber']
    
    for df in [attendance_df, marks_df, fees_df]:
        for col in df.columns:
            if col in roll_no_variations:
                df.rename(columns={col: 'roll_no'}, inplace=True)
                break
    
    # Step 3: Merge dataframes
    print("   Merging attendance and marks data...")
    merged_df = attendance_df.merge(marks_df, on='roll_no', how='outer')
    
    print("   Merging with fees data...")
    merged_df = merged_df.merge(fees_df, on='roll_no', how='outer')
    
    # Step 4: Handle missing values
    print("   Handling missing values...")
    
    # Fill numeric columns with reasonable defaults
    if 'attendance_percentage' in merged_df.columns:
        merged_df['attendance_percentage'].fillna(
            merged_df['attendance_percentage'].mean() if len(merged_df) > 0 else 75, 
            inplace=True
        )
    
    if 'average_marks' in merged_df.columns:
        merged_df['average_marks'].fillna(
            merged_df['average_marks'].mean() if len(merged_df) > 0 else 50,
            inplace=True
        )
    
    # Fill other columns with defaults
    default_values = {
        'fees_pending': 0,
        'failed_subjects': 0,
        'assignment_completion': 100,
        'semester_1_marks': 50,
        'semester_2_marks': 50,
        'midterm_marks': 50
    }
    
    for col, default_val in default_values.items():
        if col in merged_df.columns:
            merged_df[col].fillna(default_val, inplace=True)
    
    # Step 5: Ensure student names exist
    if 'name' not in merged_df.columns:
        # Try to find name column variations
        name_variations = ['student_name', 'studentname', 'student']
        for col in merged_df.columns:
            if col in name_variations:
                merged_df.rename(columns={col: 'name'}, inplace=True)
                break
        
        # If still no name column, generate names
        if 'name' not in merged_df.columns:
            merged_df['name'] = 'Student_' + merged_df['roll_no'].astype(str)
    
    # Step 6: Clean data types
    print("   Converting data types...")
    numeric_columns = [
        'attendance_percentage', 'average_marks', 'fees_pending',
        'failed_subjects', 'assignment_completion',
        'semester_1_marks', 'semester_2_marks', 'midterm_marks'
    ]
    
    for col in numeric_columns:
        if col in merged_df.columns:
            merged_df[col] = pd.to_numeric(merged_df[col], errors='coerce').fillna(0)
    
    # Step 7: Data validation
    print("   Validating data ranges...")
    
    # Ensure percentages are within 0-100
    percentage_cols = ['attendance_percentage', 'assignment_completion']
    for col in percentage_cols:
        if col in merged_df.columns:
            merged_df[col] = merged_df[col].clip(0, 100)
    
    # Ensure marks are within 0-100
    marks_cols = ['average_marks', 'semester_1_marks', 'semester_2_marks', 'midterm_marks']
    for col in marks_cols:
        if col in merged_df.columns:
            merged_df[col] = merged_df[col].clip(0, 100)
    
    print(f"   ✅ Data merged successfully! Shape: {merged_df.shape}")
    
    return merged_df

def prepare_features(merged_df):
    """
    Prepare features for ML model prediction
    
    Args:
        merged_df: Merged and cleaned DataFrame
    
    Returns:
        features: NumPy array of features for prediction
        student_info: DataFrame with student information
    """
    print("🎯 Preparing features for prediction...")
    
    # Required feature columns for the model
    feature_columns = [
        'attendance_percentage',
        'average_marks', 
        'failed_subjects',
        'has_pending_fees',
        'assignment_completion'
    ]
    
    # Create has_pending_fees column if not exists
    if 'has_pending_fees' not in merged_df.columns:
        if 'fees_pending' in merged_df.columns:
            merged_df['has_pending_fees'] = (merged_df['fees_pending'] > 0).astype(int)
        else:
            merged_df['has_pending_fees'] = 0
    
    # Ensure all required columns exist
    for col in feature_columns:
        if col not in merged_df.columns:
            if col == 'attendance_percentage':
                merged_df[col] = 75  # Default attendance
            elif col == 'average_marks':
                merged_df[col] = 50  # Default marks
            elif col == 'failed_subjects':
                merged_df[col] = 0   # No failed subjects by default
            elif col == 'assignment_completion':
                merged_df[col] = 100  # Full completion by default
    
    # Extract features for model
    features = merged_df[feature_columns].values
    
    # Keep student information for response
    info_columns = ['name', 'roll_no', 'attendance_percentage', 'average_marks']
    
    # Add optional columns if they exist
    optional_info = ['fees_pending', 'failed_subjects', 'semester_1_marks', 
                     'semester_2_marks', 'midterm_marks']
    
    for col in optional_info:
        if col in merged_df.columns:
            info_columns.append(col)
    
    # Remove duplicates from info_columns
    info_columns = list(dict.fromkeys(info_columns))
    
    # Create student info dataframe
    student_info = merged_df[info_columns].copy()
    
    print(f"   ✅ Features prepared! Shape: {features.shape}")
    print(f"   📊 Students to predict: {len(features)}")
    
    return features, student_info

def validate_csv_structure(df, file_type):
    """
    Validate that CSV has required columns
    
    Args:
        df: DataFrame to validate
        file_type: Type of file ('attendance', 'marks', or 'fees')
    
    Returns:
        bool: True if valid, raises Exception if not
    """
    required_columns = {
        'attendance': ['roll_no', 'attendance_percentage'],
        'marks': ['roll_no', 'average_marks'],
        'fees': ['roll_no']
    }
    
    # Standardize column names for checking
    df_cols_lower = [col.lower().strip() for col in df.columns]
    
    # Check for roll_no variations
    roll_no_found = any(col in ['roll_no', 'rollno', 'roll no', 'roll_number'] 
                        for col in df_cols_lower)
    
    if not roll_no_found:
        raise ValueError(f"❌ {file_type}.csv must contain a roll_no column")
    
    # Check for other required columns based on file type
    if file_type == 'attendance':
        att_found = any('attendance' in col for col in df_cols_lower)
        if not att_found:
            raise ValueError("❌ attendance.csv must contain attendance_percentage column")
    
    elif file_type == 'marks':
        marks_found = any('marks' in col or 'average' in col for col in df_cols_lower)
        if not marks_found:
            raise ValueError("❌ marks.csv must contain average_marks column")
    
    return True