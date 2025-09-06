class VideoAnalyzer {
    constructor() {
        this.isAnalyzing = false;
        this.analysisInterval = null;
        this.apiBaseUrl = 'http://localhost:8003/api';
        this.frameCount = 0;
        this.expressionHistory = [];
        this.eyeTrackingHistory = [];
    }

    async startAnalysis(intervalSeconds = 2) {
        if (this.isAnalyzing) {
            console.log('Analysis already running');
            return;
        }

        const userVideo = document.getElementById('userVideo');
        if (!userVideo || !userVideo.srcObject) {
            console.error('User video not found or not started');
            alert('Please start the court proceedings first to enable video analysis.');
            return;
        }

        this.isAnalyzing = true;
        console.log('Starting enhanced video analysis with eye tracking...');

        // Create canvas to capture frames
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        this.analysisInterval = setInterval(async () => {
            try {
                // Set canvas size to match video
                canvas.width = userVideo.videoWidth;
                canvas.height = userVideo.videoHeight;
                
                // Draw current video frame to canvas
                ctx.drawImage(userVideo, 0, 0, canvas.width, canvas.height);
                
                // Convert to base64
                const frameData = canvas.toDataURL('image/jpeg', 0.8);
                
                // Send to API
                await this.sendFrameForAnalysis(frameData);
                
                this.frameCount++;
                
            } catch (error) {
                console.error('Error in frame analysis:', error);
            }
        }, intervalSeconds * 1000);
    }

    async stopAnalysis() {
        if (!this.isAnalyzing) {
            return;
        }

        this.isAnalyzing = false;
        if (this.analysisInterval) {
            clearInterval(this.analysisInterval);
            this.analysisInterval = null;
        }

        console.log(`Analysis stopped. Processed ${this.frameCount} frames.`);
        
        // Save analysis data
        try {
            const response = await fetch(`${this.apiBaseUrl}/save-analysis`, {
                method: 'POST'
            });
            const result = await response.json();
            console.log('Analysis saved:', result);
        } catch (error) {
            console.error('Error saving analysis:', error);
        }
    }

    async sendFrameForAnalysis(frameData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/analyze-frame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    frame_data: frameData,
                    timestamp: new Date().toISOString(),
                    save_frame: this.frameCount % 10 === 0  // Save every 10th frame
                })
            });

            if (response.ok) {
                const result = await response.json();
                // Removed displayAnalysisResult call - no more right side display
                this.generateExpressionSuggestion(result);
                this.trackEyeGaze(result);
            } else {
                console.error('API request failed:', response.status);
            }
        } catch (error) {
            console.error('Error sending frame for analysis:', error);
        }
    }

    trackEyeGaze(analysis) {
        const eyeAnalysis = analysis.eye_analysis || {};
        const gazeAnalysis = eyeAnalysis.gaze_analysis;
        
        if (gazeAnalysis) {
            this.eyeTrackingHistory.push({
                timestamp: analysis.timestamp,
                gaze_direction: gazeAnalysis.gaze_direction,
                is_looking_at_screen: gazeAnalysis.is_looking_at_screen,
                confidence: gazeAnalysis.confidence
            });
            
            // Keep only last 10 entries
            if (this.eyeTrackingHistory.length > 10) {
                this.eyeTrackingHistory.shift();
            }
        }
    }

    generateExpressionSuggestion(analysis) {
        const suggestions = this.getExpressionSuggestions(analysis);
        this.displayExpressionSuggestion(suggestions);
    }

    getExpressionSuggestions(analysis) {
        const faces = analysis.faces_detected || 0;
        const brightness = analysis.brightness || 0;
        const emotion = analysis.estimated_emotion || 'unknown';
        const eyeAnalysis = analysis.eye_analysis || {};
        const gazeAnalysis = eyeAnalysis.gaze_analysis;
        
        let suggestions = [];
        
        // Face detection suggestions
        if (faces === 0) {
            suggestions.push({
                type: 'warning',
                message: ' No face detected - Make sure you\'re facing the camera',
                priority: 'high'
            });
        } else if (faces > 1) {
            suggestions.push({
                type: 'info',
                message: '👥 Multiple faces detected - Try to be the only person in frame',
                priority: 'medium'
            });
        }
        
        // Eye tracking suggestions
        if (gazeAnalysis) {
            const eyesDetected = eyeAnalysis.eyes_detected || 0;
            const isLookingAtScreen = gazeAnalysis.is_looking_at_screen;
            const gazeDirection = gazeAnalysis.gaze_direction;
            
            if (eyesDetected === 0) {
                suggestions.push({
                    type: 'warning',
                    message: '️ Eyes not detected - Ensure good lighting and face the camera',
                    priority: 'high'
                });
            } else if (eyesDetected === 1) {
                suggestions.push({
                    type: 'warning',
                    message: '👁️ Only one eye visible - Adjust head position',
                    priority: 'medium'
                });
            } else if (!isLookingAtScreen) {
                suggestions.push({
                    type: 'warning',
                    message: `👀 Not looking at screen - Gaze direction: ${gazeDirection}`,
                    priority: 'high'
                });
            } else {
                // Provide gaze-specific suggestions
                const gazeSuggestions = this.getGazeSpecificSuggestions(gazeDirection);
                suggestions = suggestions.concat(gazeSuggestions);
            }
        }
        
        // Lighting suggestions
        if (brightness < 80) {
            suggestions.push({
                type: 'warning',
                message: ' Too dark - Move to better lighting or turn on lights',
                priority: 'high'
            });
        } else if (brightness > 200) {
            suggestions.push({
                type: 'warning',
                message: '☀️ Too bright - Avoid direct sunlight or bright lights',
                priority: 'medium'
            });
        }
        
        // Expression suggestions based on context
        const courtExpressions = this.getCourtExpressionSuggestions(emotion, faces, brightness, gazeAnalysis);
        suggestions = suggestions.concat(courtExpressions);
        
        return suggestions;
    }

    getGazeSpecificSuggestions(gazeDirection) {
        const suggestions = [];
        
        switch (gazeDirection) {
            case 'left':
                suggestions.push({
                    type: 'tip',
                    message: ' Looking left - Try to look at the center of the screen',
                    priority: 'medium'
                });
                break;
            case 'right':
                suggestions.push({
                    type: 'tip',
                    message: '👉 Looking right - Try to look at the center of the screen',
                    priority: 'medium'
                });
                break;
            case 'up':
                suggestions.push({
                    type: 'tip',
                    message: ' Looking up - Lower your gaze to the screen',
                    priority: 'medium'
                });
                break;
            case 'down':
                suggestions.push({
                    type: 'tip',
                    message: '👇 Looking down - Raise your gaze to the screen',
                    priority: 'medium'
                });
                break;
            case 'center':
                suggestions.push({
                    type: 'success',
                    message: '✅ Perfect! Looking at the screen',
                    priority: 'low'
                });
                break;
            default:
                suggestions.push({
                    type: 'info',
                    message: '👁️ Eye direction unclear - Ensure good lighting',
                    priority: 'medium'
                });
        }
        
        return suggestions;
    }

    getCourtExpressionSuggestions(emotion, faces, brightness, gazeAnalysis) {
        const suggestions = [];
        
        // Court-appropriate expression suggestions
        if (faces > 0 && brightness >= 80 && brightness <= 200) {
            const isLookingAtScreen = gazeAnalysis?.is_looking_at_screen;
            
            if (isLookingAtScreen) {
                suggestions.push({
                    type: 'success',
                    message: '✅ Excellent eye contact - Maintain this focus',
                    priority: 'low'
                });
            }
            
            // Suggest different expressions based on court context
            const courtTips = [
                '🎯 Maintain eye contact with the judge',
                '😐 Keep a neutral, respectful expression',
                '👔 Sit up straight and appear confident',
                '🤝 Show respect through body language',
                '📝 Take notes when appropriate',
                '⚖️ Listen carefully to all proceedings',
                '️ Keep your eyes on the screen/camera',
                '🎭 Maintain professional demeanor'
            ];
            
            // Rotate through tips
            const tipIndex = this.frameCount % courtTips.length;
            suggestions.push({
                type: 'tip',
                message: courtTips[tipIndex],
                priority: 'low'
            });
        }
        
        return suggestions;
    }

    displayExpressionSuggestion(suggestions) {
        // Create or update expression suggestion box
        let suggestionBox = document.getElementById('expression-suggestion-box');
        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.id = 'expression-suggestion-box';
            suggestionBox.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 320px;
                z-index: 1000;
                border-left: 4px solid #3498db;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(suggestionBox);
        }

        // Get the highest priority suggestion
        const highPriority = suggestions.filter(s => s.priority === 'high');
        const mediumPriority = suggestions.filter(s => s.priority === 'medium');
        const lowPriority = suggestions.filter(s => s.priority === 'low');
        
        const displaySuggestion = highPriority[0] || mediumPriority[0] || lowPriority[0];
        
        if (displaySuggestion) {
            const colorMap = {
                'warning': '#e74c3c',
                'info': '#f39c12',
                'success': '#27ae60',
                'tip': '#3498db'
            };
            
            suggestionBox.style.borderLeftColor = colorMap[displaySuggestion.type] || '#3498db';
            suggestionBox.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px; color: ${colorMap[displaySuggestion.type]}">
                    💡 Expression & Eye Tracking Suggestion
                </div>
                <div style="margin-bottom: 8px;">
                    ${displaySuggestion.message}
                </div>
                <div style="font-size: 11px; opacity: 0.7; border-top: 1px solid #444; padding-top: 8px;">
                    📊 Analysis: ${this.frameCount} frames processed
                </div>
            `;
        }
    }

    // Removed displayAnalysisResult method - no more right side display

    async getAnalysisSummary() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/analysis-summary`);
            const summary = await response.json();
            console.log('Enhanced Analysis Summary:', summary);
            
            // Display summary in an alert or modal
            let summaryText = `Enhanced Analysis Summary:\n\n`;
            summaryText += `Total Frames: ${summary.total_frames_analyzed || 0}\n`;
            summaryText += `Faces Detected: ${summary.total_faces_detected || 0}\n`;
            summaryText += `Eyes Detected: ${summary.total_eyes_detected || 0}\n`;
            summaryText += `Looking at Screen: ${summary.looking_at_screen_percentage?.toFixed(1) || 0}%\n`;
            summaryText += `Average Brightness: ${summary.average_brightness?.toFixed(0) || 'N/A'}\n\n`;
            
            if (summary.gaze_direction_distribution) {
                summaryText += `Gaze Directions:\n`;
                for (const [direction, count] of Object.entries(summary.gaze_direction_distribution)) {
                    summaryText += `${direction}: ${count}\n`;
                }
                summaryText += '\n';
            }
            
            if (summary.emotion_distribution) {
                summaryText += `Emotion Distribution:\n`;
                for (const [emotion, count] of Object.entries(summary.emotion_distribution)) {
                    summaryText += `${emotion}: ${count}\n`;
                }
            }
            
            alert(summaryText);
            return summary;
        } catch (error) {
            console.error('Error getting analysis summary:', error);
            alert('Error getting analysis summary. Make sure the API server is running.');
            return null;
        }
    }
}

// Initialize analyzer and make it globally available
const videoAnalyzer = new VideoAnalyzer();
window.videoAnalyzer = videoAnalyzer;

console.log('Enhanced video analyzer with eye tracking loaded successfully');

// Add analysis controls to your existing HTML
function addAnalysisControls() {
    const controlsDiv = document.querySelector('.court-controls');
    if (controlsDiv) {
        // Check if buttons already exist
        if (document.getElementById('startAnalysisBtn')) {
            return; // Buttons already added
        }

        const startAnalysisBtn = document.createElement('button');
        startAnalysisBtn.id = 'startAnalysisBtn';
        startAnalysisBtn.textContent = 'Start Analysis';
        startAnalysisBtn.style.cssText = `
            background: #27ae60;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 32px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-right: 16px;
        `;
        startAnalysisBtn.onclick = () => videoAnalyzer.startAnalysis(2);

        const stopAnalysisBtn = document.createElement('button');
        stopAnalysisBtn.id = 'stopAnalysisBtn';
        stopAnalysisBtn.textContent = 'Stop Analysis';
        stopAnalysisBtn.style.cssText = `
            background: #e74c3c;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 32px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-right: 16px;
        `;
        stopAnalysisBtn.onclick = () => videoAnalyzer.stopAnalysis();

        const summaryBtn = document.createElement('button');
        summaryBtn.id = 'summaryBtn';
        summaryBtn.textContent = 'Summary';
        summaryBtn.style.cssText = `
            background: #3498db;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 32px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
        `;
        summaryBtn.onclick = () => videoAnalyzer.getAnalysisSummary();

        controlsDiv.appendChild(startAnalysisBtn);
        controlsDiv.appendChild(stopAnalysisBtn);
        controlsDiv.appendChild(summaryBtn);
    }
}

// Add controls when page loads
document.addEventListener('DOMContentLoaded', addAnalysisControls); 