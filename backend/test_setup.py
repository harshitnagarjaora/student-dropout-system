# backend/test_setup.py
"""
Step-by-step test script to verify all installations and setup
"""

print("🔍 Testing Backend Setup Step-by-Step...")
print("=" * 50)

# Test 1: Python version
import sys
print(f"✅ Python version: {sys.version.split()[0]}")

# Test 2: Check if we're in the right directory
import os
current_dir = os.getcwd()
print(f"📁 Current directory: {current_dir}")
if "backend" not in current_dir:
    print("⚠️  Warning: You should be in the 'backend' folder")

# Test 3: Essential packages
print("\n📦 Checking installed packages:")

packages_to_test = [
    ("fastapi", "FastAPI"),
    ("pandas", "Pandas"),
    ("numpy", "NumPy"),
    ("sklearn", "Scikit-learn"),
    ("sqlalchemy", "SQLAlchemy"),
    ("uvicorn", "Uvicorn")
]

installed_count = 0
for module_name, display_name in packages_to_test:
    try:
        module = __import__(module_name)
        print(f"  ✅ {display_name} installed")
        installed_count += 1
    except ImportError:
        print(f"  ❌ {display_name} NOT installed")

print(f"\n📊 Packages installed: {installed_count}/{len(packages_to_test)}")

# Test 4: Database setup
print("\n🗄️ Testing Database Configuration:")

try:
    # Check if database.py exists
    if os.path.exists("database.py"):
        print("  ✅ database.py file exists")
        
        # Try to import from database.py
        try:
            from database import engine, Base, SessionLocal
            print("  ✅ Successfully imported from database.py")
            print(f"     - Engine: {type(engine).__name__}")
            print(f"     - Base: {type(Base).__name__}")
            print(f"     - SessionLocal: {type(SessionLocal).__name__}")
        except ImportError as e:
            print(f"  ❌ Cannot import from database.py: {e}")
    else:
        print("  ❌ database.py file not found!")
        print("     Please create database.py in the backend folder")
        
except Exception as e:
    print(f"  ❌ Database test error: {e}")

# Test 5: Models
print("\n📋 Testing Models:")

try:
    if os.path.exists("models.py"):
        print("  ✅ models.py file exists")
        
        try:
            from models import Student, Alert
            print("  ✅ Successfully imported Student and Alert models")
        except ImportError as e:
            print(f"  ❌ Cannot import models: {e}")
    else:
        print("  ❌ models.py file not found!")
        
except Exception as e:
    print(f"  ❌ Models test error: {e}")

# Test 6: Create database tables
print("\n🏗️ Creating Database Tables:")

try:
    from database import engine, Base
    from models import Student, Alert
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("  ✅ Database tables created successfully!")
    
    # Check if database file was created
    if os.path.exists("student_dropout.db"):
        file_size = os.path.getsize("student_dropout.db") / 1024  # Size in KB
        print(f"  ✅ Database file created: student_dropout.db ({file_size:.1f} KB)")
    
except Exception as e:
    print(f"  ❌ Could not create tables: {e}")

print("\n" + "=" * 50)
print("🎯 Setup Summary:")

if installed_count == len(packages_to_test):
    print("  ✅ All packages installed correctly")
else:
    print(f"  ⚠️  Some packages missing. Run: pip install -r requirements.txt")

if os.path.exists("database.py") and os.path.exists("models.py"):
    print("  ✅ Configuration files exist")
else:
    print("  ⚠️  Some configuration files missing")

print("\n💡 If you see errors above, try these fixes:")
print("  1. Make sure you're in the 'backend' folder")
print("  2. Ensure virtual environment is activated (venv)")
print("  3. Re-run: pip install -r requirements.txt")
print("  4. Check that database.py and models.py exist")