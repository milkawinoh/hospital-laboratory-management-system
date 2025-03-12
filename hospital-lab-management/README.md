# 🚀 Hospital Laboratory Management System

A simple web application for managing diagnostic test results in medical laboratories.

---

## 📌 Project Overview

Medical laboratories often face challenges with managing test results efficiently. This system provides an intuitive dashboard for recording, retrieving, updating, and deleting diagnostic test results.

---

## 📌 Features

✅ **CRUD Operations**: Manage test results (Create, Read, Update, Delete).\
✅ **Pagination & Search**: Quickly find and navigate test records.\
✅ **Next.js 15**: Built with the latest version of Next.js.\
✅ **Prisma ORM**: Seamless interaction with PostgreSQL.\
✅ **Supabase**: Cloud-hosted PostgreSQL database.\
✅ **Tailwind CSS**: Modern, responsive styling.

---

## 📌 Technologies Used

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Validation**: Zod, React Hook Form
- **HTTP Requests**: Axios

---

## 📌 System Architecture

The application follows a **Client-Server Model**:

- **Frontend (Client)**: Next.js serves as the front-end, handling UI interactions and sending requests to the backend.
- **Backend (Server)**: Next.js API routes handle CRUD operations, utilizing Prisma to interact with the Supabase database.
- **Database**: Supabase (PostgreSQL) stores all test results securely.

### **Data Flow:**

1️⃣ User interacts with the UI (fills a form, clicks a button).\
2️⃣ The frontend makes an HTTP request via Axios.\
3️⃣ The backend processes the request, validates input with Zod, and interacts with the database using Prisma.\
4️⃣ The response is returned to the frontend, updating the UI accordingly.

---

## 📌 Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/milkawinoh/hospital-lab-management.git
cd hospital-lab-management
```

### **2️⃣ Install Dependencies**

```bash
npm install
```

### **3️⃣ Configure Environment Variables**

Create a **`.env.local`** file and add:

```env
# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL=postgresql://your-database-url

# Direct connection to the database. Used for migrations.
DIRECT_URL=postgresql://your-direct-database-url


```

### **4️⃣ Set Up Prisma & Database**

```bash
npx prisma migrate dev --name init
```

### **5️⃣ Start the Development Server**

```bash
npm run dev
```

*App runs at ****[http://localhost:3000](http://localhost:3000)***

---

## 📌 API Endpoints

| Method     | Endpoint         | Description              |
| ---------- | ---------------- | ------------------------ |
| **GET**    | `/api/tests`     | Get all test results     |
| **POST**   | `/api/tests`     | Create a new test result |
| **GET**    | `/api/tests/:id` | Get a test result by ID  |
| **PUT**    | `/api/tests/:id` | Update a test result     |
| **DELETE** | `/api/tests/:id` | Delete a test result     |

---

## 📌 Deployment

This app is deployed using **Vercel**.

### **1️⃣ Deploy on Vercel**

Run the command below to deploy:

```bash
vercel
```

---



## 📌 Future Improvements

- ✅ Add Role-Based Access Control (RBAC)
- ✅ Improve UI with animations
- ✅ Export test results as PDF

---

## 📌 Contributors

👤 **Milkawinoh**\
📧 milkawinoh@gmail.com

---

## 📌 License

📜 MIT License

---

## 📌 Next Steps

1️⃣ Copy this README into your **README.md** file.\
2️⃣ Replace placeholders with **your actual Supabase credentials**.\
3️⃣ Push to GitHub and deploy! 🚀

