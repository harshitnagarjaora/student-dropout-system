# backend/test_api.py
"""
Test script to verify API endpoints are working
"""

import requests
import json

API_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing API Endpoints")
    print("="*50)
    
    # Test 1: Root endpoint
    print("\n1️⃣ Testing root endpoint...")
    try:
        response = requests.get(f"{API_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API is running")
            print(f"   Model loaded: {data.get('model_loaded', False)}")
        else:
            print(f"   ❌ Error: Status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to API. Is the server running?")
        print("   Run: uvicorn main:app --reload")
        return
    
    # Test 2: Get all students
    print("\n2️⃣ Testing GET /api/students...")
    try:
        response = requests.get(f"{API_URL}/api/students")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Students endpoint working")
            print(f"   Students in database: {len(data.get('data', []))}")
        else:
            print(f"   ❌ Error: Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Statistics endpoint
    print("\n3️⃣ Testing GET /api/stats...")
    try:
        response = requests.get(f"{API_URL}/api/stats")
        if response.status_code == 200:
            data = response.json()
            stats = data.get('statistics', {})
            print(f"   ✅ Statistics endpoint working")
            print(f"   Total students: {stats.get('total_students', 0)}")
            if stats.get('total_students', 0) > 0:
                print(f"   High risk: {stats.get('high_risk', 0)} ({stats.get('high_risk_percentage', 0):.1f}%)")
                print(f"   Medium risk: {stats.get('medium_risk', 0)} ({stats.get('medium_risk_percentage', 0):.1f}%)")
                print(f"   Low risk: {stats.get('low_risk', 0)} ({stats.get('low_risk_percentage', 0):.1f}%)")
        else:
            print(f"   ❌ Error: Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "="*50)
    print("✅ API test complete!")
    print("\n💡 To test file upload:")
    print("   1. Make sure sample CSV files exist in sample_data/")
    print("   2. Use the React frontend (coming next)")
    print("   3. Or use Postman/curl to test upload endpoint")

if __name__ == "__main__":
    test_api()