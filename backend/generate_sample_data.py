# backend/generate_sample_data.py
"""
Generate sample CSV files for testing the system
Creates attendance.csv, marks.csv, and fees.csv
"""

import pandas as pd
import numpy as np
import os

def generate_sample_csvs():
    """
    Generate three CSV files with sample student data
    """
    print("\n📁 GENERATING SAMPLE CSV FILES")
    print("="*50)
    
    # Create sample_data directory if it doesn't exist
    sample_dir = '../sample_data'
    if not os.path.exists(sample_dir):
        os.makedirs(sample_dir)
        print(f"✅ Created directory: {sample_dir}")
    
    # Generate data for 30 students
    np.random.seed(100)  # Different seed for variety
    n_students = 30
    
    # Common data
    roll_numbers = [f"2024{i:04d}" for i in range(1, n_students + 1)]
    names = [
        "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta", "Vikram Singh",
        "Anjali Mehta", "Rohan Das", "Kavya Reddy", "Arjun Verma", "Divya Nair",
        "Sanjay Yadav", "Neha Kapoor", "Rajesh Malhotra", "Pooja Desai", "Karan Joshi",
        "Meera Iyer", "Aditya Rao", "Shruti Bansal", "Nikhil Saxena", "Ritu Pandey",
        "Varun Khanna", "Sakshi Agarwal", "Manish Dubey", "Ananya Mishra", "Deepak Soni",
        "Ishita Shah", "Rohit Chawla", "Tanvi Kulkarni", "Ashwin Nair", "Simran Kaur"
    ]
    
    # 1. Generate Attendance CSV
    print("\n1️⃣ Generating attendance.csv...")
    
    # Mix of good, average, and poor attendance
    attendance_percentages = []
    for i in range(n_students):
        if i < 10:  # Good attendance
            att = np.random.uniform(80, 95)
        elif i < 20:  # Average attendance
            att = np.random.uniform(65, 80)
        else:  # Poor attendance
            att = np.random.uniform(40, 65)
        attendance_percentages.append(round(att, 1))
    
    np.random.shuffle(attendance_percentages)  # Mix them up
    
    attendance_data = {
        'roll_no': roll_numbers,
        'name': names,
        'total_classes': [100] * n_students,
        'classes_attended': [int(p * 100 / 100) for p in attendance_percentages],
        'attendance_percentage': attendance_percentages
    }
    
    attendance_df = pd.DataFrame(attendance_data)
    attendance_file = os.path.join(sample_dir, 'attendance.csv')
    attendance_df.to_csv(attendance_file, index=False)
    print(f"   ✅ Created: {attendance_file}")
    print(f"      Shape: {attendance_df.shape}")
    
    # 2. Generate Marks CSV
    print("\n2️⃣ Generating marks.csv...")
    
    marks_data = {
        'roll_no': roll_numbers,
        'semester_1_marks': [],
        'semester_2_marks': [],
        'midterm_marks': [],
        'average_marks': [],
        'failed_subjects': [],
        'assignment_completion': []
    }
    
    for att_percent in attendance_percentages:
        # Marks correlate with attendance
        base_marks = att_percent * 0.8 + np.random.normal(0, 10)
        
        sem1 = np.clip(base_marks + np.random.normal(0, 5), 20, 100)
        sem2 = np.clip(base_marks + np.random.normal(0, 5), 20, 100)
        midterm = np.clip(base_marks + np.random.normal(0, 7), 20, 100)
        avg_marks = (sem1 + sem2 + midterm) / 3
        
        # Failed subjects based on average marks
        if avg_marks < 35:
            failed = np.random.choice([3, 4, 5])
        elif avg_marks < 50:
            failed = np.random.choice([1, 2])
        elif avg_marks < 65:
            failed = np.random.choice([0, 1])
        else:
            failed = 0
        
        # Assignment completion
        assignment = np.clip(avg_marks + np.random.normal(5, 10), 30, 100)
        
        marks_data['semester_1_marks'].append(round(sem1, 1))
        marks_data['semester_2_marks'].append(round(sem2, 1))
        marks_data['midterm_marks'].append(round(midterm, 1))
        marks_data['average_marks'].append(round(avg_marks, 1))
        marks_data['failed_subjects'].append(failed)
        marks_data['assignment_completion'].append(round(assignment, 1))
    
    marks_df = pd.DataFrame(marks_data)
    marks_file = os.path.join(sample_dir, 'marks.csv')
    marks_df.to_csv(marks_file, index=False)
    print(f"   ✅ Created: {marks_file}")
    print(f"      Shape: {marks_df.shape}")
    
    # 3. Generate Fees CSV
    print("\n3️⃣ Generating fees.csv...")
    
    fees_data = {
        'roll_no': roll_numbers,
        'total_fees': [50000] * n_students,
        'fees_paid': [],
        'fees_pending': [],
        'parent_contact': [],
        'parent_qualification': []
    }
    
    for i, avg_mark in enumerate(marks_data['average_marks']):
        # Students with poor marks more likely to have pending fees
        if avg_mark < 40:
            fees_paid = np.random.choice([0, 25000, 30000, 50000], p=[0.2, 0.3, 0.2, 0.3])
        elif avg_mark < 60:
            fees_paid = np.random.choice([30000, 40000, 50000], p=[0.2, 0.3, 0.5])
        else:
            fees_paid = np.random.choice([40000, 50000], p=[0.2, 0.8])
        
        fees_data['fees_paid'].append(fees_paid)
        fees_data['fees_pending'].append(50000 - fees_paid)
        
        # Generate parent contact
        fees_data['parent_contact'].append(f"98765{np.random.randint(10000, 99999)}")
        
        # Parent qualification
        fees_data['parent_qualification'].append(
            np.random.choice(['Graduate', 'Post-Graduate', 'High School', 'Diploma'],
                           p=[0.4, 0.3, 0.2, 0.1])
        )
    
    fees_df = pd.DataFrame(fees_data)
    fees_file = os.path.join(sample_dir, 'fees.csv')
    fees_df.to_csv(fees_file, index=False)
    print(f"   ✅ Created: {fees_file}")
    print(f"      Shape: {fees_df.shape}")
    
    # 4. Display summary
    print("\n📊 Sample Data Summary:")
    print("="*50)
    
    # Attendance summary
    att_stats = attendance_df['attendance_percentage'].describe()
    print("\n📅 Attendance Statistics:")
    print(f"   Mean:   {att_stats['mean']:.1f}%")
    print(f"   Min:    {att_stats['min']:.1f}%")
    print(f"   Max:    {att_stats['max']:.1f}%")
    print(f"   < 75%:  {sum(attendance_df['attendance_percentage'] < 75)} students")
    
    # Marks summary  
    marks_stats = marks_df['average_marks'].describe()
    print("\n📝 Marks Statistics:")
    print(f"   Mean:   {marks_stats['mean']:.1f}")
    print(f"   Min:    {marks_stats['min']:.1f}")
    print(f"   Max:    {marks_stats['max']:.1f}")
    print(f"   Failed: {sum(marks_df['failed_subjects'] > 0)} students have backlogs")
    
    # Fees summary
    pending_fees = fees_df['fees_pending'].sum()
    print("\n💰 Fees Statistics:")
    print(f"   Total pending: ₹{pending_fees:,}")
    print(f"   Students with dues: {sum(fees_df['fees_pending'] > 0)}")
    
    print("\n" + "="*50)
    print("✅ SAMPLE CSV FILES GENERATED SUCCESSFULLY!")
    print("="*50)
    print(f"\n📁 Files saved in: {os.path.abspath(sample_dir)}")
    print("   - attendance.csv")
    print("   - marks.csv")
    print("   - fees.csv")
    
    return attendance_df, marks_df, fees_df

if __name__ == "__main__":
    # Generate the sample files
    generate_sample_csvs()
    
    print("\n💡 You can now use these CSV files to test the system!")
    print("   Upload them through the web interface once the server is running.")