<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# COOKED 🎯


## Basic Details
### Team Name: Niggolass


### Team Members
- Team Lead: Aadi Krishna - ME3
- Member 2: Nitheesh Babu - ME3

### Project Description
COOKED is a webcam-based full face & body tracker that watches your posture and expression live, then has an AI roast you about it in real-time Gen-Z slang. No compliments here — just escalating, increasingly unhinged sarcastic insults, punctuated by random meme sound effects.

### The Problem (that doesn't exist)
Nobody has ever needed a computer vision pipeline to tell them their shoulders are uneven and their aura points are in the negatives.

### The Solution (that nobody asked for)
We run MediaPipe face and pose landmark detection on your live webcam feed, turn the raw geometry (eyebrow asymmetry, elbow angles, shoulder tilt, blendshape scores) into a stats readout, and feed that straight to an LLM with one job: roast you for it, in trending slang, getting meaner the longer you stand there. Every roast is punctuated with a random sound effect for maximum humiliation.

## Technical Details
### Technologies/Components Used
For Software:
- JavaScript (ES modules), HTML, CSS
- MediaPipe Tasks Vision (FaceLandmarker + PoseLandmarker)
- Groq API (openai/gpt-oss-120b) for live AI-generated roasts
- Google Fonts (Space Grotesk, Inter)

### Implementation
For Software:
# Installation
No build step or dependencies to install — everything loads from CDN at runtime.
```
git clone https://github.com/zam-boso/useless_project_Niggolas.git
cd useless_project_Niggolas
```

# Run
Open `index.html` directly in a real browser (Chrome/Edge), click **Start Camera**, and grant camera access. Must be opened as a `file://` page or served locally — not through a sandboxed preview — since it needs real `getUserMedia` and network access.

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1](Add screenshot 1 here with proper name)
*Landing screen with the Start Camera button*

![Screenshot2](Add screenshot 2 here with proper name)
*Live tracking with face/body detection boxes and a roast on screen*

![Screenshot3](Add screenshot 3 here with proper name)
*Escalated, more savage roast after standing in frame for a while*

# Diagrams
![Workflow](Add your workflow/architecture diagram here)
*Webcam → MediaPipe landmark detection → stats summary → Groq LLM → roast + random sound effect, looping every few seconds*

### Project Demo
# Video
[Add your demo video link here]
*Explain what the video demonstrates*

# Additional Demos
[Add any extra demo materials/links]

## Team Contributions
- Aadi Krishna: Core tracking pipeline, AI roast integration, UI/UX design
- Nitheesh Babu: Insult bank content, sound effects curation, testing

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



