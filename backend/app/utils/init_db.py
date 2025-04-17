from pymongo import MongoClient
from pymongo.errors import CollectionInvalid

def init_mongodb():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["amniotic_fluid_db"]
    
    # Create collections if they don't exist
    try:
        db.create_collection("users")
    except CollectionInvalid:
        pass
    
    # Create indexes
    db.users.create_index("email", unique=True)
    
    print("Database initialized successfully")

if __name__ == "__main__":
    init_mongodb()