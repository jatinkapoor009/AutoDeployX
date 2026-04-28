# 🚀 AutoDeployX — DevSecOps CI/CD Platform

> **Automated deployment platform** where developer's code automatically reaches AWS EC2 production server — with security scanning at every stage.

---

## 📌 Project Overview

AutoDeployX is an **end-to-end DevSecOps project** that demonstrates a real-world CI/CD workflow.  
When a developer runs `git push`, GitHub Webhook triggers Jenkins — which automatically builds a Docker image, runs a security scan, pushes to DockerHub, and deploys to AWS EC2.

**Live Demo:** `http://54.205.180.6:8081`

---

## 🏛️ System Architecture

```
Developer (git push)
        │
        ▼
    GitHub Repo
        │  (Webhook trigger)
        ▼
    Jenkins CI/CD
        │
   ┌────┴────┐
   │         │
Build      Security
Docker      Scan
Image      (Trivy)
   │
   ▼
DockerHub Registry
   │  (docker pull)
   ▼
AWS EC2 Server
   │
   ▼
┌──────────────────────────────┐
│         Nginx                │
│   (Reverse Proxy + Server)   │
│                              │
│   User Request               │
│       ↓                      │
│     Nginx                    │
│    ↙     ↘                   │
│ Frontend  Backend (API)      │
│ (static)  (dynamic)          │
└──────────────────────────────┘
```

---

## 🔄 Request Flow

```
1. User opens website in browser
2. Request hits Nginx (port 80 / 8081)
3. Nginx serves Frontend (HTML/CSS/JS) — static files
4. Frontend makes API call to backend
5. Nginx forwards API request to Backend (port 3000)
6. Backend processes and sends response
7. Frontend UI updates with data
```

---

## 🛠️ Tech Stack

| Technology | Category | Purpose |
|-----------|----------|---------|
| **GitHub** | Source Control | Code storage + Webhook trigger for Jenkins |
| **Jenkins** | CI/CD Server | Automated pipeline — from build to deploy |
| **Docker** | Containerization | Packages the application inside a container |
| **Docker Compose** | Orchestration | Multi-container management (Nginx + Backend) |
| **Nginx** | Web Server | Reverse proxy + Frontend static file serving |
| **AWS EC2** | Cloud Hosting | Ubuntu server — production deployment |
| **Trivy** | Security Scanner | Docker image CVE vulnerability scanning |
| **HTML/CSS/JS** | Frontend | Custom DevSecOps dashboard UI |

---

## ⚙️ CI/CD Pipeline Stages

```
git push origin main
        │
        ▼
┌─────────────────────────────────────────────────────┐
│                  Jenkins Pipeline                    │
│                                                      │
│  1. 📥 Checkout    → Pull latest code from GitHub    │
│  2. 🏗️  Build      → Build Docker image              │
│  3. 🔐 Login       → Secure DockerHub login          │
│  4. 🏷️  Tag         → Tag image with version         │
│  5. ⬆️  Push        → Push image to DockerHub        │
│  6. 🧪 Staging     → Deploy to staging server       │
│  7. ✅ Approval    → Manual gate — "Yes Deploy"      │
│  8. 🚀 Production  → Deploy to live server           │
└─────────────────────────────────────────────────────┘
```

---

## 🟢 Staging vs Production

| Environment | Port | Purpose |
|-------------|------|---------|
| **Staging** | `8081` | Testing environment — verify changes before going live |
| **Production** | `80` | Live environment — real users |

```yaml
# Staging
docker-compose -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔒 Security (DevSecOps)

| Check | Tool | Status |
|-------|------|--------|
| Container CVE Scan | Trivy | ✅ 0 Critical |
| Secret Detection | Jenkins | ✅ No secrets in code |
| Dependency Audit | npm audit | ⚠️ 2 LOW (non-critical) |
| Credentials | withCredentials() | ✅ Encrypted store |

> **DevSecOps Principle:** Security is integrated at every pipeline stage — not an afterthought.

---

## 📁 Project Structure

```
AutoDeployX/
├── frontend/
│   ├── index.html              # Main dashboard UI
│   ├── style.css               # Dark theme styling
│   └── script.js               # Pipeline simulation logic
├── backend/
│   └── ...                     # Node.js API server
├── nginx/
│   ├── Dockerfile              # Nginx container build
│   └── nginx.conf              # Reverse proxy config
├── docker-compose.yml          # Local development
├── docker-compose.staging.yml  # Staging environment
├── docker-compose.prod.yml     # Production environment
└── Jenkinsfile                 # CI/CD pipeline definition
```

---

## 🐳 Docker Compose (Simplified)

```yaml
version: '3'
services:
  backend:
    build: ./backend          # Node.js API

  nginx:
    build:
      context: .
      dockerfile: nginx/Dockerfile
    ports:
      - "8081:80"             # Staging port mapping
    depends_on:
      - backend
```

---

## 📄 Jenkinsfile Highlights

```groovy
pipeline {
  agent any
  triggers { githubPush() }        // Auto trigger on git push

  environment {
    DOCKER_USER    = "jatink9599"
    IMAGE_BACKEND  = "autodeployx-backend"
    IMAGE_NGINX    = "autodeployx-nginx"
    STAGING_FILE   = "docker-compose.staging.yml"
    PROD_FILE      = "docker-compose.prod.yml"
  }

  stage('DockerHub Login') {
    withCredentials([usernamePassword(
      credentialsId: 'dockerhub-creds'  // Encrypted — never hardcoded
    )])
  }

  stage('Approval') {
    input message: 'Deploy to PRODUCTION?', ok: 'Yes Deploy'
    // Pipeline pauses here — human must approve
  }
}
```

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/jatinkapoor009/AutoDeployX.git
cd AutoDeployX

# 2. Build and run with Docker Compose
docker-compose up --build

# 3. Open browser
http://localhost:8081
```

---

## 👨‍💻 Developer

**Jatin Kapoor**  
Passionate about automating everything — from code to cloud.  
Building real-world DevSecOps pipelines that ship fast and stay secure.

- 🐙 GitHub: [github.com/jatinkapoor009](https://github.com/jatinkapoor009)
- 🐳 DockerHub: [hub.docker.com/u/jatink9599](https://hub.docker.com/u/jatink9599)
- 💼 LinkedIn: [linkedin.com/in/jatin-kapoor1](https://www.linkedin.com/in/jatin-kapoor1/)

---

## 📊 Project Stats

- ⚙️ Pipeline Stages: **9**
- 🐳 Docker Images: **2** (Backend + Nginx)
- 🔒 Security Checks: **4**
- ☁️ Cloud: **AWS EC2 Ubuntu**
- 🌐 Status: **Live**

---

*Built with ❤️ — because great software deserves a pipeline that matches its quality.*
