import os
import socketserver
import http.server
import subprocess

def killPorts():
    # Use os.system as a blocking call by checking the return code
    ret = os.system("fuser -k 8080/tcp")
    if ret != 0:
        print("Port 8080 may not have been in use or failed to kill.")

def runHTTPServer():
    PORT = 8080
    Handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

def runPythonBackend():
    backend_dir = os.path.join(os.getcwd(), "backend")
    try:
        subprocess.Popen(["python", "fastbackend.py"], cwd=backend_dir)
    except Exception as e:
        print(f"Error starting backend: {e}")

if __name__ == "__main__":
    killPorts()  # This is now blocking until the command completes
    runPythonBackend()
    runHTTPServer()
    