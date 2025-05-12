Archery Score App

Project Overview

This project is a frontend application using React, HTML, and CSS, with a backend powered by Python (FastAPI) and MySQL. The main focus of this project is to interact with a MySQL database using a modern, clean interface.

Technologies Used

Frontend: React, Axios, HTML, CSS

Backend: Python, FastAPI

Database: MySQL

🚀 Installation Guide

✅ Prerequisites

Python installed on your system

Node.js installed (for React)

MySQL Server running (local or remote)

Git installed

✅ Clone the Repository

git clone https://github.com/your-username/archery_score_app.git
cd archery_score_app

🚀 Setting Up the Backend (Python + FastAPI)

✅ Go to the Backend Folder

cd backend

✅ Install Python Dependencies

pip install fastapi uvicorn mysql-connector-python

✅ Start the FastAPI Server

uvicorn main:app --reload

✅ Test the API

In your browser, visit:

http://localhost:8000/docs

🚀 Setting Up the Frontend (React)

✅ Go to the Frontend Folder

cd ../frontend

✅ Install Dependencies

npm install axios

✅ Start the React App

npm start

✅ Access the App

Visit http://localhost:3000 in your browser.

You should see the React frontend connected to your FastAPI backend.

🚀 How It Works

The MySQL database stores all data.

The FastAPI (Python) backend connects to the MySQL database and provides API endpoints.

The React app (frontend) fetches data from the FastAPI API and displays it.
