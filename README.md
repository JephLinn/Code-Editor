# Code-Editor
Web-Based Code Editor
A lightweight, browser-based IDE for HTML, CSS, and JavaScript

📖 Overview
This project is a custom-built, web-based code editor designed to provide an interactive environment for writing, testing, and previewing HTML, CSS, and JavaScript directly in the browser.
It was developed to demonstrate my ability to:
- Architect front-end applications from scratch
- Integrate third-party libraries (Ace Editor)
- Manage state, persistence, and user interaction
- Apply clean coding practices and project hygiene
The editor is intentionally minimal yet functional, showcasing both technical skill and attention to user experience.

✨ Features
- Tabbed Editors: Switch seamlessly between HTML, CSS, and JavaScript panels
- Live Preview: Render code instantly in an embedded iframe
- Run & Test: Execute code with or without test snippets
- Open in New Window: Launch a full preview in a separate browser tab
- Keyboard Shortcuts:
- Ctrl + Enter / Cmd + Enter → Run code
- Ctrl + S / Cmd + S → Save project
- Local Persistence: Save and reload projects using localStorage
- Export/Import: Download project as JSON or load from file
- Clean UI: Responsive layout with accessible tab navigation

🛠️ Tech Stack
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Editor Engine: Ace Editor
- Storage: Browser localStorage + JSON export/import
- Build/Deploy: Vanilla setup (no frameworks required)

📂 Project Structure
/index.html        # Main UI layout
/styles.css        # Styling for editor and preview
/script.js         # Core logic (editor setup, preview, save/load)
README.md          # Project documentation



🚀 Getting Started
- Clone the repository:
git clone https://github.com/JephLinn/code-editor.git
cd web-code-editor
- Open index.html in your browser.
- Start coding in the HTML, CSS, or JS tabs and click Run to preview.

🎯 Design Decisions
- Simplicity First: No build tools or frameworks; everything runs in the browser.
- Accessibility: ARIA roles and keyboard navigation for inclusive use.
- Maintainability: Modular functions, consistent naming, and clear separation of concerns.
- Resilience: Error handling in preview execution to prevent crashes.

📈 Future Enhancements
- Dark/light theme toggle
- Collaborative editing (WebSockets)
- Integrated linting and formatting

👤 About the Developer
I’m a self-taught software engineer with a background in cybersecurity and full-stack development. This project reflects my ability to combine discipline, clarity, and technical precision into a working product.
I built this editor not only as a tool but as a demonstration of my engineering mindset:
- Clarity over complexity
- Practical frameworks for problem-solving
- Attention to detail in both code and design


📝 Closing Note
This project is more than a code editor—it’s a reflection of my approach to software engineering: disciplined, user-focused, and built with integrity
