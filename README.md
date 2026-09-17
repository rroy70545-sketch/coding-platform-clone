# CodeNinja Academy

CodeNinja Academy is a full-stack web-based coding learning platform designed to help users learn programming and computer science concepts through structured courses, lessons, quizzes, progress tracking, and certificates.

## Project Overview

CodeNinja Academy provides a centralized learning environment where users can:

- Create an account and log in
- Browse available courses
- Search, filter, and sort courses
- View detailed course information
- Study lessons
- Track course progress
- Complete quizzes
- Save quiz scores
- View learning statistics
- Update profile information
- Change their password
- Generate course completion certificates

## Features

### User Authentication
- User registration
- User login
- Logout functionality
- Protected dashboard and profile pages

### Courses
The platform currently contains 8 courses:

1. Data Structures & Algorithms
2. Full Stack Web Development
3. Artificial Intelligence
4. Database Management
5. Android App Development
6. Cybersecurity Fundamentals
7. Data Analytics
8. Backend Development

### Learning System
- Structured lessons
- Lesson completion tracking
- Course progress tracking
- Continue/Review course functionality

### Quiz System
- Course-based quizzes
- Score calculation
- Quiz result display
- Persistent quiz scores using the backend database

### Dashboard
The dashboard provides:
- Overall learning progress
- Total courses
- Completed lessons
- Completed quizzes
- Course progress
- Quiz scores
- Continue/Review course options

### Profile Management
Users can:
- View profile information
- Update name and email
- Change their password
- View learning statistics

### Certificate Generation
Users who complete a course can generate a course completion certificate in PDF format.

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React
- jsPDF

### Backend
- Node.js
- Express.js
- REST API

### Database
- SQLite
- better-sqlite3

## Project Architecture

```text
User
  |
  v
React Frontend
  |
  | HTTP / REST API
  v
Express.js Backend
  |
  v
SQLite Database