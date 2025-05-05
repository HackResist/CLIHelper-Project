# CLIHelper, AI-Powered Command Assistant 🔧🤖

CLIHelper is a web-based tool designed to help users understand and learn Linux and Git commands using Google Gemini AI. Whether you're a beginner or experienced user, CLIHelper explains complex commands in simple language through an easy-to-use interface.

---

## 🚀 Features

- ✅ Enter any Linux or Git command to receive an instant explanation
- 🔍 Verifies commands using a local JSON database
- 🤖 Uses Google Gemini AI for generating clear, Markdown-formatted responses
- 🧠 Returns a “Command Not Found” message if the input is invalid
- 🔒 Implements rate limiting to avoid API abuse
- 🌐 Fully hosted and accessible via browser
- 📚 Educational and beginner-friendly UI

---

## 🧰 Technology Stack

### Frontend:
- HTML
- CSS
- JavaScript
- Live Server Extension (for local testing)

### Backend:
- Python
- Flask
- Gemini AI API
- JSON (for command list verification)

### Hosting:
- [Render](https://render.com/) (Backend/API)
- [Vercel](https://vercel.app/) (Frontend/UI)
- [GitHub](https://github.com/) (Code repository)

---

## 🛠 How It Works

1. **User Input**: User enters a command (e.g., `git status`, `ls -la`)
2. **Verification**: Command is checked in a local JSON database
3. **AI Integration**: Valid commands are sent to the Gemini AI API
4. **Response**: The AI-generated explanation is returned in Markdown format and rendered on the frontend
5. **Invalid Input Handling**: Unrecognized commands display a clear error message
6. **Rate Limiting**: Controls excessive requests for stable performance

---

## ⚠️ Challenges Faced

- Choosing the correct Gemini AI model for accurate results
- Formatting AI responses using Markdown for the web
- Integrating backend API into the frontend interface
- Learning multiple technologies (HTML, CSS, JS, Flask, JSON) from scratch
- Hosting backend and frontend correctly on separate platforms

---

## ✅ Solutions

- Explored Gemini documentation and models thoroughly
- Learned Markdown syntax and implemented formatting
- Researched and solved integration issues via forums, AI tools, and video tutorials
- Took help from developer communities and open-source examples
- Used GitHub for version control, Render for backend hosting, and Vercel for frontend

---

## 📦 How to Run Locally

### Prerequisites
- Python 3.x
- Flask
- Gemini API key
- VS Code or any code editor

### Installation


### Backend:

- Navigate in CLIHelper Backend folder and install required packages using `pip install -r requirement.txt`
- After the installation run `python app.py` to start the server.

### Frontend:
- Navigate in CLIHelper frontend folder if you are working on frontend.
- Navigate in `script.js` file and add your `API` Endpoint for make working.
- In root directory you can start live server.

### Suggestion
- Best choice is use hosting
    -   Render for backend.
    -   Vercel for  frontend.

## 🎥 Video Guide
If you're unsure how to host the server, you can watch our step-by-step video tutorial for better understanding. Visit [ByeHexLab](https://www.youtube.com/@ByteHexLab).



## 📌 Stay Updated

> 🔄 **Remember:** For the latest updates and features, always follow the [GitHub repository](https://github.com/Hackresist/CLIHelper-Project)
