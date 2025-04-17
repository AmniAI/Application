from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, prediction

app = FastAPI(title="Amniotic Fluid Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(prediction.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Amniotic Fluid Analysis API"}