from typing import Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

def query_gemini(prompt: str) -> Optional[str]:
    """
    Send a prompt to Gemini API and get the response.
    
    Args:
        prompt (str): The user's input prompt
        
    Returns:
        Optional[str]: The model's response or None if there's an error
    """
    try:
        # Get API key from environment variable
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")

        # Configure the API
        genai.configure(api_key=api_key)
        
        # Use Gemini-Pro model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate response
        response = model.generate_content(prompt)
        
        return response.text
        
    except Exception as e:
        print(f"Error querying Gemini API: {str(e)}")
        return None
    
if __name__ == "__main__":
    test_prompt = "What is the capital of France?"
    response = query_gemini(test_prompt)
    if response:
        print(f"Response from Gemini: {response}")
    else:
        print("Failed to get a response from Gemini.")