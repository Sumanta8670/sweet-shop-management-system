# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop's inventory and sales. Built with Spring Boot, React, PostgreSQL, and modern development practices including TDD.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [My AI Usage](#my-ai-usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

The Sweet Shop Management System is a comprehensive solution for managing sweet shop operations including:
- User authentication and authorization
- Sweet inventory management
- Customer purchases
- Admin panel for inventory control
- Search and filtering capabilities
- Real-time inventory updates

## ✨ Features

### User Features
- User registration and login with JWT authentication
- Browse all available sweets
- Search sweets by name, category, or price range
- Purchase sweets with inventory management
- View sweet details and availability

### Admin Features
- Add, update, and delete sweets
- Manage inventory quantities
- Restock sweets
- View all inventory information
- Override regular user operations

### Security Features
- JWT token-based authentication
- Role-based access control (User/Admin)
- Password encryption with BCrypt
- Protected API endpoints
- CORS configuration

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Component Library**: Custom components

### Deployment
- **Backend**: Render
- **Frontend**: Netlify
- **Database**: PostgreSQL (Cloud)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Java 17 or later
- Maven 3.6.0 or later
- Node.js 18.0.0 or later
- npm 9.0.0 or later
- PostgreSQL 12 or later
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/sweet-shop-management-system.git
cd sweet-shop-management-system
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Create PostgreSQL database
# Open PostgreSQL and run:
# CREATE DATABASE sweet_shop_db;
# CREATE USER postgres WITH PASSWORD 'postgres';
# ALTER ROLE postgres SUPERUSER;

# Update application.properties with your database credentials if different
# File: src/main/resources/application.properties
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## ▶️ Running the Application

### Start the Backend Server
```bash
cd backend

# Run the Spring Boot application
mvn spring-boot:run

# Server will start on http://localhost:8080/api
# API documentation accessible at http://localhost:8080/api/sweets
```

### Start the Frontend Development Server
```bash
cd frontend

# Run the Vite development server
npm run dev

# Application will be available at http://localhost:5173
```

### Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new user or login with existing credentials
3. Browse sweets and make purchases
4. For admin features, login with an admin account (manually set role in database)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response**: `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "expiresIn": 86400000
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response**: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "USER",
  "expiresIn": 86400000
}
```

### Sweet Endpoints

#### Get All Sweets (Public)
```http
GET /api/sweets
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "Chocolate",
    "price": 2.99,
    "quantity": 100,
    "description": "Delicious chocolate with almonds",
    "createdAt": 1703000000000,
    "updatedAt": 1703000000000
  }
]
```

#### Get Sweet by ID (Public)
```http
GET /api/sweets/{id}
```

#### Search Sweets (Public)
```http
GET /api/sweets/search?name=chocolate&minPrice=2&maxPrice=5
```

#### Add Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Gummy Bears",
  "category": "Gummies",
  "price": 1.99,
  "quantity": 200,
  "description": "Colorful gummy bears"
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Premium Gummy Bears",
  "category": "Gummies",
  "price": 2.49,
  "quantity": 150,
  "description": "Premium quality gummy bears"
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/{id}
Authorization: Bearer {token}
```

#### Purchase Sweet (Authenticated Users)
```http
POST /api/sweets/{id}/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 5
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/{id}/restock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 100
}
```

## 📁 Project Structure
````
sweet-shop-management-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sweetshop/
│   │   │   │   ├── config/              # Security and Tailwind configuration
│   │   │   │   ├── controller/          # REST API controllers
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── entity/              # JPA entities
│   │   │   │   ├── exception/           # Custom exceptions
│   │   │   │   ├── repository/          # Database repositories
│   │   │   │   ├── security/            # JWT utilities
│   │   │   │   ├── service/             # Business logic
│   │   │   │   └── SweetShopApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       ├── java/com/sweetshop/
│   │       │   ├── controller/          # Controller tests
│   │       │   ├── repository/          # Repository tests
│   │       │   └── service/             # Service tests
│   │       └── resources/
│   │           └── application-test.properties
│   ├── pom.xml
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── SweetCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── sweetService.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── sweetStore.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
├── README.md
└── .gitignore