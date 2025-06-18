# SIADO Clone - Sistem Informasi Dosen (Front End)

SIADO is a modern academic management system built with React and TypeScript, designed to streamline the academic workflow for administrators and lecturers. It provides a clean, responsive interface with comprehensive features for course management, assignment tracking, and student evaluation.

## ✨ Features

- **Role-based access control** for administrators and lecturers
- **Comprehensive dashboards** with real-time statistics and quick actions
- **Course management** with enrollment tracking and material organization
- **Assignment system** with submission tracking and grading interface
- **User management** for administrators to manage system users
- **Responsive design** that works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Authentication**: JWT
- **Storage**: Supabase
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API (Laravel) running on `http://localhost:8000`
- Git for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AiFahri/siado-clone-fe.git
cd siado-clone-fe
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## 🗂️ Project Structure

```
src/
├── Components/           # Reusable UI components
│   ├── Common/          # Generic components
│   └── Layout/          # Layout components
├── Pages/               # Page components
│   ├── Admin/           # Admin pages
│   └── Lecturer/        # Lecturer pages
├── Utils/               # Utility functions
│   ├── api.ts           # API client and endpoints
│   └── auth.ts          # Authentication helpers
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── routes/              # Route definitions
│   └── index.tsx        # Main routing configuration
├── Hooks/                # Custom React hooks
└── types/               # TypeScript type definitions
```

## 🔐 Authentication & Role Management

SIADO implements JWT-based authentication with role-based access control:

- **Admin**: Full system access - user management, course management
- **Lecturer**: Course teaching - assignment, grading, material management

## 🔄 Integration with Backend and StudentClub

### Backend Integration

SIADO connects to a [Laravel-based API](https://github.com/AiFahri/siado-clone) that provides comprehensive endpoints for:

- User authentication and authorization
- Course and enrollment management
- Assignment creation and grading
- Material management
- Administrative functions

The backend implements JWT authentication and role-based access control to ensure secure data access across the entire ecosystem.

### StudentClub Integration

SIADO works in tandem with [StudentClub](https://github.com/lidwinae/studentclub), a Vue.js-based web application designed specifically for students. While SIADO focuses on administrative and teaching functionalities, StudentClub provides students with:

- Course management and enrollment
- Assignment tracking with clear deadlines
- Submission management for assignments
- Academic progress monitoring

Both frontend applications share the same backend API, ensuring data consistency across the entire academic ecosystem. When lecturers create assignments or update course materials in SIADO, these changes are immediately reflected in the StudentClub interface for students.

### Integration Points:

- **Authentication**: Single sign-on capabilities across both platforms
- **Course Data**: Synchronized course information and materials
- **Assignments**: Assignments created in SIADO appear in StudentClub
- **Submissions**: Student submissions in StudentClub are available for grading in SIADO
