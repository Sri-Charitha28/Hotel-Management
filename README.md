# Hotel Management and Room Booking System

## Project Overview

The Hotel Management and Room Booking System is a full-stack web application developed using FastAPI, HTML, CSS, JavaScript, SQLAlchemy, and MySQL. The system automates hotel operations by providing room booking, customer management, booking management, reporting, and analytics functionalities.

The application consists of two main modules:

- Customer Module
- Admin Module

---

## Features

### Customer Module

- User Registration
- User Login
- View Available Rooms
- Book Rooms
- View Booking History
- Profile Management

### Admin Module

- Dashboard
- Room Management
- Customer Management
- Booking Management
- Reports and Analytics
- PDF Report Export
- Excel Report Export

---

## Dashboard Features

- Total Rooms
- Total Customers
- Total Bookings
- Total Revenue
- Room Status Overview
- Booking Status Overview
- Recent Bookings

---

## Reports Module

The Reports module provides:

- Date-wise Report Generation
- Room Occupancy Statistics
- Booking Statistics
- Revenue Calculation
- Recent Booking History
- Dynamic Charts
- PDF Export
- Excel Export

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend

- Python
- FastAPI

### Database

- MySQL
- SQLAlchemy ORM

### Libraries

- ReportLab
- OpenPyXL
- Jinja2
- Pydantic
- Uvicorn

---

## Project Structure

```
Hotel Management
│
├── app
│   ├── database
│   ├── models
│   ├── routes
│   ├── schemas
│   ├── static
│   │   ├── css
│   │   └── js
│   ├── templates
│   └── main.py
│
├── requirements.txt
├── README.md
└── hotel_database.sql
```

---

## Installation

Clone the repository

```bash
git clone <repository_url>
```

Navigate to the project directory

```bash
cd Hotel-Management
```

Install the required dependencies

```bash
pip install -r requirements.txt
```

Configure the database connection in

```
app/database/connection.py
```

Run the application

```bash
uvicorn app.main:app --reload
```

Open the application in your browser

```
http://127.0.0.1:8000
```

---

## Export Reports

The system allows administrators to export booking reports in:

- PDF Format
- Excel Format (.xlsx)

Reports can be generated for any selected date range.

---

## Authentication

- Customer Login
- Admin Login
- Session-based Authentication

---

## Libraries Used

- FastAPI
- SQLAlchemy
- Jinja2
- Pydantic
- ReportLab
- OpenPyXL
- Uvicorn
- Chart.js

---

## Future Enhancements

- Online Payment Integration
- Email Notifications
- SMS Notifications
- QR Code Based Check-in
- Cloud Deployment

---

## Developed By

Kotha Muni Sri Charitha

Bachelor of Engineering

Computer Science and Engineering