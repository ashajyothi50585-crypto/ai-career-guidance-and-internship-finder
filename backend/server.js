
require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const { supabase } = require("./supabase");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI Career Guidance and Internship Finder",
    databaseConfigured: Boolean(supabase)
  });
});

// Get internships
app.get("/api/internships", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Database not configured. Configure Supabase in backend/.env."
    });
  }

  try {
    let query = supabase
      .from("internships")
      .select(
        "id,title,company,domain,description,eligibility,skills,pay_type,work_mode,duration,application_url,created_at"
      )
      .order("created_at", { ascending: false });

    if (req.query.domain) {
      query = query.eq("domain", String(req.query.domain).slice(0, 80));
    }

    if (req.query.pay_type) {
      query = query.eq("pay_type", String(req.query.pay_type).slice(0, 20));
    }

    if (req.query.search) {
      query = query.ilike(
        "title",
        `%${String(req.query.search).slice(0, 80)}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    console.error("GET /api/internships:", error.message);
    res.status(500).json({ error: "Could not load internships." });
  }
});

// Create an internship
app.post("/api/internships", async (req, res) => {
  if (!supabase) {
    return res.status(503).json({
      error: "Database not configured."
    });
  }

  const {
    title,
    company,
    domain,
    description,
    eligibility,
    skills,
    pay_type,
    work_mode,
    duration,
    application_url
  } = req.body || {};

  // Validate required fields
  if (
    ![title, company, domain, description].every(
      value => typeof value === "string" && value.trim()
    )
  ) {
    return res.status(400).json({
      error: "Title, company, domain, and description are required."
    });
  }

  // Validate field lengths
  if (
    title.length > 160 ||
    company.length > 120 ||
    domain.length > 80 ||
    description.length > 2000
  ) {
    return res.status(400).json({
      error: "One or more fields exceed the allowed length."
    });
  }

  // Validate application URL
  if (
    application_url &&
    (typeof application_url !== "string" ||
      !/^https?:\/\/\S+$/i.test(application_url))
  ) {
    return res.status(400).json({
      error: "Application URL must start with http:// or https://."
    });
  }

  const record = {
    title: title.trim(),
    company: company.trim(),
    domain: domain.trim(),
    description: description.trim(),
    eligibility:
      typeof eligibility === "string" ? eligibility.slice(0, 500) : "",
    skills: Array.isArray(skills)
      ? skills
          .filter(skill => typeof skill === "string")
          .slice(0, 20)
      : [],
    pay_type: ["Paid", "Unpaid", "Not specified"].includes(pay_type)
      ? pay_type
      : "Not specified",
    work_mode: ["Remote", "Hybrid", "On-site"].includes(work_mode)
      ? work_mode
      : "Remote",
    duration: typeof duration === "string" ? duration.slice(0, 80) : "",
    application_url: application_url || null
  };

  try {
    const { data, error } = await supabase
      .from("internships")
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ data });
  } catch (error) {
    console.error("POST /api/internships:", error.message);
    res.status(500).json({ error: "Could not create internship." });
  }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found." });
});

// Serve the frontend for other GET requests
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(
    path.join(__dirname, "..", "frontend", "index.html")
  );
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unexpected server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Unexpected server error."
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CareerPath running at http://localhost:${PORT}`);
  });
}

module.exports = app;

