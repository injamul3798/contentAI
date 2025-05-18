# AI-Powered Content Curation API



https://github.com/user-attachments/assets/5dcd3c22-16fa-4a05-9a9f-5c072b15c32e





**Created by Injamul Haque, Software Engineer (AI/ML)**

---

## Project Objective

A REST API for content curation, summarization, and AI-powered analysis, demonstrating expertise in backend development, modern technologies, and best practices.

---

## Tech Stack

- **Framework:** Django REST Framework (DRF)
- **Database:** PostgreSQL (via Docker)
- **Authentication:** JWT (SimpleJWT)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **AI Integration:** GROQ API via LangChain
- **Frontend:** (Optional, included in repo)

---

## Role-Based Access Control (RBAC)

- **Public (Unauthenticated):**
  - View/search public content summaries
  - Register account

- **End-User (Authenticated):**
  - All public permissions
  - Manage own content (CRUD)
  - Request AI analysis

- **Admin:**
  - All end-user permissions
  - View all users
  - Manage all content
  - System analytics/configuration (basic)

---

## Core Features Implemented

- **Content Management:**  
  - CRUD operations for content
  - Content ownership enforced (users can only edit/delete their own content)
  - Admins can manage all content

- **Authentication:**  
  - JWT-based registration, login, logout, and token refresh

- **User Management:**  
  - Admins can view all users

- **AI Integration:**  
  - AI-powered content analysis (summarization, sentiment, topics) via GROQ API and LangChain

- **API Standards:**  
  - RESTful endpoints
  - Proper error handling and validation

- **Containerization:**  
  - Multi-stage Dockerfile for backend
  - Docker Compose for backend, frontend, and PostgreSQL

- **CI/CD:**  
  - GitHub Actions workflow for linting, testing, and Docker image build

---

## Endpoints Overview

| Endpoint                       | Method | Role Required      | Description                                 |
|--------------------------------|--------|--------------------|---------------------------------------------|
| `/auth/register/`              | POST   | Anyone             | Register a new user                         |
| `/auth/login/`                 | POST   | Anyone             | Obtain JWT tokens                           |
| `/auth/token/refresh/`         | POST   | Anyone             | Refresh JWT tokens                          |
| `/auth/logout/`                | POST   | Authenticated      | Logout (blacklist refresh token)            |
| `/users-list/`                 | GET    | Admin only         | View all users                              |
| `/contents/`                   | GET    | Anyone             | List all content                            |
| `/contents/`                   | POST   | Authenticated      | Create new content                          |
| `/contents/<id>/`              | GET    | Anyone             | View content details                        |
| `/contents/<id>/`              | PUT    | Owner/Admin        | Update content                              |
| `/contents/<id>/`              | DELETE | Owner/Admin        | Delete content                              |
| `/analyze-content/`            | POST   | Anyone             | AI analysis of content                      |
| `/users/me/`                   | GET    | Authenticated      | View own profile                            |

---

## AI Content Analysis

- **Endpoint:** `/analyze-content/` (POST)
- **Features:** Summarization, sentiment analysis, topic extraction
- **Powered by:** GROQ LLM via LangChain

---


## Getting Started
**Clone it with:**

```sh
git clone https://github.com/injamul3798/contentAI.git
cd contentAI
```
### 1. Backend Setup

```sh
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 2. Frontend Setup

Open a new terminal and run:

```sh
cd frontend
npm install
npm run dev
```

---

### 3. Create Admin User

You can create an admin user in two ways:

**A. Run the script:**

```sh
python core/create_admin_acccount.py
```

**B. Or register/login via API:**

- **username:** `admin`
- **password:** `adminpassword`

---
