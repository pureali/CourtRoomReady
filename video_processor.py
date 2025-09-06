import cv2
import numpy as np
import base64
import requests
import json
import time
import threading
from datetime import datetime
import os
from typing import Dict, List, Optional
import mediapipe as mp
from deepface import DeepFace
import tempfile

class VideoProcessor:
    def __init__(self, api_key: str = None):
        """
        Initialize the video processor with emotion analysis and video-to-text capabilities
        
        Args:
            api_key: API key for video-to-text service (OpenAI, Google, etc.)
        """
        self.api_key = api_key
        self.is_processing = False
        self.emotion_history = []
        self.video_frames = []
        self.max_frames = 30  # Process every 30 frames (1 second at 30fps)
        self.frame_count = 0
        
        # Initialize MediaPipe for face detection
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_drawing = mp.solutions.drawing_utils
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=0, min_detection_confidence=0.5
        )
        
        # Create output directory
        self.output_dir = "video_analysis_output"
        os.makedirs(self.output_dir, exist_ok=True)
    
    def capture_frame_from_webcam(self) -> Optional[np.ndarray]:
        """
        Capture a single frame from the default webcam
        """
        try:
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                print("Error: Could not open webcam")
                return None
            
            ret, frame = cap.read()
            cap.release()
            
            if ret:
                return frame
            else:
                print("Error: Could not capture frame")
                return None
                
        except Exception as e:
            print(f"Error capturing frame: {e}")
            return None
    
    def analyze_emotions(self, frame: np.ndarray) -> Dict:
        """
        Analyze emotions in a video frame using DeepFace
        """
        try:
            # Convert BGR to RGB for DeepFace
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Analyze emotions
            result = DeepFace.analyze(
                rgb_frame, 
                actions=['emotion'], 
                enforce_detection=False,
                detector_backend='opencv'
            )
            
            if isinstance(result, list):
                result = result[0]
            
            emotions = result.get('emotion', {})
            
            # Get dominant emotion
            dominant_emotion = max(emotions, key=emotions.get) if emotions else "neutral"
            
            return {
                'timestamp': datetime.now().isoformat(),
                'emotions': emotions,
                'dominant_emotion': dominant_emotion,
                'confidence': emotions.get(dominant_emotion, 0) if emotions else 0
            }
            
        except Exception as e:
            print(f"Error analyzing emotions: {e}")
            return {
                'timestamp': datetime.now().isoformat(),
                'emotions': {},
                'dominant_emotion': 'unknown',
                'confidence': 0,
                'error': str(e)
            }
    
    def detect_faces(self, frame: np.ndarray) -> List[Dict]:
        """
        Detect faces in the frame using MediaPipe
        """
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_detection.process(rgb_frame)
            
            faces = []
            if results.detections:
                for detection in results.detections:
                    bbox = detection.location_data.relative_bounding_box
                    h, w, _ = frame.shape
                    
                    face_info = {
                        'x': int(bbox.xmin * w),
                        'y': int(bbox.ymin * h),
                        'width': int(bbox.width * w),
                        'height': int(bbox.height * h),
                        'confidence': detection.score[0]
                    }
                    faces.append(face_info)
            
            return faces
            
        except Exception as e:
            print(f"Error detecting faces: {e}")
            return []
    
    def save_frame(self, frame: np.ndarray, filename: str) -> str:
        """
        Save frame to file
        """
        filepath = os.path.join(self.output_dir, filename)
        cv2.imwrite(filepath, frame)
        return filepath
    
    def frame_to_base64(self, frame: np.ndarray) -> str:
        """
        Convert frame to base64 string for API calls
        """
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        return frame_base64
    
    def video_to_text_openai(self, video_frames: List[np.ndarray]) -> str:
        """
        Convert video frames to text using OpenAI's vision model
        """
        if not self.api_key:
            return "API key not provided for video-to-text conversion"
        
        try:
            # Convert frames to base64
            frame_data = []
            for i, frame in enumerate(video_frames[:5]):  # Limit to 5 frames
                base64_frame = self.frame_to_base64(frame)
                frame_data.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_frame}"
                    }
                })
            
            # Prepare messages
            messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this video sequence and describe what you see. Focus on facial expressions, emotions, and any notable visual elements. Provide a detailed description."
                        }
                    ] + frame_data
                }
            ]
            
            # Call OpenAI API
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "gpt-4-vision-preview",
                "messages": messages,
                "max_tokens": 500
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                return result['choices'][0]['message']['content']
            else:
                return f"Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            return f"Error in video-to-text conversion: {e}"
    
    def video_to_text_google(self, video_frames: List[np.ndarray]) -> str:
        """
        Convert video frames to text using Google's vision API
        """
        if not self.api_key:
            return "API key not provided for Google Vision API"
        
        try:
            # For Google Vision, we'll analyze each frame separately
            descriptions = []
            
            for i, frame in enumerate(video_frames[:3]):  # Limit to 3 frames
                base64_frame = self.frame_to_base64(frame)
                
                # Google Vision API request
                url = f"https://vision.googleapis.com/v1/images:annotate?key={self.api_key}"
                
                data = {
                    "requests": [
                        {
                            "image": {
                                "content": base64_frame
                            },
                            "features": [
                                {
                                    "type": "LABEL_DETECTION",
                                    "maxResults": 10
                                },
                                {
                                    "type": "FACE_DETECTION",
                                    "maxResults": 10
                                }
                            ]
                        }
                    ]
                }
                
                response = requests.post(url, json=data)
                
                if response.status_code == 200:
                    result = response.json()
                    if 'responses' in result and result['responses']:
                        response_data = result['responses'][0]
                        
                        # Extract labels
                        labels = []
                        if 'labelAnnotations' in response_data:
                            labels = [label['description'] for label in response_data['labelAnnotations']]
                        
                        # Extract face emotions
                        emotions = []
                        if 'faceAnnotations' in response_data:
                            for face in response_data['faceAnnotations']:
                                if 'joyLikelihood' in face:
                                    emotions.append(f"Joy: {face['joyLikelihood']}")
                                if 'sorrowLikelihood' in face:
                                    emotions.append(f"Sorrow: {face['sorrowLikelihood']}")
                                if 'angerLikelihood' in face:
                                    emotions.append(f"Anger: {face['angerLikelihood']}")
                                if 'surpriseLikelihood' in face:
                                    emotions.append(f"Surprise: {face['surpriseLikelihood']}")
                        
                        frame_desc = f"Frame {i+1}: Labels: {', '.join(labels[:5])}. Emotions: {', '.join(emotions[:3])}"
                        descriptions.append(frame_desc)
            
            return "Video Analysis:\n" + "\n".join(descriptions)
            
        except Exception as e:
            return f"Error in Google Vision API: {e}"
    
    def process_video_stream(self, duration_seconds: int = 10, 
                           emotion_interval: float = 1.0,
                           save_frames: bool = True) -> Dict:
        """
        Process video stream for specified duration
        
        Args:
            duration_seconds: How long to process the video
            emotion_interval: How often to analyze emotions (in seconds)
            save_frames: Whether to save frames to disk
        """
        print(f"Starting video processing for {duration_seconds} seconds...")
        
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            return {"error": "Could not open webcam"}
        
        start_time = time.time()
        last_emotion_time = 0
        frames_processed = []
        emotion_data = []
        
        try:
            while time.time() - start_time < duration_seconds:
                ret, frame = cap.read()
                if not ret:
                    break
                
                current_time = time.time()
                
                # Analyze emotions at specified intervals
                if current_time - last_emotion_time >= emotion_interval:
                    emotion_result = self.analyze_emotions(frame)
                    emotion_data.append(emotion_result)
                    last_emotion_time = current_time
                    
                    print(f"Emotion: {emotion_result['dominant_emotion']} "
                          f"(confidence: {emotion_result['confidence']:.2f})")
                
                # Save frames periodically
                if save_frames and len(frames_processed) < 10:
                    filename = f"frame_{len(frames_processed):03d}_{int(current_time)}.jpg"
                    self.save_frame(frame, filename)
                    frames_processed.append(frame)
                
                # Display frame (optional)
                cv2.imshow('Video Processing', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
        
        finally:
            cap.release()
            cv2.destroyAllWindows()
        
        # Generate video-to-text description
        video_description = ""
        if frames_processed and self.api_key:
            print("Generating video-to-text description...")
            video_description = self.video_to_text_openai(frames_processed)
        
        # Compile results
        results = {
            'processing_duration': time.time() - start_time,
            'frames_processed': len(frames_processed),
            'emotion_analysis': emotion_data,
            'video_description': video_description,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save results to file
        results_file = os.path.join(self.output_dir, f"analysis_{int(time.time())}.json")
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"Analysis complete. Results saved to {results_file}")
        return results
    
    def get_emotion_summary(self, emotion_data: List[Dict]) -> Dict:
        """
        Generate summary of emotion analysis
        """
        if not emotion_data:
            return {"error": "No emotion data available"}
        
        # Count emotions
        emotion_counts = {}
        total_confidence = 0
        
        for data in emotion_data:
            emotion = data['dominant_emotion']
            confidence = data['confidence']
            
            if emotion not in emotion_counts:
                emotion_counts[emotion] = {'count': 0, 'total_confidence': 0}
            
            emotion_counts[emotion]['count'] += 1
            emotion_counts[emotion]['total_confidence'] += confidence
            total_confidence += confidence
        
        # Calculate averages
        for emotion in emotion_counts:
            emotion_counts[emotion]['avg_confidence'] = (
                emotion_counts[emotion]['total_confidence'] / 
                emotion_counts[emotion]['count']
            )
        
        # Find most common emotion
        most_common = max(emotion_counts, key=lambda x: emotion_counts[x]['count'])
        
        return {
            'most_common_emotion': most_common,
            'emotion_distribution': emotion_counts,
            'total_samples': len(emotion_data),
            'average_confidence': total_confidence / len(emotion_data) if emotion_data else 0
        }

# Example usage
if __name__ == "__main__":
    # Initialize processor (replace with your API key)
    processor = VideoProcessor(api_key="your-openai-api-key-here")
    
    # Process video for 10 seconds
    results = processor.process_video_stream(
        duration_seconds=10,
        emotion_interval=1.0,
        save_frames=True
    )
    
    # Print emotion summary
    if 'emotion_analysis' in results:
        summary = processor.get_emotion_summary(results['emotion_analysis'])
        print("\nEmotion Summary:")
        print(json.dumps(summary, indent=2))
    
    # Print video description
    if results.get('video_description'):
        print(f"\nVideo Description:\n{results['video_description']}") 