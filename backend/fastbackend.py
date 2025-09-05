from fastapi import FastAPI
from typing import Dict
from pydantic import BaseModel
import uvicorn
app = FastAPI(title="Virtual Court API", version="1.0.0")
from fastapi.middleware.cors import CORSMiddleware
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Item(BaseModel):
    name: str
    value: int


@app.post("/api/new_application")
async def new_application(data: Dict[str, str]):
    message = data.get("user", "")
    return {"message": f"Received: {message}"}
@app.post("/api/message")
async def post_message(data: Dict[str, str]):
    message = data.get("message", "")
    return {"message": f"Received: {message}"}
@app.get("/api/status")
async def get_status():
    return {"status": "running perfectly"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, query_params: Dict[str, str] = {}):
    return {
        "item_id": item_id,
        "query_params": query_params
    }

@app.post("/items/")
async def create_item(item: Item, metadata: Dict[str, str] = {}):
    return {
        "item": item.dict(),
        "metadata": metadata
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)