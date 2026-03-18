```markdown
# 🎨 ArtGallery

ArtGallery is a lightweight platform designed to showcase and manage digital art collections like an online exhibition.
Users can follow their interests and respective artists to catch-up their artworks. Designed and Developed this App to make users come front and explore and invest in art works.
This App contains Terms and Conditions and allows users to upload their artwork.
This repository is currently on the **Update-1** branch, which introduces structured documentation and integration with MCP (Model Context Protocol).

---

## 🚀 Features
- **MCP Integration**: Uses an SSE server for real-time communication.
- **Branch Update-1**: Latest improvements and documentation setup.
- **Scalable Structure**: Organized for future expansion into gallery management, user uploads, and interactive features.
- **Developer-Friendly**: Clean modular design for easy contributions.

---

### 📂 Clean Tree Layout
```text
artgallery/
│
├── 📖 docs/            # Documentation files
├── ⚙️ src/             # Core source code
├── 🌐 public/          # Static assets
│
├── 📦 package.json     # Dependencies and scripts
└── 📝 README.md        # Project overview
```

---

### 📂 Hierarchical Order (Grouped)
```text
artgallery/
│
├── Project Essentials
│   ├── 📦 package.json   # Dependencies and scripts
│   └── 📝 README.md      # Project overview
│
├── Development
│   ├── ⚙️ src/           # Core source code
│   └── 🌐 public/        # Static assets
│
└── Documentation
    └── 📖 docs/          # Documentation files
```


---

## 🔗 MCP Server Configuration
The repo integrates with MCP using the following configuration:

```json
{
  "servers": {
    "artgallery Docs": {
      "type": "sse",
      "url": "https://gitmcp.io/AsifAlthaf/artgallery/tree/Update-1"
    }
  }
}
```

This allows real-time streaming of documentation and updates directly from the repo.

---
```
## ⚙️ Tech Stack
```bash
This is a MERN Stack project integrated with Cloudinary for image storage and display online (free tier)
For Mobile Appliaction -> **React Native**  has been used with same backend.
For Web Appliation -> **React JS with Tailwind CSS with Express as a server and MongoDB as a DB** 
```

## 📱 App Screens

### Authentication
| Account Creation | Sign-in | Terms & Conditions |
|------------------|---------|--------------------|
| <img src="https://github.com/user-attachments/assets/654bc321-3e3d-4fa4-a433-47160a44ba79" width="250"/> | <img src="https://github.com/user-attachments/assets/4d1895ea-963b-4c8e-a535-3d9d3f3d4e36" width="250"/> | <img src="https://github.com/user-attachments/assets/88e7e4ab-ae45-4696-abe4-536e3a464017" width="250"/> |

### Browsing
| Home Page | Discover | View Artwork |
|-----------|----------|--------------|
| <img src="https://github.com/user-attachments/assets/074a327c-230d-424c-af76-fded76ea69b1" width="250"/> | <img src="https://github.com/user-attachments/assets/bb70368e-343b-40e3-af16-ca2555726ac5" width="250"/> | <img src="https://github.com/user-attachments/assets/5290fe38-da63-4ef3-86c7-f76849d888bb" width="250"/> |

### Selling & Buying
| Upload Artwork | Cart | Checkout |
|----------------|------|----------|
| <img src="https://github.com/user-attachments/assets/10c7d012-009a-4cdd-89eb-223dbd06a16f" width="250"/> | <img src="https://github.com/user-attachments/assets/1f3eeab4-d8b4-489a-9838-45c337575744" width="250"/> | <img src="https://github.com/user-attachments/assets/f0933814-1c06-464a-a5bd-98e4ea5b66df" width="250"/> |

### Profile
<img src="https://github.com/user-attachments/assets/724da6a5-7585-49c8-988b-a3beb03ef153" width="250"/>


## 🛠️ Getting Started
```
### Prerequisites
- Node.js (>= 18.x)
- npm or yarn

### Installation
```bash
git clone https://github.com/AsifAlthaf/artgallery.git
cd artgallery
git checkout Update-1
npm install
```

### Run the Project for frontend and backend and mobile
```bash
cd /project
npm run dev
```

```bash
cd /backend
npm run dev
```
```bash
cd /mobile
npx expo start
```
---

## 📖 Documentation
All project documentation is available under the `docs/` folder and streamed via MCP.  
You can access live docs through the configured SSE server.

---

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your fork
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License.  
Feel free to use, modify, and distribute with attribution.

---

## 👨‍💻 Contributors
- **Asif Althaf**   **Rohini Sai**
  BTech, SRM University | Passionate about AI-powered platforms and scalable solutions
```

```
## How to use
- Use the mobile application with this link
- #https://expo.dev/accounts/asif_shaik/projects/artbloom-mobile/builds/57c5deee-7038-4569-9d10-c05f0bc29a75
- Download the APK and create your account manually
- https://art-bloom.onrender.com
- Hit the above URL for the backend to start
- And all set you can use Art Bloom and explore Art Works.
