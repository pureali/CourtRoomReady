from asyncio import subprocess
import os
import socketserver

import http.server
def killPorts():
    os.system("fuser -k 8000/tcp")
    #os.system("fuser -k 8001/tcp")
def runHTTPServer():
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
def runPythonBackend():
    backend_dir = os.path.join(os.getcwd(), "my-app", "backend")
    try:
        subprocess.Popen(["python", "fastbackend.py"], cwd=backend_dir)
    except Exception as e:
        print(f"Error starting backend: {e}")
if __name__ == "__main__":
    killPorts()
    runHTTPServer()
    runPythonBackend()