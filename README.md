# 🏟️ SportZone — Courts, Fields & Facilities Management Platform

> A scalable, cloud-ready sports venue reservation and management platform built on **Microservices Architecture**. SportZone enables users to discover, book, and manage sports facilities 24/7 with real-time availability, conflict-free concurrent bookings, and secure payment processing.

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-0088CC?style=flat)
![React](https://img.shields.io/badge/React.js-18-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)
![API Gateway](https://img.shields.io/badge/API-Gateway-FF6C37?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Microservices Architecture](#microservices-architecture)
- [Services Overview](#services-overview)
- [API Gateway & Communication](#api-gateway--communication)
- [Database Design](#database-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Author](#author)
- [License](#license)

---

## 🌟 About the Project

Managing sports facilities is a complex challenge — from handling simultaneous booking requests to preventing double-bookings, processing payments, and notifying users. Traditional manual systems fail at scale.

**SportZone** solves this with a fully distributed, microservices-based platform that:

- Lets users **discover** nearby sports venues (courts, fields, indoor facilities)
- Enables **real-time booking** with instant availability checks
- Prevents **concurrent booking conflicts** using transactional locking
- Handles **secure payment processing** end-to-end
- Provides **venue owners** a management dashboard to track bookings and revenue
- Operates **24/7** with high availability via independent, fault-tolerant microservices

### Why Microservices?

| Traditional Monolith | SportZone Microservices |
|---|---|
| Single point of failure | Each service is independently deployable |
| Hard to scale specific features | Scale only the booking service during peak hours |
| Tight coupling between modules | Loose coupling via REST API communication |
| One tech stack for everything | Best tool for each service |
| Entire app restarts on update | Zero-downtime rolling updates per service |

---

## ✨ Key Features

- 🔍 **Venue Discovery** — Search and filter sports venues by sport type, location, price, and availability
- 📅 **Real-Time Booking** — Book slots instantly with live availability calendar
- 🔒 **Conflict-Free Concurrent Bookings** — Optimistic locking prevents double-booking under high traffic
- 💳 **Secure Payment Processing** — Integrated payment flow with booking confirmation
- 🏢 **Venue Owner Dashboard** — Add/manage facilities, view bookings, track revenue
- 👤 **User Authentication & Authorization** — JWT-based secure auth across all services
- 🔔 **Booking Notifications** — Email/SMS alerts on booking confirmation and cancellation
- 🌐 **API Gateway** — Single entry point with routing, load balancing, and rate limiting
- 📊 **Booking History** — Users can view past, upcoming, and cancelled bookings
- ⭐ **Reviews & Ratings** — Users can rate and review venues after a booking
- 📱 **Responsive Frontend** — React.js UI optimized for desktop and mobile

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Primary backend language |
| Spring Boot 3.x | Microservice framework |
| Spring Cloud Gateway | API Gateway & routing |
| Spring Security + JWT | Authentication & Authorization |
| Spring Data JPA | ORM & database interaction |
| Spring Cloud Netflix Eureka | Service discovery & registry |
| OpenFeign | Inter-service REST communication |
| Maven | Build tool & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| React.js 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| Tailwind CSS | Styling & responsive layout |
| React Context API | Global state management |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| MySQL 8.0 | Relational database (per service) |
| Each service has its own DB | Database-per-service pattern |

---

## 🏗️ Microservices Architecture

```
                        ┌────────────────────┐
                        │   React.js Client  │
                        │  (Port: 3000)      │
                        └────────┬───────────┘
                                 │ HTTP Requests
                                 ▼
                ┌────────────────────────────────┐
                │         API GATEWAY            │
                │    Spring Cloud Gateway        │
                │         Port: 8080             │
                │  • Route requests              │
                │  • JWT validation              │
                │  • Rate limiting               │
                │  • Load balancing              │
                └──────┬───────────────┬─────────┘
                       │               │
          ┌────────────┘               └────────────────┐
          │                                             │
          ▼                                             ▼
  ┌───────────────┐   ┌───────────────┐   ┌────────────────────┐
  │  User Service │   │ Venue Service │   │  Booking Service   │
  │  Port: 8081   │   │  Port: 8082   │   │    Port: 8083      │
  │               │   │               │   │                    │
  │ • Register    │   │ • Add venue   │   │ • Create booking   │
  │ • Login/Auth  │   │ • Search      │   │ • Check avail.     │
  │ • JWT issue   │   │ • Get details │   │ • Conflict check   │
  │ • Profile     │   │ • Update      │   │ • Cancel booking   │
  └───────┬───────┘   └───────┬───────┘   └────────┬───────────┘
          │                   │                     │
          ▼                   ▼                     ▼
   ┌──────────┐        ┌──────────┐          ┌──────────┐
   │  user_db │        │ venue_db │          │booking_db│
   │  (MySQL) │        │ (MySQL)  │          │ (MySQL)  │
   └──────────┘        └──────────┘          └──────────┘

          ┌────────────────────┐   ┌─────────────────────────┐
          │  Payment Service   │   │  Notification Service   │
          │    Port: 8084      │   │      Port: 8085         │
          │                    │   │                         │
          │ • Process payment  │   │ • Email notifications   │
          │ • Verify payment   │   │ • Booking confirmation  │
          │ • Refund handling  │   │ • Cancellation alerts   │
          └────────┬───────────┘   └────────────────-────────┘
                   │
                   ▼
            ┌──────────┐
            │payment_db│
            │ (MySQL)  │
            └──────────┘

  ┌──────────────────────────────────────────┐
  │         Eureka Service Registry          │
  │              Port: 8761                  │
  │  All services register here at startup   │
  └──────────────────────────────────────────┘
```

---

## 🔧 Services Overview

### 1. 🔐 User Service (Port: 8081)
Handles all user-related operations including registration, authentication, and profile management.

**Responsibilities:**
- User registration and login
- JWT token generation and validation
- Password encryption (BCrypt)
- User profile CRUD operations
- Role management (USER / VENUE_OWNER / ADMIN)

**Key Endpoints:**
```
POST   /api/users/register       → Register new user
POST   /api/users/login          → Login, returns JWT
GET    /api/users/profile        → Get current user profile
PUT    /api/users/profile        → Update profile
```

---

### 2. 🏟️ Venue Service (Port: 8082)
Manages all sports venue data — creation, updates, search, and availability.

**Responsibilities:**
- Add and manage sports venues (courts, fields, halls)
- Search venues by sport, location, price range
- Manage venue time slots and pricing
- Upload venue images
- Retrieve venue details and availability calendar

**Key Endpoints:**
```
POST   /api/venues               → Add new venue (Owner only)
GET    /api/venues               → List/search venues
GET    /api/venues/{id}          → Get venue details
PUT    /api/venues/{id}          → Update venue (Owner only)
DELETE /api/venues/{id}          → Delete venue (Owner only)
GET    /api/venues/{id}/slots    → Get available time slots
```

---

### 3. 📅 Booking Service (Port: 8083)
The core service — handles all booking operations with conflict prevention logic.

**Responsibilities:**
- Create, modify, and cancel bookings
- Real-time availability checking
- Optimistic locking to prevent double-bookings under concurrent load
- Booking history retrieval
- Communication with Payment Service via OpenFeign

**Conflict Prevention Logic:**
```java
@Transactional
public Booking createBooking(BookingRequest request) {
    // 1. Lock the slot record (optimistic locking with @Version)
    VenueSlot slot = slotRepository.findById(request.getSlotId())
        .orElseThrow(() -> new SlotNotFoundException("Slot not found"));

    // 2. Check if slot is already booked
    if (slot.isBooked()) {
        throw new SlotAlreadyBookedException("This slot is no longer available");
    }

    // 3. Mark slot as booked (atomic)
    slot.setBooked(true);
    slotRepository.save(slot);

    // 4. Create booking record
    Booking booking = new Booking(request, slot);
    return bookingRepository.save(booking);
}
```

**Key Endpoints:**
```
POST   /api/bookings             → Create booking
GET    /api/bookings/user        → Get user's bookings
GET    /api/bookings/{id}        → Get booking details
PUT    /api/bookings/{id}/cancel → Cancel a booking
GET    /api/bookings/venue/{id}  → Get bookings for a venue (Owner)
```

---

### 4. 💳 Payment Service (Port: 8084)
Handles secure payment processing for all bookings.

**Responsibilities:**
- Process booking payments
- Verify payment status
- Handle refunds on cancellation
- Maintain payment transaction history

**Key Endpoints:**
```
POST   /api/payments/process     → Process payment for booking
GET    /api/payments/{id}        → Get payment details
POST   /api/payments/refund/{id} → Initiate refund
```

---

### 5. 🔔 Notification Service (Port: 8085)
Handles all outgoing notifications triggered by booking events.

**Responsibilities:**
- Send booking confirmation emails
- Send cancellation notifications
- Remind users of upcoming bookings
- Notify venue owners of new bookings

---

### 6. 🌐 API Gateway (Port: 8080)
The single entry point for all client requests.

**Responsibilities:**
- Route requests to the correct microservice
- JWT token validation before forwarding requests
- Rate limiting to prevent abuse
- Load balancing across service instances
- Centralized logging and request tracing

**Route Configuration:**
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**

        - id: venue-service
          uri: lb://VENUE-SERVICE
          predicates:
            - Path=/api/venues/**

        - id: booking-service
          uri: lb://BOOKING-SERVICE
          predicates:
            - Path=/api/bookings/**

        - id: payment-service
          uri: lb://PAYMENT-SERVICE
          predicates:
            - Path=/api/payments/**
```

---

### 7. 🗂️ Eureka Service Registry (Port: 8761)
All microservices register themselves with Eureka on startup. The API Gateway uses Eureka for service discovery and load balancing.

---

## 🗄️ Database Design

Each microservice maintains its **own isolated MySQL database** following the *Database-per-Service* pattern for loose coupling.

### user_db — Key Tables
```sql
CREATE TABLE users (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,         -- BCrypt hashed
    role        ENUM('USER','VENUE_OWNER','ADMIN') DEFAULT 'USER',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### venue_db — Key Tables
```sql
CREATE TABLE venues (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(150) NOT NULL,
    sport_type  VARCHAR(50) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    owner_id    BIGINT NOT NULL,               -- References user_id
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venue_slots (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    venue_id    BIGINT NOT NULL,
    slot_date   DATE NOT NULL,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    is_booked   BOOLEAN DEFAULT FALSE,
    version     BIGINT DEFAULT 0,             -- Optimistic locking
    FOREIGN KEY (venue_id) REFERENCES venues(id)
);
```

### booking_db — Key Tables
```sql
CREATE TABLE bookings (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    venue_id        BIGINT NOT NULL,
    slot_id         BIGINT NOT NULL,
    booking_date    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status          ENUM('CONFIRMED','CANCELLED','PENDING') DEFAULT 'PENDING',
    total_amount    DECIMAL(10,2) NOT NULL,
    payment_id      BIGINT
);
```

---

## 📁 Project Structure

```
SportZone/
│
├── eureka-server/                    # Service Registry
│   ├── src/main/java/
│   │   └── EurekaServerApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── api-gateway/                      # API Gateway
│   ├── src/main/java/
│   │   ├── config/
│   │   │   ├── GatewayConfig.java
│   │   │   └── JwtAuthFilter.java
│   │   └── ApiGatewayApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── user-service/                     # User Management
│   ├── src/main/java/
│   │   ├── controller/UserController.java
│   │   ├── service/UserService.java
│   │   ├── repository/UserRepository.java
│   │   ├── model/User.java
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java
│   │   │   └── LoginRequest.java
│   │   ├── security/
│   │   │   ├── JwtUtil.java
│   │   │   └── SecurityConfig.java
│   │   └── UserServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── venue-service/                    # Venue Management
│   ├── src/main/java/
│   │   ├── controller/VenueController.java
│   │   ├── service/VenueService.java
│   │   ├── repository/
│   │   │   ├── VenueRepository.java
│   │   │   └── VenueSlotRepository.java
│   │   ├── model/
│   │   │   ├── Venue.java
│   │   │   └── VenueSlot.java
│   │   └── VenueServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── booking-service/                  # Booking & Conflict Management
│   ├── src/main/java/
│   │   ├── controller/BookingController.java
│   │   ├── service/BookingService.java
│   │   ├── repository/BookingRepository.java
│   │   ├── model/Booking.java
│   │   ├── feign/
│   │   │   ├── VenueClient.java
│   │   │   └── PaymentClient.java
│   │   └── BookingServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── payment-service/                  # Payment Processing
│   ├── src/main/java/
│   │   ├── controller/PaymentController.java
│   │   ├── service/PaymentService.java
│   │   ├── model/Payment.java
│   │   └── PaymentServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── notification-service/             # Email/SMS Notifications
│   ├── src/main/java/
│   │   ├── service/NotificationService.java
│   │   └── NotificationServiceApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── sportzone-frontend/               # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── VenueCard.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── SlotCalendar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── VenueList.jsx
│   │   │   ├── VenueDetail.jsx
│   │   │   ├── BookingConfirm.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js                # Axios API calls
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+ & npm
- MySQL 8.0+
- Maven 3.8+
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/Darshanpakhale26/SportZone.git
cd SportZone
```

---

### 2. Set Up MySQL Databases

Create a separate database for each service:
```sql
CREATE DATABASE user_db;
CREATE DATABASE venue_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;
```

---

### 3. Configure Each Service

Update `application.yml` in each service with your MySQL credentials:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/user_db
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

---

### 4. Start Services in Order

> ⚠️ Always start Eureka Server first, then API Gateway, then the other services.

```bash
# Step 1 — Start Eureka Server
cd eureka-server
mvn spring-boot:run

# Step 2 — Start API Gateway
cd ../api-gateway
mvn spring-boot:run

# Step 3 — Start all microservices (open separate terminals)
cd ../user-service && mvn spring-boot:run
cd ../venue-service && mvn spring-boot:run
cd ../booking-service && mvn spring-boot:run
cd ../payment-service && mvn spring-boot:run
cd ../notification-service && mvn spring-boot:run
```

---

### 5. Start the React Frontend

```bash
cd sportzone-frontend
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Service Ports Summary

| Service | Port |
|---|---|
| Eureka Server | 8761 |
| API Gateway | 8080 |
| User Service | 8081 |
| Venue Service | 8082 |
| Booking Service | 8083 |
| Payment Service | 8084 |
| Notification Service | 8085 |
| React Frontend | 3000 |

---

## 📡 API Endpoints

All requests go through the **API Gateway at port 8080**.

### Authentication
```
POST   /api/users/register          → Register a new user
POST   /api/users/login             → Login → returns JWT token
```

### Venues
```
GET    /api/venues                  → Search/list all venues
GET    /api/venues/{id}             → Get venue details
GET    /api/venues/{id}/slots       → Get available slots for a venue
POST   /api/venues                  → Add new venue        [VENUE_OWNER]
PUT    /api/venues/{id}             → Update venue info    [VENUE_OWNER]
DELETE /api/venues/{id}             → Delete venue         [VENUE_OWNER]
```

### Bookings
```
POST   /api/bookings                → Create a new booking [AUTH]
GET    /api/bookings/user           → Get my bookings      [AUTH]
GET    /api/bookings/{id}           → Get booking by ID    [AUTH]
PUT    /api/bookings/{id}/cancel    → Cancel booking       [AUTH]
GET    /api/bookings/venue/{id}     → Bookings for venue   [VENUE_OWNER]
```

### Payments
```
POST   /api/payments/process        → Process payment      [AUTH]
GET    /api/payments/{id}           → Payment details      [AUTH]
POST   /api/payments/refund/{id}    → Refund payment       [AUTH]
```

> 🔐 Routes marked `[AUTH]` require a valid **Bearer JWT token** in the Authorization header.

---

## 📷 Screenshots

| Page | Description |
|---|---|
| 🏠 Home | Landing page with search bar and featured venues |
| 🔍 Venue Listing | Filtered list of available sports venues |
| 🏟️ Venue Detail | Venue info, photos, time slot calendar |
| 📅 Booking Form | Select slot and confirm booking |
| ✅ Booking Confirmation | Booking summary with payment status |
| 👤 My Bookings | User's upcoming and past bookings |
| 🏢 Owner Dashboard | Venue stats and booking management |

> _Add screenshots to `/screenshots/` folder and update paths here._

---

## 🔮 Future Improvements

- [ ] 🐳 **Docker & Docker Compose** — Containerize all services for one-command startup
- [ ] ☸️ **Kubernetes Deployment** — Orchestrate services with auto-scaling and self-healing
- [ ] ☁️ **AWS Deployment** — Host on EC2 / ECS with RDS for production MySQL
- [ ] 📨 **Kafka / RabbitMQ** — Replace synchronous inter-service calls with async event-driven messaging
- [ ] 🔍 **Elasticsearch** — Power advanced venue search with full-text and geo-search
- [ ] 📊 **Admin Analytics Dashboard** — Revenue charts, booking trends, peak hours heatmap
- [ ] 🗺️ **Google Maps Integration** — Show venue locations on interactive map
- [ ] 📱 **React Native Mobile App** — Cross-platform mobile app for iOS and Android
- [ ] ⭐ **Reviews & Ratings System** — Allow users to review and rate venues post-booking
- [ ] 🤖 **AI-based Slot Recommendations** — Suggest best slots based on user preferences and history
- [ ] 🔔 **Push Notifications** — Browser and mobile push alerts for booking updates
- [ ] 💬 **Real-time Chat** — WebSocket-based chat between venue owners and users

---

## 👨‍💻 Author

**Darshan Pakhale**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/darshan261002)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/Darshanpakhale26)
[![LeetCode](https://img.shields.io/badge/LeetCode-Profile-FFA116?style=flat&logo=leetcode)](https://leetcode.com/u/darshan26_10/)
[![Email](https://img.shields.io/badge/Email-darshanvp2610@gmail.com-EA4335?style=flat&logo=gmail)](mailto:darshanvp2610@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

> ⭐ If you found this project helpful, please give it a star on GitHub — it motivates further development!
