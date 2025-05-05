import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import threading

# Load API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing. Set it in the .env file.")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)

# Allow CORS for all websites
CORS(app)

# Function to extract the real user IP (supports reverse proxy setups)
def get_client_ip():
    return request.headers.get("X-Forwarded-For", request.remote_addr).split(",")[0].strip()

# Rate limiting per IP: 10 requests per minute
limiter = Limiter(get_client_ip, app=app, default_limits=["10 per minute"])

# Load command list
with open("commands.json") as file:
    COMMANDS = json.load(file)

# ✅ **Fix: Allow multi-word commands**
def is_valid_command(command):
    """Check if the base command exists in Linux or Git command lists."""
    base_command = command.split()[0]  # Extract the first word (e.g., `ls` from `ls -l /path`)
    return base_command in COMMANDS["linux"] + COMMANDS["git"]

def explain_command(command):
    """Generate an explanation using Gemini AI."""
    prompt = f"Explain the Linux or Git command: '{command}' in a concise and structured manner. Ensure the response includes:\n\
- A simple, beginner-friendly explanation.\n\
- An easy-to-understand analogy (if applicable).\n\
- A real-world example with output.\n\
- Common options and their usage.\n\
Format the response in a way that is clear and easy to read."

    try:
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        return model.generate_content(prompt).text.strip()
    except Exception as e:
        return f"Error: {e}"

@app.route("/")
def home():
    """Serve the frontend HTML page."""
    return render_template("index.html"), 200

@app.route("/explain", methods=["GET"])
@limiter.limit("10 per minute")
def get_explanation():
    command = request.args.get("command", "").strip()
    user_ip = get_client_ip()  # Get user IP

    if not command:
        return jsonify({"error": "No command provided", "user_ip": user_ip}), 400

    if len(command) > 100:
        return jsonify({"error": "Command too long", "user_ip": user_ip}), 400

    if not is_valid_command(command):
        return jsonify({"command": command, "explanation": "This is not a Linux or Git command.", "user_ip": user_ip})

    return jsonify({"command": command, "explanation": explain_command(command), "user_ip": user_ip})

def run_flask():
    """Runs Flask in a separate thread."""
    app.run(host="0.0.0.0", port=12330, debug=True)

if __name__ == "__main__":
    run_flask()
