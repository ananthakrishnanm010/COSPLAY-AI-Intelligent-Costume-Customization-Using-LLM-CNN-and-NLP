from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="COSPLAY AI",
    description="Intelligent Clothing Customization System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CustomizationRequest(BaseModel):
    brand: str
    garment_type: str
    size: str
    prompt: str


@app.get("/")
def home():
    return {
        "message": "COSPLAY AI API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.post("/customize")
def customize(request: CustomizationRequest):

    return {
        "message": "Customization request received",
        "data": {
            "brand": request.brand,
            "garment_type": request.garment_type,
            "size": request.size,
            "prompt": request.prompt
        }
    }