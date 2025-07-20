# CodeChillVite 🚀

[](https://code-chill-vite.vercel.app)
[](https://opensource.org/licenses/MIT)

> **A collaborative online code editor for real-time interviews, learning, and teamwork.**

🔗 [Live Demo](https://code-chill-vite.vercel.app)

-----

## 🎬 Project Demo

> {*/demo gif or video*}

-----

## ✨ Features

  - 📝 **Collaborative Code Editing** — Real-time code, input, and output sync across users.
  - 💬 **Live Chat** — Built-in chat for seamless communication.
  - 🌗 **Theme Toggle** — Switch between dark and light modes.
  - 👥 **User Presence** — See who’s online with a host badge and user count.
  - 🧹 **Reset & Clear** — Reset all code, input, and output for everyone in the room.
  - 🔗 **Room Code Sharing** — Easily copy and share room codes for quick invites.
  - 🖥️ **Multi-language Support** — C, C++, Python, Java, and JavaScript.
  - ⚡ **Fast & Modern UI** — Built with Vite and React for a snappy experience.
  - 🔒 **No Sign Up Required** — Jump in and start collaborating instantly.

-----

## 🛠️ Tech Stack

This project is built with a modern MERN-like stack, leveraging real-time communication.

| Category | Technologies |
|:---|:---|
| **Frontend** | \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg)" width="24"/\> **React** (TypeScript) \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg)" width="24"/\> **Vite** |
| **Backend** | \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg)" width="24"/\> **Node.js** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg)" width="24"/\> **Express** |
| **Real-time** | \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg)" width="24"/\> **Socket.IO** |
| **Code Execution** | 🏗️ **Judge0 API** (for code compilation and execution) |
| **Languages** | \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg)" width="24"/\> **JavaScript** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg)" width="24"/\> **TypeScript** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg)" width="24"/\> **Python** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg)" width="24"/\> **Java** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg)" width="24"/\> **C++** \<br\> \<img src="[https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg)" width="24"/\> **C** |

-----

## 🧠 How It Works

### Architecture

1.  **Frontend** sends code, input, and language data to the backend.
2.  **Backend** forwards this data to the **Judge0 API** for compilation and execution.
3.  The results are returned to the backend and then broadcast to all users in the room.
4.  **Socket.IO** ensures that code changes, cursor positions, and chat messages are synchronized in real-time across all connected clients.
5.  Room state and active users are managed in memory by the backend. No data is persisted after all users have left a room, ensuring privacy.

-----

## 🚀 Getting Started (Local)

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/CodeChillVite.git
    cd CodeChillVite
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    ```

4.  **Start the backend server:**
    Open a new terminal and navigate to the `server` directory.

    ```bash
    node index.js
    ```

5.  **Start the frontend:**
    Open a new terminal and navigate to the project root.

    ```bash
    npm run dev
    ```

The app will be available at [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173).

-----

## 📁 Folder Structure

```
CodeChillVite/
├── server/             # Backend (Node.js + Express + Socket.IO)
│   ├── index.js        # Main server file
│   └── socket.js       # Socket.IO logic
├── src/                # Frontend (React + Vite)
│   ├── components/     # Reusable React components (e.g., CodeEditor)
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── ...             # Other frontend files
└── ...
```

-----

## 🖼️ Screenshots

> {*/image 1*}
> {*/image 2*}

-----

## 🤝 Contributing

Contributions, issues, and feature requests are welcome\! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/your-username/CodeChillVite/issues).

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

-----

## 📄 License

This project is licensed under the **MIT License**.

-----

> *Made with ❤️ by [Tanishk Sarode](https://www.linkedin.com/in/tanishk-sarode/)*
