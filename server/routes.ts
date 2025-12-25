import type { Express } from "express";
import bcrypt from "bcryptjs";
import { 
  Admin, Student, Result, AdmitCard, Membership, MenuItem, AdminSetting,
  PaymentConfig, ContentSection, VolunteerApplication, FeeStructure, MembershipCard, Page, ContactInquiry
} from "./models";
import { authMiddleware, adminOnly, generateToken, AuthRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<void> {
  
  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = generateToken({ id: admin._id.toString(), email: admin.email, role: "admin", name: admin.name });
      res.json({ token, user: { id: admin._id, email: admin.email, role: "admin", name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/admin/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const existing = await Admin.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword, name });
      await admin.save();
      
      const token = generateToken({ id: admin._id.toString(), email: admin.email, role: "admin", name: admin.name });
      res.status(201).json({ token, user: { id: admin._id, email: admin.email, role: "admin", name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/student/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const student = await Student.findOne({ email });
      
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
      
      const token = generateToken({ id: student._id.toString(), email: student.email, role: "student", name: student.fullName });
      res.json({ token, user: { id: student._id, email: student.email, role: "student", name: student.fullName } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/student/register", async (req, res) => {
    try {
      const { email, password, fullName, phone, fatherName, motherName, address, city, pincode, dateOfBirth, gender, class: studentClass, feeLevel } = req.body;
      
      const existing = await Student.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
      
      const year = new Date().getFullYear();
      const count = await Student.countDocuments({ registrationNumber: { $regex: `^MWSS${year}` } });
      const registrationNumber = `MWSS${year}${String(count + 1).padStart(4, "0")}`;
      
      const feeAmounts: Record<string, number> = { village: 99, block: 199, district: 299, haryana: 399 };
      const feeAmount = feeAmounts[feeLevel] || 99;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const student = new Student({
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
      await student.save();
      
      const token = generateToken({ id: student._id.toString(), email: student.email, role: "student", name: student.fullName });
      res.status(201).json({ token, user: { id: student._id, email: student.email, role: "student", name: student.fullName }, registrationNumber });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role === "admin") {
        const admin = await Admin.findById(req.user.id).select("-password");
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        res.json({ ...admin.toObject(), role: "admin" });
      } else {
        const student = await Student.findById(req.user?.id).select("-password");
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json({ ...student.toObject(), role: "student" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/students", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const students = await Student.find().select("-password").sort({ createdAt: -1 });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const student = await Student.findById(req.params.id).select("-password");
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      if (req.user?.role !== "admin" && req.user?.id !== student._id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.patch("/api/students/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true }).select("-password");
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  app.post("/api/students", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { email, password, fullName, phone, fatherName, motherName, address, city, pincode, dateOfBirth, gender, class: studentClass, feeLevel } = req.body;
      
      const year = new Date().getFullYear();
      const count = await Student.countDocuments({ registrationNumber: { $regex: `^MWSS${year}` } });
      const registrationNumber = `MWSS${year}${String(count + 1).padStart(4, "0")}`;
      
      const feeAmounts: Record<string, number> = { village: 99, block: 199, district: 299, haryana: 399 };
      const feeAmount = feeAmounts[feeLevel] || 99;
      
      const hashedPassword = await bcrypt.hash(password || "password123", 10);
      const student = new Student({
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
      await student.save();
      
      res.status(201).json({ ...student.toObject(), password: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to create student" });
    }
  });

  app.get("/api/dashboard/stats", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const totalStudents = await Student.countDocuments();
      const todayRegistrations = await Student.countDocuments({ createdAt: { $gte: today } });
      const feesPaid = await Student.countDocuments({ feePaid: true });
      const activeStudents = await Student.countDocuments({ isActive: true });
      
      res.json({ totalStudents, todayRegistrations, feesPaid, activeStudents });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/results", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const query = req.user?.role === "admin" ? {} : { studentId: req.user?.id, isPublished: true };
      const results = await Result.find(query).populate("studentId", "fullName registrationNumber rollNumber").sort({ createdAt: -1 });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.get("/api/results/student/:studentId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const query = req.user?.role === "admin" 
        ? { studentId: req.params.studentId }
        : { studentId: req.params.studentId, isPublished: true };
      const results = await Result.find(query).sort({ createdAt: -1 });
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.post("/api/results", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const result = new Result(req.body);
      await result.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to create result" });
    }
  });

  app.patch("/api/results/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      const query = req.user?.role === "admin" ? {} : { studentId: req.user?.id };
      const admitCards = await AdmitCard.find(query).populate("studentId", "fullName registrationNumber rollNumber").sort({ uploadedAt: -1 });
      res.json(admitCards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admit cards" });
    }
  });

  app.get("/api/admit-cards/student/:studentId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const admitCards = await AdmitCard.find({ studentId: req.params.studentId }).sort({ uploadedAt: -1 });
      res.json(admitCards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admit cards" });
    }
  });

  app.post("/api/admit-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const admitCard = new AdmitCard(req.body);
      await admitCard.save();
      res.status(201).json(admitCard);
    } catch (error) {
      res.status(500).json({ error: "Failed to create admit card" });
    }
  });

  app.delete("/api/admit-cards/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await AdmitCard.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete admit card" });
    }
  });

  app.get("/api/memberships", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const memberships = await Membership.find().sort({ createdAt: -1 });
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memberships" });
    }
  });

  app.post("/api/memberships", async (req, res) => {
    try {
      const count = await Membership.countDocuments();
      const membershipNumber = `MWSS-M${String(count + 1).padStart(4, "0")}`;
      const membership = new Membership({ ...req.body, membershipNumber });
      await membership.save();
      res.status(201).json(membership);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership" });
    }
  });

  app.patch("/api/memberships/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const student = await Student.findById(req.user.id).select("-password");
        if (!student) return res.status(404).json({ error: "Student not found" });
        
        const results = await Result.find({ studentId: student._id, isPublished: true });
        const admitCards = await AdmitCard.find({ studentId: student._id });
        
        res.json({ student, results, admitCards });
      } else {
        res.status(403).json({ error: "Students only" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/admin/menu", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItems = await MenuItem.find({ isActive: true }).sort({ order: 1 });
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/admin/menu/all", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItems = await MenuItem.find().sort({ order: 1 });
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.post("/api/admin/menu", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItem = new MenuItem(req.body);
      await menuItem.save();
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/api/admin/menu/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const menuItem = await MenuItem.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
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
      await MenuItem.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  app.get("/api/admin/settings", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const settings = await AdminSetting.find().sort({ category: 1, key: 1 });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/admin/settings/:key", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const setting = await AdminSetting.findOne({ key: req.params.key });
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
      const setting = await AdminSetting.findOneAndUpdate(
        { key: req.params.key },
        { ...req.body, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  app.post("/api/admin/settings", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const setting = new AdminSetting(req.body);
      await setting.save();
      res.status(201).json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to create setting" });
    }
  });

  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await AdminSetting.find();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/public/admit-card/:rollNumber", async (req, res) => {
    try {
      const { rollNumber } = req.params;
      const student = await Student.findOne({ rollNumber });
      
      if (!student) {
        return res.status(404).json({ message: "Student not found with this roll number" });
      }
      
      const admitCard = await AdmitCard.findOne({ studentId: student._id }).sort({ createdAt: -1 });
      
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

  // Payment Config Routes
  app.get("/api/admin/payment-config", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const configs = await PaymentConfig.find().sort({ type: 1, order: 1 });
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment configs" });
    }
  });

  app.get("/api/public/payment-config/:type", async (req, res) => {
    try {
      const configs = await PaymentConfig.find({ type: req.params.type, isActive: true }).sort({ order: 1 });
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment config" });
    }
  });

  app.post("/api/admin/payment-config", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const config = new PaymentConfig(req.body);
      await config.save();
      res.status(201).json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment config" });
    }
  });

  app.patch("/api/admin/payment-config/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const config = await PaymentConfig.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!config) return res.status(404).json({ error: "Payment config not found" });
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment config" });
    }
  });

  app.delete("/api/admin/payment-config/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await PaymentConfig.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment config" });
    }
  });

  // Content Section Routes
  app.get("/api/admin/content-sections", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const sections = await ContentSection.find().sort({ sectionKey: 1, order: 1 });
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content sections" });
    }
  });

  app.get("/api/public/content/:sectionKey", async (req, res) => {
    try {
      const sections = await ContentSection.find({ sectionKey: req.params.sectionKey, isActive: true }).sort({ order: 1 });
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/admin/content-sections", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const section = new ContentSection(req.body);
      await section.save();
      res.status(201).json(section);
    } catch (error) {
      res.status(500).json({ error: "Failed to create content section" });
    }
  });

  app.patch("/api/admin/content-sections/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const section = await ContentSection.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!section) return res.status(404).json({ error: "Content section not found" });
      res.json(section);
    } catch (error) {
      res.status(500).json({ error: "Failed to update content section" });
    }
  });

  app.delete("/api/admin/content-sections/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await ContentSection.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content section" });
    }
  });

  // Volunteer Application Routes
  app.get("/api/admin/volunteers", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const volunteers = await VolunteerApplication.find().sort({ createdAt: -1 });
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  app.post("/api/public/volunteer-apply", async (req, res) => {
    try {
      const application = new VolunteerApplication(req.body);
      await application.save();
      res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  app.patch("/api/admin/volunteers/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const volunteer = await VolunteerApplication.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!volunteer) return res.status(404).json({ error: "Volunteer not found" });
      res.json(volunteer);
    } catch (error) {
      res.status(500).json({ error: "Failed to update volunteer" });
    }
  });

  app.delete("/api/admin/volunteers/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await VolunteerApplication.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete volunteer" });
    }
  });

  // Fee Structure Routes
  app.get("/api/admin/fee-structures", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structures = await FeeStructure.find().sort({ level: 1 });
      res.json(structures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee structures" });
    }
  });

  app.get("/api/public/fee-structures", async (req, res) => {
    try {
      const structures = await FeeStructure.find({ isActive: true }).sort({ amount: 1 });
      res.json(structures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee structures" });
    }
  });

  app.post("/api/admin/fee-structures", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structure = new FeeStructure(req.body);
      await structure.save();
      res.status(201).json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to create fee structure" });
    }
  });

  app.patch("/api/admin/fee-structures/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const structure = await FeeStructure.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!structure) return res.status(404).json({ error: "Fee structure not found" });
      res.json(structure);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fee structure" });
    }
  });

  app.delete("/api/admin/fee-structures/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await FeeStructure.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fee structure" });
    }
  });

  // Membership Card Routes
  app.get("/api/admin/membership-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const cards = await MembershipCard.find().populate("membershipId").sort({ createdAt: -1 });
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership cards" });
    }
  });

  app.post("/api/admin/membership-cards", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const year = new Date().getFullYear();
      const count = await MembershipCard.countDocuments({ cardNumber: { $regex: `^MC${year}` } });
      const cardNumber = `MC${year}${String(count + 1).padStart(4, "0")}`;
      
      const card = new MembershipCard({ ...req.body, cardNumber });
      await card.save();
      res.status(201).json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to create membership card" });
    }
  });

  app.patch("/api/admin/membership-cards/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const updates: any = { ...req.body, updatedAt: new Date() };
      if (req.body.paymentStatus === "approved" && req.user?.id) {
        updates.approvedBy = req.user.id;
        updates.approvedAt = new Date();
        updates.isGenerated = true;
      }
      const card = await MembershipCard.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!card) return res.status(404).json({ error: "Membership card not found" });
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to update membership card" });
    }
  });

  app.get("/api/my-membership-card", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const membership = await Membership.findOne({ userId: req.user?.id });
      if (!membership) return res.status(404).json({ error: "Membership not found" });
      
      const card = await MembershipCard.findOne({ membershipId: membership._id }).sort({ createdAt: -1 });
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch membership card" });
    }
  });

  // Contact Inquiry Routes
  app.get("/api/admin/contact-inquiries", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/public/contact", async (req, res) => {
    try {
      const inquiry = new ContactInquiry(req.body);
      await inquiry.save();
      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.patch("/api/admin/contact-inquiries/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const inquiry = await ContactInquiry.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!inquiry) return res.status(404).json({ error: "Inquiry not found" });
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  app.delete("/api/admin/contact-inquiries/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await ContactInquiry.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  // Page Routes
  app.get("/api/admin/pages", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const pages = await Page.find().sort({ order: 1 });
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/public/pages/:slug", async (req, res) => {
    try {
      const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/admin/pages", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const page = new Page(req.body);
      await page.save();
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.patch("/api/admin/pages/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const page = await Page.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      await Page.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Bulk Roll Number Generation
  app.post("/api/admin/roll-numbers/bulk", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { studentIds, classNumber } = req.body;
      
      if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ error: "Student IDs required" });
      }

      let prefix = 100;
      const classNum = parseInt(classNumber);
      if (classNum >= 5 && classNum <= 8) prefix = 500;
      else if (classNum >= 9 && classNum <= 12) prefix = 900;

      const existingCount = await Student.countDocuments({ 
        rollNumber: { $regex: `^${prefix}` } 
      });

      const results = [];
      for (let i = 0; i < studentIds.length; i++) {
        const rollNumber = `${prefix}${String(existingCount + i + 1).padStart(3, "0")}`;
        const student = await Student.findByIdAndUpdate(
          studentIds[i],
          { rollNumber, updatedAt: new Date() },
          { new: true }
        );
        if (student) results.push({ id: student._id, rollNumber });
      }

      res.json({ success: true, assigned: results.length, rollNumbers: results });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate roll numbers" });
    }
  });

  // Bulk Results Upload
  app.post("/api/admin/results/bulk", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { results: resultsData, examName } = req.body;
      
      if (!resultsData || !Array.isArray(resultsData) || resultsData.length === 0) {
        return res.status(400).json({ error: "Results data required" });
      }

      const createdResults = [];
      for (const data of resultsData) {
        const student = await Student.findOne({ 
          $or: [
            { registrationNumber: data.registrationNumber },
            { rollNumber: data.rollNumber },
            { _id: data.studentId }
          ]
        });

        if (student) {
          const result = new Result({
            studentId: student._id,
            examName: examName || data.examName,
            marksObtained: data.marksObtained,
            totalMarks: data.totalMarks || 100,
            grade: data.grade,
            rank: data.rank,
            resultDate: data.resultDate || new Date().toISOString().split("T")[0],
            isPublished: data.isPublished || false
          });
          await result.save();
          createdResults.push(result);
        }
      }

      res.status(201).json({ 
        success: true, 
        created: createdResults.length, 
        total: resultsData.length,
        results: createdResults 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload results" });
    }
  });

  // Fee Payment Record
  app.post("/api/admin/students/:id/payment", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const { amount, paymentDate } = req.body;
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { 
          feePaid: true, 
          feeAmount: amount,
          paymentDate: paymentDate || new Date(),
          updatedAt: new Date() 
        },
        { new: true }
      );
      if (!student) return res.status(404).json({ error: "Student not found" });
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to record payment" });
    }
  });

  // Fee Records Export
  app.get("/api/admin/fee-records", authMiddleware, adminOnly, async (req: AuthRequest, res) => {
    try {
      const students = await Student.find({ feePaid: true })
        .select("fullName registrationNumber rollNumber class feeLevel feeAmount paymentDate")
        .sort({ paymentDate: -1 });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fee records" });
    }
  });
}
