import getpass
import os
from re import search
import dotenv
dotenv.load_dotenv(".env")
print ("Loaded environment variables from .env file")
print (os.environ["GOOGLE_API_KEY"])
os.environ["GOOGLE_API_KEY"] = "AIzaSyAX48gND0b5Ls8o99QcXrowoq1jRJ1-T7M"
from langchain.chat_models import init_chat_model
from langchain_tavily import TavilySearch
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent


model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")

#model = init_chat_model("anthropic:claude-3-5-sonnet-latest")
if not os.environ.get("TAVILY_API_KEY"):
    os.environ["TAVILY_API_KEY"] ="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"
"""
This is a weather agent that uses the Tavily search tool to get the current weather information for a given location.
It uses a chat model to process the user's query and generate a response.
"""
def weatherAgent():
    """
    Create and return a weather agent using Tavily search and a custom tool.
    """
    memory = MemorySaver()
    #model = init_chat_model("anthropic:claude-3-5-sonnet-latest")
    search = TavilySearch(max_results=2)
    #tools = [search]
    tools=[]
    agent_executor = create_react_agent(model, tools, checkpointer=memory)
    return agent_executor
def queryAgent(agent,query):
   """
   Query the agent with a user query and print the response steps.
   """
   config = {"configurable": {"thread_id": "abc123"}}
   for step in agent.stream(
    {"messages": [query]}, config, stream_mode="values"
    ):
    step["messages"][-1].pretty_print()
# result = model.invoke(f"What is the weather in {location} now?")
    # return result

if __name__=="__main__":
    print("Hello, World!")
    agent=weatherAgent()
    queryAgent(agent,"What is the weather in Leicester?")
    # result=model.invoke("Hello, how are you?. What is the weahter in Leicester now?")
    # print("Model response:")
    # print(result.content)
    #print("Result:", result)
    print("Model invoked successfully.")
   # print("Model name:", model.name)
 
