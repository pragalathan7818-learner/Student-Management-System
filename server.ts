import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  year: number;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "students.json");

const INITIAL_STUDENTS: Student[] = [
  {
    id: 101,
    name: "Aarav Sharma",
    email: "aarav.sharma@college.edu",
    department: "Computer Science",
    year: 3,
    phone: "+919876543210",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 102,
    name: "Diya Patel",
    email: "diya.patel@college.edu",
    department: "Information Technology",
    year: 2,
    phone: "+919812345678",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 103,
    name: "Rohan Iyer",
    email: "rohan.iyer@college.edu",
    department: "Electronics & Communication",
    year: 4,
    phone: "+919734567890",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 104,
    name: "Sneha Mukherjee",
    email: "sneha.m@college.edu",
    department: "Mechanical Engineering",
    year: 1,
    phone: "+919623456781",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 105,
    name: "Vikram Malhotra",
    email: "vikram.m@college.edu",
    department: "Civil Engineering",
    year: 3,
    phone: "+919534567892",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

function loadStudents(): Student[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_STUDENTS, null, 2), "utf-8");
      return INITIAL_STUDENTS;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading students store:", err);
    return INITIAL_STUDENTS;
  }
}

function saveStudents(students: Student[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing students store:", err);
  }
}

const VALID_DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Biotechnology",
];

function validateStudentInput(data: Partial<Student>, isUpdate = false, existingId?: number) {
  const errors: Record<string, string[]> = {};

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      errors.name = ["This field is required."];
    } else if (data.name.trim().length < 2) {
      errors.name = ["Ensure this field has at least 2 characters."];
    } else if (data.name.trim().length > 100) {
      errors.name = ["Ensure this field has no more than 100 characters."];
    }
  }

  // Email validation
  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
      errors.email = ["This field is required."];
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errors.email = ["Enter a valid email address."];
      } else {
        const students = loadStudents();
        const duplicate = students.find(
          (s) => s.email.toLowerCase() === data.email!.trim().toLowerCase() && s.id !== existingId
        );
        if (duplicate) {
          errors.email = ["student with this email already exists."];
        }
      }
    }
  }

  // Department validation
  if (!isUpdate || data.department !== undefined) {
    if (!data.department || typeof data.department !== "string" || !data.department.trim()) {
      errors.department = ["This field is required."];
    } else if (!VALID_DEPARTMENTS.includes(data.department.trim())) {
      errors.department = [
        `Select a valid department. Choices: ${VALID_DEPARTMENTS.join(", ")}`,
      ];
    }
  }

  // Year validation (1-4)
  if (!isUpdate || data.year !== undefined) {
    const numYear = Number(data.year);
    if (data.year === undefined || data.year === null || isNaN(numYear)) {
      errors.year = ["This field is required."];
    } else if (![1, 2, 3, 4].includes(numYear)) {
      errors.year = ["Academic year must be between 1 and 4."];
    }
  }

  // Phone validation
  if (!isUpdate || data.phone !== undefined) {
    if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
      errors.phone = ["This field is required."];
    } else {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      const cleaned = data.phone.trim().replace(/[\s-]/g, "");
      if (!phoneRegex.test(cleaned)) {
        errors.phone = [
          "Enter a valid phone number (10 to 15 digits, optional leading +).",
        ];
      }
    }
  }

  return errors;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // CORS headers for local/cross-origin compliance
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // REST API Routes matching Django REST Framework conventions exactly

  // GET /api/students/ - List students with optional search & filter
  app.get("/api/students/", (req, res) => {
    try {
      const students = loadStudents();
      const search = (req.query.search as string)?.trim().toLowerCase();
      const department = (req.query.department as string)?.trim();
      const year = req.query.year ? Number(req.query.year) : undefined;

      let filtered = [...students];

      if (search) {
        filtered = filtered.filter((s) => {
          const matchName = s.name.toLowerCase().includes(search);
          const matchEmail = s.email.toLowerCase().includes(search);
          const matchId = String(s.id).includes(search);
          const matchDept = s.department.toLowerCase().includes(search);
          const matchPhone = s.phone.includes(search);
          return matchName || matchEmail || matchId || matchDept || matchPhone;
        });
      }

      if (department && department !== "all") {
        filtered = filtered.filter(
          (s) => s.department.toLowerCase() === department.toLowerCase()
        );
      }

      if (year && !isNaN(year)) {
        filtered = filtered.filter((s) => s.year === year);
      }

      // Sort by latest created/updated
      filtered.sort((a, b) => b.id - a.id);

      return res.status(200).json(filtered);
    } catch (err) {
      console.error("GET /api/students error:", err);
      return res.status(500).json({ detail: "Internal server error occurred." });
    }
  });

  // GET /api/students/:id/ - Retrieve single student
  app.get("/api/students/:id/", (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ detail: "Invalid student ID parameter." });
      }

      const students = loadStudents();
      const student = students.find((s) => s.id === id);

      if (!student) {
        return res.status(404).json({ detail: "Not found." });
      }

      return res.status(200).json(student);
    } catch (err) {
      return res.status(500).json({ detail: "Internal server error occurred." });
    }
  });

  // POST /api/students/ - Create new student
  app.post("/api/students/", (req, res) => {
    try {
      const body = req.body;
      const errors = validateStudentInput(body, false);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }

      const students = loadStudents();
      // Generate next sequential institutional ID
      const maxId = students.reduce((acc, curr) => Math.max(acc, curr.id), 100);
      const newId = maxId + 1;

      const newStudent: Student = {
        id: newId,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        department: body.department.trim(),
        year: Number(body.year),
        phone: body.phone.trim().replace(/[\s-]/g, ""),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      students.push(newStudent);
      saveStudents(students);

      return res.status(201).json(newStudent);
    } catch (err) {
      console.error("POST /api/students error:", err);
      return res.status(500).json({ detail: "Failed to create student record." });
    }
  });

  // PUT /api/students/:id/ - Full update
  app.put("/api/students/:id/", (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ detail: "Invalid student ID parameter." });
      }

      const students = loadStudents();
      const index = students.findIndex((s) => s.id === id);

      if (index === -1) {
        return res.status(404).json({ detail: "Not found." });
      }

      const body = req.body;
      const errors = validateStudentInput(body, false, id);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }

      const updatedStudent: Student = {
        id,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        department: body.department.trim(),
        year: Number(body.year),
        phone: body.phone.trim().replace(/[\s-]/g, ""),
        created_at: students[index].created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      students[index] = updatedStudent;
      saveStudents(students);

      return res.status(200).json(updatedStudent);
    } catch (err) {
      console.error("PUT /api/students/:id error:", err);
      return res.status(500).json({ detail: "Failed to update student record." });
    }
  });

  // PATCH /api/students/:id/ - Partial update
  app.patch("/api/students/:id/", (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ detail: "Invalid student ID parameter." });
      }

      const students = loadStudents();
      const index = students.findIndex((s) => s.id === id);

      if (index === -1) {
        return res.status(404).json({ detail: "Not found." });
      }

      const body = req.body;
      const errors = validateStudentInput(body, true, id);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }

      const existing = students[index];
      const updatedStudent: Student = {
        id,
        name: body.name !== undefined ? body.name.trim() : existing.name,
        email: body.email !== undefined ? body.email.trim().toLowerCase() : existing.email,
        department: body.department !== undefined ? body.department.trim() : existing.department,
        year: body.year !== undefined ? Number(body.year) : existing.year,
        phone: body.phone !== undefined ? body.phone.trim().replace(/[\s-]/g, "") : existing.phone,
        created_at: existing.created_at,
        updated_at: new Date().toISOString(),
      };

      students[index] = updatedStudent;
      saveStudents(students);

      return res.status(200).json(updatedStudent);
    } catch (err) {
      console.error("PATCH /api/students/:id error:", err);
      return res.status(500).json({ detail: "Failed to patch student record." });
    }
  });

  // DELETE /api/students/:id/ - Delete record
  app.delete("/api/students/:id/", (req, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ detail: "Invalid student ID parameter." });
      }

      let students = loadStudents();
      const exists = students.some((s) => s.id === id);

      if (!exists) {
        return res.status(404).json({ detail: "Not found." });
      }

      students = students.filter((s) => s.id !== id);
      saveStudents(students);

      return res.status(204).send();
    } catch (err) {
      console.error("DELETE /api/students/:id error:", err);
      return res.status(500).json({ detail: "Failed to delete student record." });
    }
  });

  // Metadata/Health check endpoint
  app.get("/api/health/", (req, res) => {
    res.json({
      status: "healthy",
      service: "Student Management System API",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  // Reset demo database endpoint for user convenience
  app.post("/api/students/reset/", (req, res) => {
    saveStudents(INITIAL_STUDENTS);
    return res.status(200).json({
      message: "Database reset to initial sample student roster successfully.",
      count: INITIAL_STUDENTS.length,
    });
  });

  // Vite middleware in development; static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Management System running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
