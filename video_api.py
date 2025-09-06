from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from simple_video_processor import SimpleVideoProcessor

app = FastAPI(title="Simple Video Analysis API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processor
processor = SimpleVideoProcessor()

class FrameData(BaseModel):
    frame_data: str  # Base64 encoded image
    timestamp: str
    save_frame: bool = False

class AnalysisRequest(BaseModel):
    duration: int = 10
    save_frames: bool = True

@app.post("/api/analyze-frame")
async def analyze_frame(frame_data: FrameData):
    """
    Analyze a single frame from the user video
    """
    try:
        result = processor.process_frame_from_base64(
            frame_data.frame_data, 
            save_frame=frame_data.save_frame
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analysis-summary")
async def get_analysis_summary():
    """
    Get summary of all frame analyses
    """
    try:
        summary = processor.get_analysis_summary()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/save-analysis")
async def save_analysis():
    """
    Save all analysis data to file
    """
    try:
        filepath = processor.save_analysis_to_file()
        return {"message": "Analysis saved", "filepath": filepath}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def get_status():
    """
    Get API status
    """
    return {
        "status": "running",
        "frames_analyzed": len(processor.emotion_history),
        "processor_ready": True
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003) 