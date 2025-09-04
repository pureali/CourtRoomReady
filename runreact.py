import subprocess
import os

def run_react_app():
    project_dir = os.path.join(os.getcwd(), "my-app")
    if not os.path.isdir(project_dir):
        print(f"Directory '{project_dir}' does not exist. Please create your React app in 'my-app'.")
        return
    try:
        subprocess.run(["npm", "run", "dev"], cwd=project_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Failed to run React app: {e}")

if __name__ == "__main__":
    run_react_app()
