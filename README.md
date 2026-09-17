# Student Management System

A production-grade, academic full-stack CRUD web application developed strictly in accordance with Standard Operating Procedure (SOP) requirements.

## Architecture

```
User
  │
  ▼
React Frontend (Vite + Tailwind CSS + Lucide Icons)
  │
  ▼
RESTful API Layer (JSON, CORS, Status Codes)
  │
  ▼
Django REST Framework Backend (ViewSets, Serializers, Validation)
  │
  ▼
Django ORM (Object Relational Mapping & Model Constraints)
  │
  ▼
Relational Database (SQLite / PostgreSQL)
```

## Features Demonstrated

1. **Create**: Register new student with real-time validation and HTTP 201 response.
2. **Read**: Display all enrolled students in a responsive roster with sortable columns and record count.
3. **Read One**: Inspect single student details via dedicated profile modal (GET /api/students/{id}/).
4. **Update**: Modify personal and academic information (PUT/PATCH /api/students/{id}/).
5. **Delete**: Remove student records with pre-flight confirmation dialog (DELETE /api/students/{id}/).
6. **Search & Filter**: Real-time filtering across Name, ID, Department, Year, and Contact Phone.
7. **Input Validation**: Client-side feedback paired with strict server-side validation (unique email, phone regex, academic year range 1–4).
8. **Error Handling**: Graceful error banners for network timeouts, 400 Bad Request field mapping, and 404 Not Found states.
9. **REST API**: Standardized JSON contracts and standard HTTP response status codes (200, 201, 204, 400, 404, 500).
10. **Database Integration**: Managed schema constraints via Django ORM and automated migrations.
11. **Frontend-Backend Integration**: Decoupled asynchronous `fetch` integration with dynamic state updates.
12. **API Testing**: Automated and manual testing suite documented in `documentation/TESTING_GUIDE.md`.
13. **Documentation**: Comprehensive architecture, API specs, and deployment guides in `documentation/`.
14. **Deployment**: Ready for static deployment on Vercel (`vercel.json`) and containerized backend deployment.

## Repository Structure

```
student-management-system/
│
├── backend/                             # Django REST Framework Backend
│   ├── manage.py                        # Django management CLI
│   ├── requirements.txt                 # Backend Python dependencies
│   ├── student_management/              # Django project package
│   │   ├── settings.py                  # Database, CORS & DRF settings
│   │   ├── urls.py                      # Master URL routing
│   │   ├── wsgi.py                      # WSGI entry point
│   │   └── asgi.py                      # ASGI entry point
│   └── students/                        # Student application
│       ├── models.py                    # Student entity model
│       ├── serializers.py               # DRF ModelSerializer with validation
│       ├── views.py                     # StudentViewSet (CRUD + search logic)
│       ├── urls.py                      # App endpoint routing
│       ├── admin.py                     # Django Admin configuration
│       └── migrations/                  # Database migration files
│
├── documentation/                       # Academic Documentation
│   ├── ARCHITECTURE.md                  # System design, data flow & Mermaid diagrams
│   ├── API_SPECIFICATION.md             # REST endpoints & error codes
│   ├── DEPLOYMENT_GUIDE.md              # Local setup & Vercel deployment instructions
│   └── TESTING_GUIDE.md                 # cURL & Postman test commands
│
├── src/                                 # React Frontend Source Code
│   ├── components/                      # Modular UI components
│   │   ├── Header.tsx                   # Top navigation & system actions
│   │   ├── DashboardStats.tsx           # Academic metric cards
│   │   ├── SearchBar.tsx                # Dynamic search & filter controls
│   │   ├── StudentTable.tsx             # Student roster table with actions
│   │   ├── StudentModal.tsx             # Add / Edit modal with validation
│   │   ├── StudentDetailModal.tsx       # Individual record profile view
│   │   ├── DeleteConfirmModal.tsx       # Deletion confirmation dialog
│   │   ├── ToastNotification.tsx        # Toast feedback system
│   │   └── ArchitectureModal.tsx        # In-app architecture viewer
│   ├── services/
│   │   └── api.ts                       # REST API client & error handler
│   ├── types.ts                         # TypeScript interfaces & types
│   ├── App.tsx                          # Root application component
│   ├── main.tsx                         # React entry point
│   └── index.css                        # Tailwind CSS imports
│
├── server.ts                            # Full-stack Node/Express REST API server
├── vercel.json                          # Vercel deployment configuration
└── README.md                            # Project overview
```
