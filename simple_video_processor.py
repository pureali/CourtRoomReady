import cv2
import numpy as np
import base64
import json
import time
from datetime import datetime
import os
from typing import Dict, List, Optional

class SimpleVideoProcessor:
    def __init__(self):
        """
        Enhanced video processor with improved eye detection
        """
        self.emotion_history = []
        self.output_dir = "video_analysis_output"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Load face and eye detection cascades
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        # Alternative eye detection using face landmarks
        self.eye_pair_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')
        
        # Eye tracking variables
        self.eye_history = []
        self.gaze_direction_history = []
    
    def convert_numpy_types(self, obj):
        """
        Convert NumPy types to native Python types for JSON serialization
        """
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, np.bool_):
            return bool(obj)
        elif isinstance(obj, dict):
            return {key: self.convert_numpy_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self.convert_numpy_types(item) for item in obj]
        elif isinstance(obj, tuple):
            return tuple(self.convert_numpy_types(item) for item in obj)
        else:
            return obj
    
    def base64_to_frame(self, base64_string: str) -> Optional[np.ndarray]:
        """
        Convert base64 string to OpenCV frame
        """
        try:
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            
            # Decode base64
            image_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return frame
        except Exception as e:
            print(f"Error converting base64 to frame: {e}")
            return None
    
    def frame_to_base64(self, frame: np.ndarray) -> str:
        """
        Convert OpenCV frame to base64 string
        """
        try:
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            return frame_base64
        except Exception as e:
            print(f"Error converting frame to base64: {e}")
            return ""
    
    def detect_faces(self, frame: np.ndarray) -> List[Dict]:
        """
        Detect faces in frame using OpenCV's Haar Cascade
        """
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            
            face_data = []
            for (x, y, w, h) in faces:
                face_data.append({
                    'x': int(x),
                    'y': int(y),
                    'width': int(w),
                    'height': int(h),
                    'confidence': 0.8
                })
            
            return face_data
        except Exception as e:
            print(f"Error detecting faces: {e}")
            return []
    
    def detect_eyes_improved(self, frame: np.ndarray, face_region: Dict = None) -> List[Dict]:
        """
        Improved eye detection using multiple methods
        """
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            eyes = []
            
            if face_region:
                # Detect eyes within face region
                x, y, w, h = face_region['x'], face_region['y'], face_region['width'], face_region['height']
                roi_gray = gray[y:y+h, x:x+w]
                
                # Method 1: Standard eye cascade
                eyes1 = self.eye_cascade.detectMultiScale(roi_gray, 1.1, 3, minSize=(20, 20))
                
                # Method 2: Eye pair cascade (for glasses)
                eyes2 = self.eye_pair_cascade.detectMultiScale(roi_gray, 1.1, 3, minSize=(30, 15))
                
                # Combine results
                all_eyes = list(eyes1) + list(eyes2)
                
                # Convert coordinates back to full frame and deduplicate
                eye_data = []
                for (ex, ey, ew, eh) in all_eyes:
                    eye_center_x = x + ex + ew/2
                    eye_center_y = y + ey + eh/2
                    
                    # Check if this eye is too close to existing eyes (deduplication)
                    is_duplicate = False
                    for existing_eye in eye_data:
                        distance = np.sqrt((eye_center_x - existing_eye['center_x'])**2 + 
                                         (eye_center_y - existing_eye['center_y'])**2)
                        if distance < 30:  # Too close, likely duplicate
                            is_duplicate = True
                            break
                    
                    if not is_duplicate:
                        eye_data.append({
                            'x': int(x + ex),
                            'y': int(y + ey),
                            'width': int(ew),
                            'height': int(eh),
                            'center_x': int(eye_center_x),
                            'center_y': int(eye_center_y),
                            'confidence': 0.8
                        })
                
                # Sort eyes by x position (left to right)
                eye_data.sort(key=lambda e: e['center_x'])
                
            else:
                # Detect eyes in entire frame
                eyes1 = self.eye_cascade.detectMultiScale(gray, 1.1, 3, minSize=(20, 20))
                eyes2 = self.eye_pair_cascade.detectMultiScale(gray, 1.1, 3, minSize=(30, 15))
                
                all_eyes = list(eyes1) + list(eyes2)
                eye_data = []
                
                for (ex, ey, ew, eh) in all_eyes:
                    eye_data.append({
                        'x': int(ex),
                        'y': int(ey),
                        'width': int(ew),
                        'height': int(eh),
                        'center_x': int(ex + ew/2),
                        'center_y': int(ey + eh/2),
                        'confidence': 0.8
                    })
                
                # Sort eyes by x position
                eye_data.sort(key=lambda e: e['center_x'])
            
            return eye_data
            
        except Exception as e:
            print(f"Error detecting eyes: {e}")
            return []
    
    def analyze_gaze_direction_improved(self, eyes: List[Dict], face: Dict, frame_shape: tuple) -> Dict:
        """
        Improved gaze direction analysis
        """
        try:
            if len(eyes) < 1:
                return {
                    'gaze_direction': 'no_eyes',
                    'confidence': 0.0,
                    'is_looking_at_screen': False,
                    'reason': 'no_eyes_detected'
                }
            
            # Calculate face center
            face_center_x = face['x'] + face['width'] / 2
            face_center_y = face['y'] + face['height'] / 2
            
            # Calculate frame center
            frame_center_x = frame_shape[1] / 2  # width
            frame_center_y = frame_shape[0] / 2  # height
            
            if len(eyes) >= 2:
                # Use both eyes for more accurate gaze detection
                left_eye = eyes[0]
                right_eye = eyes[1]
                
                # Calculate eye line center
                eye_line_center_x = (left_eye['center_x'] + right_eye['center_x']) / 2
                eye_line_center_y = (left_eye['center_y'] + right_eye['center_y']) / 2
                
                # Calculate eye line angle
                eye_dx = right_eye['center_x'] - left_eye['center_x']
                eye_dy = right_eye['center_y'] - left_eye['center_y']
                eye_angle = np.arctan2(eye_dy, eye_dx) * 180 / np.pi
                
            else:
                # Use single eye
                eye = eyes[0]
                eye_line_center_x = eye['center_x']
                eye_line_center_y = eye['center_y']
                eye_angle = 0.0
            
            # Determine gaze direction
            gaze_direction = self.determine_gaze_direction_improved(
                eye_line_center_x, eye_line_center_y,
                frame_center_x, frame_center_y,
                face_center_x, face_center_y,
                eye_angle
            )
            
            # Check if looking at screen
            is_looking_at_screen = self.is_looking_at_screen_improved(
                eye_line_center_x, eye_line_center_y,
                frame_center_x, frame_center_y,
                face_center_x, face_center_y
            )
            
            return {
                'gaze_direction': gaze_direction,
                'confidence': 0.9 if len(eyes) >= 2 else 0.6,
                'is_looking_at_screen': bool(is_looking_at_screen),
                'eye_positions': {
                    'eyes_detected': len(eyes),
                    'eye_line_center': (float(eye_line_center_x), float(eye_line_center_y)),
                    'eye_angle': float(eye_angle)
                },
                'frame_center': (float(frame_center_x), float(frame_center_y)),
                'face_center': (float(face_center_x), float(face_center_y))
            }
            
        except Exception as e:
            return {
                'gaze_direction': 'error',
                'confidence': 0.0,
                'is_looking_at_screen': False,
                'reason': f'error: {str(e)}'
            }
    
    def determine_gaze_direction_improved(self, eye_x, eye_y, frame_center_x, frame_center_y, face_x, face_y, eye_angle) -> str:
        """
        Improved gaze direction determination
        """
        # Calculate offsets from frame center
        offset_x = eye_x - frame_center_x
        offset_y = eye_y - frame_center_y
        
        # Normalize offsets (as percentage of frame)
        frame_width = frame_center_x * 2
        frame_height = frame_center_y * 2
        
        norm_offset_x = offset_x / (frame_width / 2)
        norm_offset_y = offset_y / (frame_height / 2)
        
        # Check for head tilt (if eyes are not level)
        if abs(eye_angle) > 15:
            if eye_angle > 0:
                return 'tilted_right'
            else:
                return 'tilted_left'
        
        # Determine direction based on normalized offsets
        if abs(norm_offset_x) < 0.15 and abs(norm_offset_y) < 0.15:
            return 'center'
        elif norm_offset_x < -0.25:
            return 'left'
        elif norm_offset_x > 0.25:
            return 'right'
        elif norm_offset_y < -0.25:
            return 'up'
        elif norm_offset_y > 0.25:
            return 'down'
        else:
            return 'center'
    
    def is_looking_at_screen_improved(self, eye_x, eye_y, frame_center_x, frame_center_y, face_x, face_y) -> bool:
        """
        Improved screen looking detection
        """
        # Calculate distance from frame center
        distance_from_center = np.sqrt(
            (eye_x - frame_center_x)**2 + (eye_y - frame_center_y)**2
        )
        
        # Calculate face size relative to frame
        frame_diagonal = np.sqrt(frame_center_x**2 + frame_center_y**2)
        face_size = np.sqrt((face_x - frame_center_x)**2 + (face_y - frame_center_y)**2)
        
        # Dynamic acceptable distance based on face size
        if face_size < frame_diagonal * 0.1:  # Small face (far from camera)
            acceptable_distance = frame_diagonal * 0.4
        else:  # Large face (close to camera)
            acceptable_distance = frame_diagonal * 0.25
        
        return bool(distance_from_center <= acceptable_distance)
    
    def analyze_frame_simple(self, frame: np.ndarray) -> Dict:
        """
        Enhanced frame analysis with improved eye detection
        """
        try:
            # Detect faces
            faces = self.detect_faces(frame)
            
            # Simple brightness analysis
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness = float(np.mean(gray))
            
            # Simple color analysis
            b, g, r = cv2.split(frame)
            avg_color = {
                'blue': float(np.mean(b)),
                'green': float(np.mean(g)),
                'red': float(np.mean(r))
            }
            
            # Enhanced eye detection and gaze analysis
            eye_analysis = {
                'eyes_detected': 0,
                'eye_data': [],
                'gaze_analysis': None
            }
            
            if faces:
                # Detect eyes in the first (largest) face
                primary_face = max(faces, key=lambda f: f['width'] * f['height'])
                eyes = self.detect_eyes_improved(frame, primary_face)
                eye_analysis['eyes_detected'] = len(eyes)
                eye_analysis['eye_data'] = eyes
                
                # Analyze gaze direction
                if eyes:
                    gaze_analysis = self.analyze_gaze_direction_improved(eyes, primary_face, frame.shape)
                    eye_analysis['gaze_analysis'] = gaze_analysis
                else:
                    # No eyes detected, but face is present
                    eye_analysis['gaze_analysis'] = {
                        'gaze_direction': 'no_eyes',
                        'confidence': 0.0,
                        'is_looking_at_screen': False,
                        'reason': 'eyes_not_detected_in_face'
                    }
            
            # Estimate emotion based on simple heuristics
            estimated_emotion = self.estimate_emotion_simple(frame, faces, brightness)
            
            result = {
                'timestamp': datetime.now().isoformat(),
                'faces_detected': len(faces),
                'face_data': faces,
                'brightness': brightness,
                'avg_color': avg_color,
                'estimated_emotion': estimated_emotion,
                'frame_quality': 'good' if len(faces) > 0 else 'no_face_detected',
                'eye_analysis': eye_analysis
            }
            
            # Convert all NumPy types to native Python types
            return self.convert_numpy_types(result)
            
        except Exception as e:
            return {
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'faces_detected': 0,
                'estimated_emotion': 'unknown',
                'eye_analysis': {
                    'eyes_detected': 0,
                    'eye_data': [],
                    'gaze_analysis': None
                }
            }
    
    def estimate_emotion_simple(self, frame: np.ndarray, faces: List[Dict], brightness: float) -> str:
        """
        Simple emotion estimation based on basic image features
        """
        if len(faces) == 0:
            return 'no_face'
        
        # Simple heuristics
        if brightness < 80:
            return 'neutral'  # Dark image
        elif brightness > 200:
            return 'happy'    # Bright image
        else:
            return 'neutral'  # Normal brightness
    
    def save_frame(self, frame: np.ndarray, filename: str) -> str:
        """
        Save frame to file
        """
        try:
            filepath = os.path.join(self.output_dir, filename)
            cv2.imwrite(filepath, frame)
            return filepath
        except Exception as e:
            print(f"Error saving frame: {e}")
            return ""
    
    def process_frame_from_base64(self, base64_data: str, save_frame: bool = False) -> Dict:
        """
        Process a single frame from base64 data
        """
        frame = self.base64_to_frame(base64_data)
        if frame is None:
            return {'error': 'Could not decode frame'}
        
        # Analyze frame
        analysis = self.analyze_frame_simple(frame)
        
        # Save frame if requested
        if save_frame:
            timestamp = int(time.time())
            filename = f"frame_{timestamp}.jpg"
            filepath = self.save_frame(frame, filename)
            analysis['saved_frame'] = filepath
        
        # Add to history
        self.emotion_history.append(analysis)
        
        return analysis
    
    def get_analysis_summary(self) -> Dict:
        """
        Get summary of all analyses including eye tracking
        """
        if not self.emotion_history:
            return {'message': 'No analysis data available'}
        
        total_frames = len(self.emotion_history)
        total_faces = sum(analysis.get('faces_detected', 0) for analysis in self.emotion_history)
        total_eyes = sum(analysis.get('eye_analysis', {}).get('eyes_detected', 0) for analysis in self.emotion_history)
        
        # Count emotions and gaze directions
        emotion_counts = {}
        gaze_directions = {}
        looking_at_screen_count = 0
        
        for analysis in self.emotion_history:
            emotion = analysis.get('estimated_emotion', 'unknown')
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
            
            # Eye tracking statistics
            gaze_analysis = analysis.get('eye_analysis', {}).get('gaze_analysis')
            if gaze_analysis:
                gaze_dir = gaze_analysis.get('gaze_direction', 'unknown')
                gaze_directions[gaze_dir] = gaze_directions.get(gaze_dir, 0) + 1
                
                if gaze_analysis.get('is_looking_at_screen', False):
                    looking_at_screen_count += 1
        
        summary = {
            'total_frames_analyzed': total_frames,
            'total_faces_detected': total_faces,
            'total_eyes_detected': total_eyes,
            'emotion_distribution': emotion_counts,
            'gaze_direction_distribution': gaze_directions,
            'looking_at_screen_percentage': float(looking_at_screen_count / total_frames * 100) if total_frames > 0 else 0.0,
            'average_brightness': float(np.mean([a.get('brightness', 0) for a in self.emotion_history])),
            'analysis_period': {
                'start': self.emotion_history[0]['timestamp'] if self.emotion_history else None,
                'end': self.emotion_history[-1]['timestamp'] if self.emotion_history else None
            }
        }
        
        # Convert all NumPy types to native Python types
        return self.convert_numpy_types(summary)
    
    def save_analysis_to_file(self, filename: str = None) -> str:
        """
        Save all analysis data to JSON file
        """
        if filename is None:
            filename = f"analysis_{int(time.time())}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        
        data = {
            'summary': self.get_analysis_summary(),
            'detailed_analysis': self.emotion_history,
            'exported_at': datetime.now().isoformat()
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        
        return filepath

# Example usage
if __name__ == "__main__":
    processor = SimpleVideoProcessor()
    
    # Test with a sample frame
    print("Enhanced Video Processor with improved eye tracking initialized")
    print("Ready to process frames from court_room.html") 