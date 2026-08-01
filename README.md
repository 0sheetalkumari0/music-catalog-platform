# Music Catalog Insights Platform

A full-stack web application designed for exploring music catalogs, curating personal album collections, analyzing library metrics with interactive charts, and surfacing AI-driven catalog insights.

---

## 📌 Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                React + Vite Frontend (UI)                  │
 │  - Catalog Search (Debounced iTunes Search, Cache Indicator)│
 │  - Personal Library Manager (Grid/Table Views, Ratings)    │
 │  - Analytics Dashboard (4 Interactive Recharts)            │
 │  - AI Catalog Insights & Recommendation Center             │
 └──────────────────────────────┬──────────────────────────────┘
                                │ REST API (JWT Bearer Auth)
 ┌──────────────────────────────▼──────────────────────────────┐
 │                Spring Boot 3 Backend (Java 21)              │
 │  - Auth Controller & Service (JWT Authentication)           │
 │  - iTunes Search Proxy Service (In-Memory Caffeine Cache)  │
 │  - Library Controller & Service (JPA + Bean Validation)    │
 │  - AI Insights Engine & Controller                         │
 │  - Global Exception Handler (@RestControllerAdvice)        │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Spring Data JPA
 ┌──────────────────────────────▼──────────────────────────────┐
 │              H2 Database (PostgreSQL Mode)                  │
 │  - `users` (id, username, password, role, created_at)       │
 │  - `saved_albums` (id, apple_catalog_id, title, artist...)  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Entity Choice & Justification

**Chosen Entity Focus**: **Albums**

### Technical Rationale
1. **Multi-Dimensional Metadata**: Albums provide structured data attributes (`appleCatalogId`, `title`, `artistName`, `genre`, `releaseDate`, `trackCount`, `artworkUrl`, `userRating`, `userNotes`), making them ideal for rich CRUD interactions.
2. **Interactive Analytics**:
   * **Genre Breakdown**: Donut chart visualizing musical diversity.
   * **Release Year Timeline**: Line chart tracking release decades.
   * **User Rating Frequency**: Histogram (1–5 star rating distributions).
   * **Top Artists Share**: Horizontal bar chart ranking favorite creators.
3. **AI Taste Summaries**: Album collections provide sufficient metadata depth to build natural language taste reports and candidate recommendations.

---

## 🛠️ Technology Stack

### Backend
* **Language & Framework**: Java 21 / Spring Boot 3 (`3.2.3`)
* **Security**: Spring Security + JSON Web Tokens (JWT)
* **Database**: H2 Database (configured with PostgreSQL compatibility)
* **Caching**: Caffeine Cache (`@Cacheable` on iTunes search proxy)
* **Testing**: JUnit 5 + Mockito + Spring Security Test

### Frontend
* **Core**: React 18 + Vite
* **Styling**: Tailwind CSS + Custom Glassmorphism Theme
* **Icons**: Lucide React Icons
* **Data Visualization**: Recharts
* **HTTP Client**: Axios with JWT Request Interceptor

---

## 🚀 Getting Started

### Prerequisites
* **Java SDK**: JDK 21+
* **Node.js**: Node 18+ and npm 9+

---

### Running the Backend

```powershell
cd backend

# Set JAVA_HOME (if not already set in environment)
$env:JAVA_HOME="C:\Program Files\Java\jdk-21"

# Run Spring Boot server (Port 8080)
.\mvnw.cmd spring-boot:run
```
> The server will launch on `http://localhost:8080`.  
> Access the H2 Database console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:musicdb`).

---

### Running the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev
```
> Access the application at `http://localhost:5173`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new account and receive a JWT token.
* `POST /api/auth/login` — Authenticate existing credentials and receive a JWT token.

### Catalog Search (`/api/search`)
* `GET /api/search?query={term}&type=album&limit=25` — Proxy search against the iTunes API using Caffeine in-memory caching. Returns response payload with cache status metadata.

### Personal Library (`/api/library`) *(JWT Required)*
* `GET /api/library` — Retrieve user's saved albums.
* `GET /api/library/page?page=0&size=10&sortBy=createdAt&direction=DESC` — Paginated library retrieval.
* `POST /api/library` — Save an album with user rating (1–5 stars) and personal notes.
* `PUT /api/library/{id}` — Update rating or notes for a saved album.
* `DELETE /api/library/{id}` — Remove an album from personal library.

### Catalog Insights (`/api/insights`) *(JWT Required)*
* `GET /api/insights/insights` — Generates natural language taste profiles, genre distributions, peak era highlights, and candidate album recommendations.

---

## 🧪 Verification & Testing

### Automated Backend Tests
Run Spring Boot unit and integration tests:
```bash
cd backend
mvn test
```

### Production Build Validation
Validate frontend bundle compilation:
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Performance Features

1. **JWT Bearer Token Authentication**: Protected endpoints validate standard HTTP `Authorization: Bearer <token>` headers.
2. **Caffeine Proxy Caching**: Search queries are cached in-memory with a 10-minute expiration window to reduce external iTunes API calls.
3. **Frontend Search Debouncing**: 350ms debouncing prevents redundant API requests while typing.
4. **Centralized Error Handling**: Spring Boot `@RestControllerAdvice` returns structured JSON error objects.
