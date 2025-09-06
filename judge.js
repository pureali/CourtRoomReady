
import { createClient } from "https://esm.sh/@anam-ai/js-sdk@latest";
import { AnamEvent } from "@anam-ai/js-sdk/dist/module/types"
    // Replace with your actual API key
    const API_KEY = "NTk0YTA0YzItNDQ1Mi00YWE2LWEwMTgtMTZiZDg2ODIwY2JmOldBZjkvQnBaci9iQmFzK2kzQ1oyZVlHZHZLY3lTV3hqZ1VlTjl2V3hJTW89"
    //const videoElement = document.getElementById("persona-video");
    const statusElement = document.getElementById("status");

    var client = null;
    var judgePrompt=`
    [PERSONALITY]
You are Judge Evelyn Thorne, an experienced High Court judge. You value fairness, clarity, and discipline. You are attentive to credibility signals — hesitation, inconsistency, or evasiveness. Your authority comes not from aggression but from gravitas and calm control.

[ENVIRONMENT]
This conversation takes place in a virtual courtroom simulation. You see the uploaded witness statement, hear the witness’s responses, and observe stress signals (eye contact, tone, posture). You are supported by a reasoning model that highlights inconsistencies.

[TONE]
- British RP, steady, deliberate.
- Default: neutral and measured.
- When witness is nervous: supportive, gentle pacing, “Take your time, please explain.”
- When witness is composed: probing, firmer cadence, deliberate pauses.
- Interventions must be short, formal, and judicial.

[GOAL]
- Clarify the witness’s narrative.
- Surface missing details or contradictions.
- Test reliability without intimidation.
- Model impartiality.

[GUARDRAILS]
- Never overlap with Counsel.
- Reference uploaded document: “In paragraph 14 you said …”
- If vague: follow up once, then note ambiguity.
- Never speculate; examine only evidence.

[NUANCED BEHAVIOURS]
- Restate answers to confirm: “So you are saying … ?”
- Calmly highlight contradictions: “Earlier you said X, now Y. Which is correct?”
- If stress rises, lower voice and slow pace.
    `
    async function createSessionToken() {
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
                    systemPrompt: judgePrompt,},
            }),
        });

        const data = await response.json();
        return data.sessionToken;
    }

    export async function startChat(videoElementId="persona-video") {
        try {
            statusElement.textContent = "Creating session...";

            const sessionToken = await createSessionToken();
            statusElement.textContent = "Connecting...";

            const anamClient = createClient(sessionToken);
            await anamClient.streamToVideoElement(videoElementId);
            
            client=anamClient;

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
             //console.log('eventMessageHistoryUpdated triggered():', messages);
            if(client){
                anamClient.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (messages) => {
                console.log('Updated Messages:', messages);
});
                statusElement.textContent = "Listening for message history updates.";
            }
        } catch (error) {
            console.error("Failed to set up message history updated listener:", error);
            statusElement.textContent = "Failed to set up listener.";
        }
        
    }  


        

    // Auto-start when page loads
    //startChat();
