const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// File-based Database Setup
const dbPath = path.resolve(__dirname, "data.json");

class DataStore {
    constructor() {
        this.data = { companies: [], shareholders: [] };
        this.nextCompanyId = 1;
        this.nextShareholderId = 1;
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(dbPath)) {
                const content = fs.readFileSync(dbPath, "utf-8");
                const parsed = JSON.parse(content);
                this.data = parsed.data || { companies: [], shareholders: [] };
                this.nextCompanyId = parsed.nextCompanyId || 1;
                this.nextShareholderId = parsed.nextShareholderId || 1;
            }
        } catch (err) {
            console.log("Creating new data store");
        }
    }

    save() {
        try {
            fs.writeFileSync(
                dbPath,
                JSON.stringify({ data: this.data, nextCompanyId: this.nextCompanyId, nextShareholderId: this.nextShareholderId }, null, 2)
            );
        } catch (err) {
            console.error("Error saving data:", err);
        }
    }

    addCompany(name, numShareholders, totalCapital) {
        const id = this.nextCompanyId++;
        const company = {
            id,
            name,
            numShareholders: parseInt(numShareholders),
            totalCapital: parseFloat(totalCapital),
            status: "draft",
            createdAt: new Date().toISOString(),
        };
        this.data.companies.push(company);
        this.save();
        return id;
    }

    getCompany(id) {
        return this.data.companies.find((c) => c.id === parseInt(id));
    }

    getAllCompanies() {
        return this.data.companies;
    }

    updateCompanyStatus(id, status) {
        const company = this.getCompany(id);
        if (company) {
            company.status = status;
            this.save();
        }
    }

    deleteCompany(id) {
        const idx = this.data.companies.findIndex((c) => c.id === parseInt(id));
        if (idx !== -1) {
            const company = this.data.companies[idx];
            this.data.companies.splice(idx, 1);
            this.data.shareholders = this.data.shareholders.filter(
                (s) => s.companyId !== company.id
            );
            this.save();
            return true;
        }
        return false;
    }

    addShareholder(companyId, firstName, lastName, nationality) {
        const id = this.nextShareholderId++;
        const shareholder = {
            id,
            companyId: parseInt(companyId),
            firstName,
            lastName,
            nationality,
            createdAt: new Date().toISOString(),
        };
        this.data.shareholders.push(shareholder);
        this.save();
        return id;
    }

    getShareholders(companyId) {
        return this.data.shareholders.filter((s) => s.companyId === parseInt(companyId));
    }

    deleteShareholdersByCompanyId(companyId) {
        const length = this.data.shareholders.length;
        this.data.shareholders = this.data.shareholders.filter(
            (s) => s.companyId !== parseInt(companyId)
        );
        this.save();
        return this.data.shareholders.length < length;
    }
}

const db = new DataStore();
console.log("Database initialized.");

// --- API Endpoints ---

// Create a new company (draft)
app.post("/api/companies", (req, res) => {
    const { name, numShareholders, totalCapital } = req.body;

    if (!name || !numShareholders || !totalCapital) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const id = db.addCompany(name, numShareholders, totalCapital);
        res.json({ id: id.toString() });
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update company shareholders and mark as complete
app.put("/api/companies/:id/shareholders", (req, res) => {
    const companyId = req.params.id;
    const { shareholders } = req.body;

    if (!shareholders || !Array.isArray(shareholders)) {
        return res.status(400).json({ error: "Invalid shareholders data" });
    }

    try {
        db.deleteShareholdersByCompanyId(companyId);
        
        for (const sh of shareholders) {
            db.addShareholder(companyId, sh.firstName, sh.lastName, sh.nationality);
        }
        
        db.updateCompanyStatus(companyId, "complete");
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating shareholders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all companies with their shareholders
app.get("/api/companies", (req, res) => {
    try {
        const companies = db.getAllCompanies();
        const companiesWithShareholders = companies.map((c) => {
            const shareholders = db.getShareholders(c.id);
            return {
                company: {
                    id: c.id.toString(),
                    name: c.name,
                    numShareholders: c.numShareholders.toString(),
                    totalCapital: c.totalCapital,
                    status: c.status,
                },
                shareholders: shareholders.map((s) => ({
                    id: s.id.toString(),
                    companyId: s.companyId.toString(),
                    firstName: s.firstName,
                    lastName: s.lastName,
                    nationality: s.nationality,
                })),
            };
        });
        res.json(companiesWithShareholders);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a single company by ID
app.get("/api/companies/:id", (req, res) => {
    const companyId = req.params.id;

    try {
        const company = db.getCompany(companyId);

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        const shareholders = db.getShareholders(companyId);

        res.json({
            company: {
                id: company.id.toString(),
                name: company.name,
                numShareholders: company.numShareholders.toString(),
                totalCapital: company.totalCapital,
                status: company.status,
            },
            shareholders: shareholders.map((s) => ({
                id: s.id.toString(),
                companyId: s.companyId.toString(),
                firstName: s.firstName,
                lastName: s.lastName,
                nationality: s.nationality,
            })),
        });
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a company
app.delete("/api/companies/:id", (req, res) => {
    const companyId = req.params.id;

    try {
        const deleted = db.deleteCompany(companyId);

        if (!deleted) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
