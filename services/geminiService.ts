import { GoogleGenAI } from "@google/genai";
import { VideoResult } from '../types.ts';

const API_KEY = "AIzaSyDMbwVMxYHBJ-1N2wqqafgB0XsEneiIYNk";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const isSafetyError = (error) => {
    const message = error?.error?.message || error?.message || '';
    const lowerMessage = String(message).toLowerCase();
    return lowerMessage.includes('sensitive') || 
           lowerMessage.includes('responsible ai practices') || 
           lowerMessage.includes('safety policies') ||
           lowerMessage.includes('usage guidelines');
};

export const generateVideoFromImage = async (base64ImageData, mimeType, prompt): Promise<VideoResult> => {
    console.log("Starting video generation...");

    const modifiedPrompt = `${prompt}, photorealistic, cinematic, high detail, 3 second video`;

    let operation;
    let attempt = 0;
    const maxRetries = 6;
    const baseDelay = 4000;

    while (attempt < maxRetries) {
        try {
            operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: modifiedPrompt,
                image: {
                    imageBytes: base64ImageData,
                    mimeType: mimeType,
                },
                config: {
                    numberOfVideos: 1,
                }
            });
            break; // Success
        } catch (error) {
            attempt++;
            const isRateLimitError = error?.error?.status === 'RESOURCE_EXHAUSTED' || String(error).includes('429');
            const isServerError = error?.error?.code === 500 || error?.error?.status === 'UNKNOWN';
            const shouldRetry = isRateLimitError || isServerError;

            if (!shouldRetry || attempt >= maxRetries) {
                console.error(`Failed to start video generation. Final attempt failed:`, error);
                if (isSafetyError(error)) {
                    throw new Error("SAFETY_ERROR");
                }
                if (isRateLimitError) {
                    throw new Error("QUOTA_ERROR");
                }
                const errorMessage = error?.error?.message || "The service is currently busy. Please try again in a moment.";
                throw new Error(errorMessage);
            }
            
            // Exponential backoff with jitter
            const backoffDelay = baseDelay * Math.pow(2, attempt - 1) + (Math.random() * 1000);
            
            console.warn(`Initial generation call failed (${isRateLimitError ? 'rate limit' : 'server error'}). Retrying in ${Math.round(backoffDelay / 1000)}s... (Attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
    }
    
    if (!operation) {
        throw new Error("Failed to start video generation after multiple attempts.");
    }


    console.log("Operation started, polling for result...");

    const initialPollInterval = 10000;
    let currentPollInterval = initialPollInterval;
    const maxPollRetries = 8;
    let pollRetryCount = 0;

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, currentPollInterval));
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
            console.log(`Polling... operation status: ${operation.done ? 'done' : 'in progress'}`);
            pollRetryCount = 0; // Reset count on success
            currentPollInterval = initialPollInterval;
        } catch (error) {
            console.error("Error during polling:", error);
            
            const isRateLimitError = error?.error?.status === 'RESOURCE_EXHAUSTED' || String(error).includes('429');
            const isServerError = error?.error?.code === 500 || error?.error?.status === 'UNKNOWN';
            const shouldRetry = isRateLimitError || isServerError;

            if (shouldRetry) {
                pollRetryCount++;
                if (pollRetryCount > maxPollRetries) {
                    throw new Error("The service is still busy after several attempts. Please wait a few minutes and try again.");
                }
                
                // Use exponential backoff for the next poll interval
                currentPollInterval = initialPollInterval * Math.pow(2, pollRetryCount -1) + (Math.random() * 1000);
                
                console.warn(`Polling failed (${isRateLimitError ? 'rate limit' : 'server error'}). Retrying in ${Math.round(currentPollInterval / 1000)} seconds... (Attempt ${pollRetryCount}/${maxPollRetries})`);
            } else {
                // Not a retryable error, fail immediately
                const errorMessage = error?.error?.message || "An unexpected error occurred while checking the video status.";
                throw new Error(errorMessage);
            }
        }
    }

    console.log("Video generation complete.");
    
    if (operation.error) {
        console.error("Video generation operation failed:", operation.error);
        if (isSafetyError(operation.error)) {
            throw new Error("SAFETY_ERROR");
        }
        const errorMessage = operation.error.message || "The video generation failed after processing.";
        throw new Error(errorMessage);
    }

    const generatedVideos = operation.response?.generatedVideos;

    if (!generatedVideos || generatedVideos.length === 0) {
        console.error("No videos found in operation response:", operation);
        throw new Error("The AI finished but did not produce a video. This can happen due to safety filters or if the request is unclear. Please try a different image or prompt.");
    }

    const downloadLink = generatedVideos[0]?.video?.uri;

    if (!downloadLink) {
        console.error("No download link found in the first video result:", operation);
        throw new Error("Video generation completed, but the result was malformed and did not contain a download link.");
    }
    
    console.log("Fetching video from download link:", downloadLink);
    
    const response = await fetch(`${downloadLink}&key=${API_KEY}`);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to download video. Status:", response.status, "Body:", errorText);
        throw new Error(`Failed to download the generated video. Status: ${response.status}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    console.log("Video downloaded and local URL created.");

    return { url: videoUrl, blob: videoBlob };
};