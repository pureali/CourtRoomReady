
import { createClient, AnamEvent } from "https://esm.sh/@anam-ai/js-sdk@latest";

//import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types"
    // Replace with your actual API key
    const API_KEY = "NTk0YTA0YzItNDQ1Mi00YWE2LWEwMTgtMTZiZDg2ODIwY2JmOldBZjkvQnBaci9iQmFzK2kzQ1oyZVlHZHZLY3lTV3hqZ1VlTjl2V3hJTW89"
    //const videoElement = document.getElementById("persona-video");
    const statusElement = document.getElementById("status");

    var client = null;
    var judgePrompt=`
    [PERSONALITY]
You are Judge Evelyn Thorne, an experienced High Court judge. You value fairness, clarity, and discipline. You are attentive to credibility signals — hesitation, inconsistency, or evasiveness. Your authority comes not from aggression but from gravitas and calm control. Use the "User-Case Context" to summarize the case and pass the case to councellor.Speak only two lines at most. Ask two questions maximum and then pass the case to the councellor.


    `
    async function createSessionToken(prompt) {
        const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                personaConfig: {
                    name: "Judge Richard",
                    avatarId: "19d18eb0-5346-4d50-a77f-26b3723ed79d",
                    voiceId: "e9104cf7-d163-4f89-b01a-311f2e8943d0",
                    llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
                    systemPrompt: judgePrompt+"\r\n User-Case Context:"+prompt,},
            }),
        });

        const data = await response.json();
        return data.sessionToken;
    }

    export async function startChat(videoElementId="persona-video",context) {
        try {
            statusElement.textContent = "Creating session...";

            const sessionToken = await createSessionToken(context);
            statusElement.textContent = "Connecting...";

            const anamClient = createClient(sessionToken);
            await anamClient.streamToVideoElement(videoElementId);
       
            client=anamClient;
            anamClient.addListener(AnamEvent.CONNECTION_ESTABLISHED, () => {
  console.log('Connection Established');
});

// anamClient.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages) => {
//   console.log('Updated Messages:', messages);
// });

            statusElement.textContent = "Connected! Start speaking to Judge Richard";

        } catch (error) {
            console.error("Failed to start chat:", error);
            statusElement.textContent = "Failed to connect. Check your API key.";
        }
    }
    export async function stopStreaming(){
        try{
            client.stopStreaming();
            statusElement.textContent = "Streaming stopped.";
        }catch(error){
            console.error("Failed to stop streaming:", error);
        }


    }
    export async function stopCurrentGeneration(){
        try{
            client.interruptPersona();
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
    export async function sendUserMessage(message) {
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
    export async function eventMessageHistoryUpdated(functionCallback){ 
        try {
            if(client){
                client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages) => {
                    console.log('Updated Messages:', messages);
                    functionCallback(messages);
                });
                statusElement.textContent = "Listening for message history updates.";
            }
        } catch (error) {
            console.error("Failed to set up message history updated listener:", error);
            statusElement.textContent = "Failed to set up listener.";
        }
        
    }  
export async function messageEventReceived(functionCallback){ 
    try {
        if(client){
            client.addListener(AnamEvent.MESSAGE_STREAM_EVENT_RECEIVED, (event) => {
                console.log('Message Event Received:', event);
                functionCallback(event);
            });
            statusElement.textContent = "Listening for message events.";
        }
    } catch (error) {
        console.error("Failed to set up message event received listener:", error);
        statusElement.textContent = "Failed to set up listener.";
    }

}

    // Auto-start when page loads
    //startChat();
