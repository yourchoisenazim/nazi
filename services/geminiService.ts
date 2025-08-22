import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideoFromImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ url: string; blob: Blob }> => {
    console.log("Starting video generation...");

    // Append keywords to enhance realism and quality, along with the duration.
    const modifiedPrompt = `${prompt}, photorealistic, cinematic, high detail, 15 second video`;

    let operation;
    let initialAttempt = 0;
    const maxInitialRetries = 19;
    const initialRetryDelay = 10000; // Wait 10 seconds between retries

    // Retry logic for the initial video generation call.
    while (true) {
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
            break; // Success, exit the loop
        } catch (error: any) {
            initialAttempt++;
            // Robustly check for rate limit errors from the API response structure.
            const isRateLimitError = error?.error?.status === 'RESOURCE_EXHAUSTED' || String(error).includes('429');

            if (initialAttempt >= maxInitialRetries || !isRateLimitError) {
                console.error("Failed to start video generation after multiple attempts:", error);
                const errorMessage = error?.error?.message || "The service is currently busy. Please try again in a moment.";
                throw new Error(errorMessage);
            }
            
            // Use a linear delay with jitter to wait for rate limits to reset.
            const delay = initialRetryDelay + (Math.random() * 2000); 
            console.warn(`Initial generation call failed due to rate limit. Retrying in ${Math.round(delay / 1000)} seconds... (Attempt ${initialAttempt}/${maxInitialRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }


    console.log("Operation started, polling for result...");

    // Polling logic to check for video completion.
    const initialPollInterval = 10000; // Poll every 10 seconds.
    let currentPollInterval = initialPollInterval;
    const maxRetries = 8;
    let retryCount = 0;

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, currentPollInterval));
        try {
            operation = await ai.operations.getVideosOperation({ operation: operation });
            console.log(`Polling... operation status: ${operation.done ? 'done' : 'in progress'}`);
            // Reset retry count and interval on a successful poll
            retryCount = 0;
            currentPollInterval = initialPollInterval;
        } catch (error: any) {
            console.error("Error during polling:", error);
            
            // Robustly check for rate limit errors from the API response structure.
            const isRateLimitError = error?.error?.status === 'RESOURCE_EXHAUSTED' || String(error).includes('429');

            if (isRateLimitError) {
                retryCount++;
                if (retryCount > maxRetries) {
                    throw new Error("The service is still busy after several attempts. Please wait a few minutes and try again.");
                }
                
                // Exponential backoff with jitter for subsequent polling errors
                currentPollInterval = initialPollInterval * Math.pow(2, retryCount) + (Math.random() * 1000);
                
                console.warn(`Rate limit hit during polling. Retrying in ${Math.round(currentPollInterval / 1000)} seconds... (Attempt ${retryCount}/${maxRetries})`);
            } else {
                // For other types of errors, fail immediately
                const errorMessage = error?.error?.message || "An unexpected error occurred while checking the video status.";
                throw new Error(errorMessage);
            }
        }
    }


    console.log("Video generation complete.");

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        console.error("No download link found in operation response:", operation.response);
        throw new Error("Video generation succeeded, but no download link was provided.");
    }
    
    console.log("Fetching video from download link:", downloadLink);
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Failed to download the generated video. Status: ${response.status}`);
    }

    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    console.log("Video downloaded and local URL created.");

    return { url: videoUrl, blob: videoBlob };
};