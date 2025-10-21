# 🤝 Stack-Coders Collaboration Platform💻

A full-stack web application that allows users to **create projects, collaborate with others, and get to connect with fellow developers in the community** — featuring authentication, project collaboration, and community feeds.  

Built with **Next.js (Frontend)**, **NestJS (Backend)**, and **MongoDB (Database)**.

---

---

## 🧩 Project Overview

This platform enables developers to **create and showcase projects**, **collaborate with peers**, and **communicate effectively** within a coding community.  
It integrates authentication, collaboration requests, email notifications, and community feeds for event sharing.

---

## 🌟 Features

### 👤 User Authentication
- JWT-based **Signup/Login**.
- **Forgot Password** flow using email verification code.
- **Role-based access control** (User / Admin).
<img width="947" height="439" alt="image" src="https://github.com/user-attachments/assets/3722cfe1-128c-4bbd-96c0-85248c979bbc" />


### 💡 Project Management
- Create, edit, and delete personal projects.
- View all public projects.
- Each project stores details such as title, description, category, tech stack, and GitHub repository link.
<img width="949" height="437" alt="image" src="https://github.com/user-attachments/assets/64a6e2c4-97a0-4acd-83ca-2cfb7d27f807" />



### 🤝 Collaboration Requests
- Other users can **send collaboration requests** on projects.
- Project owners receive **email notifications (via Resend)**.
- Owners can **approve or reject** requests.
- Approved users become **team members** — their names, profiles  and GitHub repo for the project source code become visible on the project.

<img width="938" height="440" alt="image" src="https://github.com/user-attachments/assets/6901a49b-c3f1-4b11-9fb8-eb554be5d7f7" />

### 🧑‍💻 User Profiles
- Each user has a profile with **contact info, skills, and avatar** (uploaded via Cloudinary).
- Clicking a team member’s name redirects to their profile for contact.
<img width="949" height="446" alt="image" src="https://github.com/user-attachments/assets/f825b037-6965-4ded-8461-3e15119cdf55" />


### 📰 Community Feed (Admin Feature)
- Admins can post **community updates, events, and meetups** visible to all users.
<img width="935" height="447" alt="image" src="https://github.com/user-attachments/assets/be7ebce1-f6a8-4acb-839d-1d8be57dc59a" />


---
---

## 🧰 Setup Instructions

Follow these steps to set up and run the project locally.

---

### Clone the Repository
```bash
git clone https://github.com/ashbel747/stack.coders.git
cd stackcoders
```

### Setup backend env variables 
Create a .env file in /server and add this variables
```bash
PORT=4000
MONGO_URI='mongodb+srv://ashbel:1238%40ashbel@cluster0.yosfxah.mongodb.net/stack?retryWrites=true&w=majority&appName=Cluster0'
JWT_SECRET='supersecretkey123'
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=dpjp7emtw
CLOUDINARY_API_KEY=186796868157881
CLOUDINARY_API_SECRET=UQanIVUO1Lb_Zzg-XDfTYkPuPjA
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_API_KEY=re_SxkkiPwc_9Z5dfWWQzfW1BmihMKJ3ZQTX
CONTACT_RECEIVER_EMAIL=kashbel747@gmail.com
```

### Install backend dependencies and run server locally
```bash
cd server
npm install
npm run start:dev
```

### Setup frontend env variables 
Create a .env.local file in /client and add this variables
```bash
NEXT_PUBLIC_API_URL=https://stack-coders-services.onrender.com/
```
### Install frontend dependencies and run server locally
```bash
cd client
npm install
npm run dev
```




