
    import { createClient } from "https://esm.sh/@anam-ai/js-sdk@latest";

    // Replace with your actual API key
    const API_KEY = "NTJlNDE4ZjYtODQwYy00YTEwLWJkYjAtODliMDI2ZDkzY2I1OnFESWF3V1N5V29qTTVSVGZ5U0daQXNqYXJ1Q3c4QU9BNmtHMFh2eGRPQnM9";

    //const videoElement = document.getElementById("persona-video");
    const statusElement = document.getElementById("status");

    var client = null;
    async function createSessionToken() {
        const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                personaConfig: {
                    name: "Cara",
                    avatarId: "30fa96d0-26c4-4e55-94a0-517025942e18",
                    voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
                    llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
                    systemPrompt: "You are Cara, a helpful and friendly AI assistant. Keep responses conversational and concise.",
                },
            }),
        });

        const data = await response.json();
        return data.sessionToken;
    }

    export async function startChatCouncellor(videoElementId="persona-video") {
        try {
            statusElement.textContent = "Creating session...";

            const sessionToken = await createSessionToken();
            statusElement.textContent = "Connecting...";

            const anamClient = createClient(sessionToken);
            await anamClient.streamToVideoElement(videoElementId);
            client=anamClient;

            statusElement.textContent = "Connected! Start speaking to Cara";
            

        } catch (error) {
            console.error("Failed to start chat:", error);
            statusElement.textContent = "Failed to connect. Check your API key.";
        }
    }
    export async function stopStreamingCouncellor(){
        try{
            client.stopStreaming();
            statusElement.textContent = "Streaming stopped.";
        }catch(error){
            console.error("Failed to stop streaming:", error);
        }


    }
    export async function stopCurrentGenerationCouncellor(){
        try{
            client.stopCurrentGeneration();
            statusElement.textContent = "Current generation stopped.";
        }catch(error){
            console.error("Failed to stop current generation:", error);
        }
    }

    export async function handleStreamInterruption(correlationId){
        try{
            console.log('Handling stream interruption for correlationId:', correlationId);
            statusElement.textContent = "Stream interrupted. Attempting to recover...";
            await client.resumeStreamFromInterruption(correlationId);
            statusElement.textContent = "Stream resumed.";
        }catch(error){
            console.error("Failed to handle stream interruption:", error);
            statusElement.textContent = "Failed to resume stream.";
        }
    }   
 
    export async function muteAudio(mute=true){
        try{
            
            if(client){
                if (mute==true){
                    anamClient.muteInputAudio();

                }else{
                    anamClient.unmuteInputAudio();
                }
                
                statusElement.textContent = mute ? "Audio muted." : "Audio unmuted.";
            }
        }catch(error){
            console.error("Failed to mute/unmute audio:", error);
        }
    }
    export async function sendUserMessageCouncellor(message) {
        try {
            if(client){
                await client.sendUserMessage(message);
                statusElement.textContent = "Message sent.";
            }
        } catch (error) {
            console.error("Failed to send user message:", error);
            statusElement.textContent = "Failed to send message.";
        }
        
    }
    
    // Auto-start when page loads
    //startChat();
