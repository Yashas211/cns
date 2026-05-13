# 🔐 Threshold-Based Secure File Communication System

A secure file communication platform built using **React.js** and **FastAPI** that demonstrates encrypted file transfer, multi-user approval workflow, and controlled decryption using modern cryptographic techniques.

---

# 📌 Project Overview

This project implements a secure communication system where:

- Files are encrypted before storage/transmission
- Receiver cannot access the file immediately
- Two different users must approve the request
- Only then can the receiver decrypt and download the original file

The system demonstrates:
- Secure file transfer
- AES-GCM encryption
- REST API communication
- Multi-user authorization
- Controlled decryption workflow

---

# 🚀 Features

## 🔐 Security Features
- AES-GCM encryption
- Integrity verification using authentication tags
- Controlled access mechanism
- Threshold-based approval system
- Receiver-only decryption access

---

## 👥 Multi-User Authorization
- Sender cannot approve
- Receiver cannot approve
- Two different users required
- Duplicate approvals blocked

---

## 🌐 Communication Features
- REST API architecture
- Secure file upload/download
- Client-server communication using FastAPI
- Dynamic inbox system

---

## ⚛️ Frontend Features
- React.js frontend
- Glassmorphism UI
- Drag-and-drop upload
- Responsive dashboard
- Toast notifications
- Dynamic approval panel

---

# 🧱 Tech Stack

## Frontend
- React.js
- Axios
- Framer Motion
- React Dropzone
- React Hot Toast

## Backend
- FastAPI
- Python
- PyCryptodome

## Cryptography
- AES-GCM Encryption

---

# 📂 Project Structure

```text
project-folder/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       └── index.js
│
└── README.md
```

---

# 🔄 System Workflow

```text
User1 uploads file
↓
Backend encrypts file using AES-GCM
↓
Encrypted file stored securely
↓
User2 sees locked/encrypted file
↓
User3 approves
↓
User4 approves
↓
Threshold reached
↓
User2 downloads original decrypted file
```

---

# 🔐 Encryption Flow

```text
Original File
↓
AES-GCM Encryption
↓
Ciphertext + Nonce + Tag
↓
Secure Storage
↓
Approval Verification
↓
AES-GCM Decryption
↓
Original File Returned
```

---

# 🌐 REST API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/login` | POST | User login |
| `/send` | POST | Upload encrypted file |
| `/inbox` | GET | Receiver inbox |
| `/pending` | GET | Pending approvals |
| `/approve` | POST | Approve encrypted file |
| `/read` | GET | Decrypt and download |

---

# ⚙️ Installation & Setup

---

## 🔹 Backend Setup

### Navigate to backend folder

```bash
cd backend
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run FastAPI server

```bash
python -m uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

## 🔹 Frontend Setup

### Navigate to frontend folder

```bash
cd frontend
```

### Install dependencies

```bash
npm.cmd install
```

### Start React application

```bash
npm.cmd start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔑 Demo Users

Use any of the following usernames:

```text
user1
user2
user3
user4
```

---

# 🧪 Testing Flow

## Step 1
Login as:

```text
user1
```

Upload file and send to:

```text
user2
```

---

## Step 2
Login as:

```text
user2
```

Inbox shows:

```text
Encrypted
```

User2 cannot download yet.

---

## Step 3
Login as:

```text
user3
```

Approve the message.

---

## Step 4
Login as:

```text
user4
```

Approve the same message.

---

## Step 5
Login back as:

```text
user2
```

Now file becomes:

```text
Unlocked
```

User2 can now download the original file.

---

# 📁 Supported File Types

- PDF
- PNG / JPG
- DOCX
- TXT
- ZIP
- Any binary file format

The system preserves:
- Original file name
- Original file type
- Original file contents

---

# 🛡️ Security Concepts Demonstrated

- AES-GCM Encryption
- Integrity Verification
- Threshold Authorization
- Access Control
- Secure File Transfer
- REST API Security Architecture

---

# 📌 Applications

This system can be applied in:

- Banking approval systems
- Secure enterprise communication
- Military communication workflows
- Medical record sharing
- Cloud secure storage
- Multi-signature authorization systems

---

# ⚠️ Current Limitations

- No database persistence
- No JWT authentication
- No cloud deployment
- In-memory storage only

---

# 🚀 Future Enhancements

- RSA-based hybrid cryptography
- JWT authentication
- PostgreSQL/MongoDB integration
- WebSocket real-time updates
- Digital signatures
- Docker deployment
- Cloud hosting

---
