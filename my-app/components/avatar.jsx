

    import React, { forwardRef, useImperativeHandle } from "react";
    import { createClient } from "https://esm.sh/@anam-ai/js-sdk@latest";

    // Replace with your actual API key
    const API_KEY = "NTJlNDE4ZjYtODQwYy00YTEwLWJkYjAtODliMDI2ZDkzY2I1OnFESWF3V1N5V29qTTVSVGZ5U0daQXNqYXJ1Q3c4QU9BNmtHMFh2eGRPQnM9";




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


    // Expose startChat via ref
    const startChat = async () => {
        try {
            const statusElement = document.getElementById("status");
            statusElement.textContent = "Creating session...";

            const sessionToken = await createSessionToken();
            statusElement.textContent = "Connecting...";

            const anamClient = createClient(sessionToken);
            await anamClient.streamToVideoElement("persona-video");

            statusElement.textContent = "Connected! Start speaking to Cara";
            anamClient.addListener(AnamEvent.TALK_STREAM_INTERRUPTED, (event) => {
            console.log('Talk stream interrupted:', event.correlationId);
            handleStreamInterruption(event.correlationId);
            stopCurrentGeneration();
            });
            

        } catch (error) {
            const statusElement = document.getElementById("status");
            console.error("Failed to start chat:", error);
            statusElement.textContent = "Failed to connect. Check your API key.";
        }
    };


const styles = {
    textAlign: "center",
    padding: "0px",
    border: "1px solid #ddd",
    video: {
        maxWidth: "100%",
        width: "320px",
        height: "240px",
        borderRadius: "8px",
        zIndex: 500,
        background: "#000"
    },
    status: { marginTop: "15px", fontSize: "14px", color: "#666" }
};

const Avatar = forwardRef(function Avatar({ title = "Judge" }, ref) {
    useImperativeHandle(ref, () => ({
        startChat
    }));

    return (
        <div style={styles}>
            <div style={{ background: 'black', color: 'white', width: '100%', textAlign: 'center', padding: '6px 0', marginBottom: '8px', borderRadius: '4px' }}>{title}</div>
            <h1>Chat with Cara</h1>
            <p>Your AI persona will appear below and start automatically</p>
            <video id="persona-video" autoPlay playsInline style={styles.video}></video>
            <div id="status" style={styles.status}>Loading...</div>
        </div>
    );
});

export default Avatar;