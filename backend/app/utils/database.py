from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "amniotic_fluid_db"

# Async client for FastAPI
async def get_database():
    client = AsyncIOMotorClient(MONGO_URL)
    return client[DATABASE_NAME]

# Sync client for initialization
def init_database():
    client = MongoClient(MONGO_URL)
    return client[DATABASE_NAME]