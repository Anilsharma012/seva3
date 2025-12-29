import type { Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { authMiddleware, adminOnly, generateToken, AuthRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<void> {
  
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await storage.getAdminByEmail(email);
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = generateToken({ id: admin.id.toString(), email: admin.email, role: "admin", name: admin.name });
      res.json({ token, user: { id: admin.id, email: admin.email, role: "admin", name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/admin/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const existing = await storage.getAdminByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ email, password: hashedPassword, name });
      
      const token = generateToken({ id: admin.id.toString(), email: admin.email, role: "admin", name: admin.name });
      res.status(201).json({ token, user: { id: admin.id, email: admin.email, role: "admin", name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/student/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const student = await storage.getStudentByEmail(email);
      
      if (!student) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      if (!student.isActive) {
        return res.status(403).json({ error: "Account is deactivated" });
      }
      
      const isValid = await bcrypt.compare(password, student.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = generateToken({ id: student.id.toString(), email: student.email, role: "student", name: student.fullName });
      res.json({ token, user: { id: student.id, email: student.email, role: "student", name: student.fullName } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/student/register", async (req, res) => {
    try {
      const { email, password, fullName, phone, fatherName, motherName, address, city, pincode, dateOfBirth, gender, class: studentClass, feeLevel } = req.body;
      
      const existing = await storage.getStudentByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const year = new Date().getFullYear();
      const count = await storage.countStudentsWithRegPrefix(`MWSS${year}`);
      const registrationNumber = `MWSS${year}${String(count + 1).padStart(4, "0")}`;
      
      const feeAmounts: Record<string, number> = { village: 99, block: 199, district: 299, haryana: 399 };
      const feeAmount = feeAmounts[feeLevel] || 99;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = await storage.createStudent({
        email,
        password: hashedPassword,
        fullName,
        phone,
        fatherName,
        motherName,
        address,
        city,
        pincode,
        dateOfBirth,
        gender,
        class: studentClass,
        registrationNumber,
        feeLevel: feeLevel || "village",
        feeAmount,
      });
      
      const token = generateToken({ id: student.id.toString(), email: student.email, role: "student", name: student.fullName });
      res.status(201).json({ token, user: { id: student.id, email: student.email, role: "student", name: student.fullName }, registrationNumber });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role === "admin") {
        const admin = await storage.getAdminById(parseInt(req.user.id));
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        const { password, ...adminData } = admin;
        res.json({ ...adminData, role: "admin" });
      } else {
        const student = await storage.getStudentById(parseInt(req.user?.id || "0"));
        if (!student) return res.status(404).json({ error: "Student not found" });
        const { password, ...studentData } = student;
        res.json({ ...studentData, role: "student" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/students", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students.map(({ password, ...s }) => s));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const student = await storage.getStudentById(parseInt(req.params.id));
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (req.user?.role !== "admin" && req.user?.id !== student.id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { password, ...studentData } = student;
      res.json(studentData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.patch("/api/students/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const student = await storage.updateStudent(parseInt(req.params.id), req.body);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      const { password, ...studentData } = student;
      res.json(studentData);
    } catch (error) {
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  app.post("/api/students", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { email, password, fullName, phone, fatherName, motherName, address, city, pincode, dateOfBirth, gender, class: studentClass, feeLevel } = req.body;
      
      const year = new Date().getFullYear();
      const count = await storage.countStudentsWithRegPrefix(`MWSS${year}`);
      const registrationNumber = `MWSS${year}${String(count + 1).padStart(4, "0")}`;
      
      const feeAmounts: Record<string, number> = { village: 99, block: 199, district: 299, haryana: 399 };
      const feeAmount = feeAmounts[feeLevel] || 99;
      
      const hashedPassword = await bcrypt.hash(password || "password123", 10);
      const student = await storage.createStudent({
        email,
        password: hashedPassword,
        fullName,
        phone,
        fatherName,
        motherName,
        address,
        city,
        pincode,
        dateOfBirth,
        gender,
        class: studentClass,
        registrationNumber,
        feeLevel: feeLevel || "village",
        feeAmount,
      });
      
      const { password: _, ...studentData } = student;
      res.status(201).json(studentData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  app.get("/api/dashboard/stats", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const students = await storage.getAllStudents();
      const todayRegistrations = await storage.countStudentsToday();
      const feesPaid = await storage.countStudentsFeePaid();
      const activeStudents = await storage.countActiveStudents();
      
      res.json({ totalStudents: students.length, todayRegistrations, feesPaid, activeStudents });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/results", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role === "admin") {
        const results = await storage.getAllResults();
        res.json(results);
      } else {
        const results = await storage.getResultsByStudentId(parseInt(req.user?.id || "0"), true);
        res.json(results);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.get("/api/results/student/:studentId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const publishedOnly = req.user?.role !== "admin";
      const results = await storage.getResultsByStudentId(parseInt(req.params.studentId), publishedOnly);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.post("/api/results", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const result = await storage.createResult(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create result" });
    }
  });

  app.patch("/api/results/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const result = await storage.updateResult(parseInt(req.params.id), req.body);
      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to update result" });
    }
  });

  app.get("/api/admit-cards", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role === "admin") {
        const admitCards = await storage.getAllAdmitCards();
        res.json(admitCards);
      } else {
        const admitCards = await storage.getAdmitCardsByStudentId(parseInt(req.user?.id || "0"));
        res.json(admitCards);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admit cards" });
    }
  });

  app.get("/api/admit-cards/student/:studentId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const admitCards = await storage.getAdmitCardsByStudentId(parseInt(req.params.studentId));
      res.json(admitCards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admit cards" });
    }
  });

  app.post("/api/admit-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const admitCard = await storage.createAdmitCard(req.body);
      res.status(201).json(admitCard);
    } catch (error) {
      res.status(500).json({ error: "Failed to create admit card" });
    }
  });

  app.delete("/api/admit-cards/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await storage.deleteAdmitCard(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete admit card" });
    }
  });

  app.get("/api/memberships", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const memberships = await storage.getAllMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memberships" });
    }
  });

  app.post("/api/memberships", async (req, res) => {
    try {
      const count = await storage.countMemberships();
      const membershipNumber = `MWSS-M${String(count + 1).padStart(4, "0")}`;
      const membership = await storage.createMembership({ ...req.body, membershipNumber });
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership" });
    }
  });

  app.patch("/api/memberships/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const membership = await storage.updateMembership(parseInt(req.params.id), req.body);
      if (!membership) {
        return res.status(404).json({ error: "Membership not found" });
      }
      res.json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to update membership" });
    }
  });

  app.get("/api/my-profile", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role === "student") {
        const student = await storage.getStudentById(parseInt(req.user.id));
        if (!student) return res.status(404).json({ error: "Student not found" });
        
        const results = await storage.getResultsByStudentId(student.id, true);
        const admitCards = await storage.getAdmitCardsByStudentId(student.id);
        
        const { password, ...studentData } = student;
        res.json({ student: studentData, results, admitCards });
      } else {
        res.status(403).json({ error: "Students only" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/admin/menu", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItems = await storage.getActiveMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/admin/menu/all", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.post("/api/admin/menu", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItem = await storage.createMenuItem(req.body);
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/api/admin/menu/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItem = await storage.updateMenuItem(parseInt(req.params.id), req.body);
      if (!menuItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/admin/menu/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await storage.deleteMenuItem(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  app.get("/api/admin/settings", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const settings = await storage.getAllAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/admin/settings/:key", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const setting = await storage.getAdminSettingByKey(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.patch("/api/admin/settings/:key", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const setting = await storage.updateAdminSettingByKey(req.params.key, req.body);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.post("/api/admin/settings", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const setting = await storage.createAdminSetting(req.body);
      res.status(201).json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await storage.getAllAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/public/admit-card/:rollNumber", async (req, res) => {
    try {
      const { rollNumber } = req.params;
      const student = await storage.getStudentByRollNumber(rollNumber);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found with this roll number" });
      }
      
      const admitCards = await storage.getAdmitCardsByStudentId(student.id);
      const admitCard = admitCards[0];
      
      if (!admitCard) {
        return res.status(404).json({ message: "Admit card not available for this student" });
      }
      
      let admitData = null;
      try {
        admitData = JSON.parse(admitCard.fileUrl);
      } catch (e) {
        admitData = null;
      }
      
      res.json({
        student: {
          fullName: student.fullName,
          fatherName: student.fatherName,
          rollNumber: student.rollNumber,
          registrationNumber: student.registrationNumber,
          class: student.class,
        },
        examName: admitCard.examName,
        admitData,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admit card" });
    }
  });

  app.get("/api/admin/payment-config", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const configs = await storage.getAllPaymentConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment configs" });
    }
  });

  app.get("/api/public/payment-config/:type", async (req, res) => {
    try {
      const configs = await storage.getPaymentConfigsByType(req.params.type);
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment config" });
    }
  });

  app.post("/api/admin/payment-config", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const config = await storage.createPaymentConfig(req.body);
      res.status(201).json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment config" });
    }
  });

  app.patch("/api/admin/payment-config/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const config = await storage.updatePaymentConfig(parseInt(req.params.id), req.body);
      if (!config) return res.status(404).json({ error: "Payment config not found" });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment config" });
    }
  });

  app.delete("/api/admin/payment-config/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await storage.deletePaymentConfig(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment config" });
    }
  });

  app.get("/api/admin/content-sections", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const sections = await storage.getAllContentSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content sections" });
    }
  });

  app.get("/api/public/content/:sectionKey", async (req, res) => {
    try {
      const sections = await storage.getContentSectionsByKey(req.params.sectionKey);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/admin/content-sections", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const section = await storage.createContentSection(req.body);
      res.status(201).json(section);
    } catch (error) {
      res.status(500).json({ error: "Failed to create content section" });
    }
  });

  app.patch("/api/admin/content-sections/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const section = await storage.updateContentSection(parseInt(req.params.id), req.body);
      if (!section) return res.status(404).json({ error: "Content section not found" });
      res.json(section);
    } catch (error) {
      res.status(500).json({ error: "Failed to update content section" });
    }
  });

  app.delete("/api/admin/content-sections/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await storage.deleteContentSection(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content section" });
    }
  });

  app.get("/api/admin/volunteers", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const volunteers = await storage.getAllVolunteerApplications();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  app.post("/api/public/volunteer-apply", async (req, res) => {
    try {
      await storage.createVolunteerApplication(req.body);
      res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  app.patch("/api/admin/volunteers/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const volunteer = await storage.updateVolunteerApplication(parseInt(req.params.id), req.body);
      if (!volunteer) return res.status(404).json({ error: "Volunteer not found" });
      res.json(volunteer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update volunteer" });
    }
  });

  app.get("/api/admin/fee-structures", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structures = await storage.getAllFeeStructures();
      res.json(structures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee structures" });
    }
  });

  app.get("/api/public/fee-structures", async (req, res) => {
    try {
      const structures = await storage.getAllFeeStructures();
      res.json(structures.filter(s => s.isActive));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee structures" });
    }
  });

  app.post("/api/admin/fee-structures", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structure = await storage.createFeeStructure(req.body);
      res.status(201).json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to create fee structure" });
    }
  });

  app.patch("/api/admin/fee-structures/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structure = await storage.updateFeeStructure(parseInt(req.params.id), req.body);
      if (!structure) return res.status(404).json({ error: "Fee structure not found" });
      res.json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fee structure" });
    }
  });

  app.get("/api/admin/membership-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const cards = await storage.getAllMembershipCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership cards" });
    }
  });

  app.post("/api/admin/membership-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const year = new Date().getFullYear();
      const cards = await storage.getAllMembershipCards();
      const count = cards.filter(c => c.cardNumber.startsWith(`MC${year}`)).length;
      const cardNumber = `MC${year}${String(count + 1).padStart(4, "0")}`;
      
      const card = await storage.createMembershipCard({ ...req.body, cardNumber });
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership card" });
    }
  });

  app.patch("/api/admin/membership-cards/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const updates: any = { ...req.body };
      if (req.body.paymentStatus === "approved" && req.user?.id) {
        updates.approvedBy = parseInt(req.user.id);
        updates.approvedAt = new Date();
        updates.isGenerated = true;
      }
      const card = await storage.updateMembershipCard(parseInt(req.params.id), updates);
      if (!card) return res.status(404).json({ error: "Membership card not found" });
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to update membership card" });
    }
  });

  app.get("/api/my-membership-card", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const membership = await storage.getMembershipByUserId(parseInt(req.user?.id || "0"));
      if (!membership) return res.status(404).json({ error: "Membership not found" });
      
      const card = await storage.getMembershipCardByMembershipId(membership.id);
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership card" });
    }
  });

  app.get("/api/admin/contact-inquiries", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/public/contact", async (req, res) => {
    try {
      await storage.createContactInquiry(req.body);
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.patch("/api/admin/contact-inquiries/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const inquiry = await storage.updateContactInquiry(parseInt(req.params.id), req.body);
      if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  app.get("/api/admin/pages", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/public/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page || !page.isPublished) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/admin/pages", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const page = await storage.createPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.patch("/api/admin/pages/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const page = await storage.updatePage(parseInt(req.params.id), req.body);
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await storage.deletePage(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  app.post("/api/admin/students/:id/payment", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { amount, paymentDate } = req.body;
      const student = await storage.updateStudent(parseInt(req.params.id), { 
        feePaid: true, 
        feeAmount: amount,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      });
      if (!student) return res.status(404).json({ error: "Student not found" });
      const { password, ...studentData } = student;
      res.json(studentData);
    } catch (error) {
      res.status(500).json({ error: "Failed to record payment" });
    }
  });

  app.get("/api/admin/fee-records", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const students = await storage.getAllStudents();
      const feeRecords = students
        .filter(s => s.feePaid)
        .map(({ password, ...s }) => ({
          fullName: s.fullName,
          registrationNumber: s.registrationNumber,
          rollNumber: s.rollNumber,
          class: s.class,
          feeLevel: s.feeLevel,
          feeAmount: s.feeAmount,
          paymentDate: s.paymentDate
        }));
      res.json(feeRecords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee records" });
    }
  });
}
