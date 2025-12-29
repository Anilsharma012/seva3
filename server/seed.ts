import bcrypt from "bcryptjs";
import { storage } from "./storage";

const defaultMenuItems = [
  { title: "Dashboard", titleHindi: "डैशबोर्ड", path: "/admin/dashboard", iconKey: "LayoutDashboard", order: 1, group: "main" },
  { title: "Students", titleHindi: "छात्र", path: "/admin/students", iconKey: "GraduationCap", order: 2, group: "main" },
  { title: "Roll Numbers", titleHindi: "रोल नंबर", path: "/admin/roll-numbers", iconKey: "FileText", order: 3, group: "main" },
  { title: "Results", titleHindi: "परिणाम", path: "/admin/results", iconKey: "Award", order: 4, group: "main" },
  { title: "Admit Cards", titleHindi: "प्रवेश पत्र", path: "/admin/admit-cards", iconKey: "IdCard", order: 5, group: "main" },
  { title: "Fees", titleHindi: "शुल्क", path: "/admin/fees", iconKey: "CreditCard", order: 6, group: "main" },
  { title: "Memberships", titleHindi: "सदस्यता", path: "/admin/memberships", iconKey: "Users", order: 7, group: "main" },
  { title: "Volunteers", titleHindi: "स्वयंसेवक", path: "/admin/volunteers", iconKey: "Heart", order: 8, group: "main" },
  { title: "Content", titleHindi: "सामग्री", path: "/admin/content", iconKey: "FileEdit", order: 9, group: "main" },
  { title: "Pages", titleHindi: "पृष्ठ", path: "/admin/pages", iconKey: "Layout", order: 10, group: "main" },
  { title: "Payments", titleHindi: "भुगतान", path: "/admin/payments", iconKey: "Wallet", order: 11, group: "main" },
  { title: "Settings", titleHindi: "सेटिंग्स", path: "/admin/settings", iconKey: "Settings", order: 100, group: "system" },
];

const defaultFeeStructures = [
  { name: "Village Level", nameHindi: "ग्राम स्तर", level: "village" as const, amount: 99, description: "For students at village level", isActive: true },
  { name: "Block Level", nameHindi: "ब्लॉक स्तर", level: "block" as const, amount: 199, description: "For students at block level", isActive: true },
  { name: "District Level", nameHindi: "जिला स्तर", level: "district" as const, amount: 299, description: "For students at district level", isActive: true },
  { name: "Haryana Level", nameHindi: "हरियाणा स्तर", level: "haryana" as const, amount: 399, description: "For students at Haryana level", isActive: true },
];

const defaultContentSections = [
  { sectionKey: "about" as const, title: "About Us", titleHindi: "हमारे बारे में", content: "Manav Welfare Seva Society is dedicated to providing free education to underprivileged children.", contentHindi: "मानव वेलफेयर सेवा सोसाइटी वंचित बच्चों को मुफ्त शिक्षा प्रदान करने के लिए समर्पित है।", isActive: true, order: 1 },
  { sectionKey: "services" as const, title: "Our Services", titleHindi: "हमारी सेवाएं", content: "We provide quality education, study materials, and support to students.", contentHindi: "हम छात्रों को गुणवत्तापूर्ण शिक्षा, अध्ययन सामग्री और सहायता प्रदान करते हैं।", isActive: true, order: 1 },
  { sectionKey: "contact" as const, title: "Contact Us", titleHindi: "संपर्क करें", content: "Reach out to us for any queries or support.", contentHindi: "किसी भी प्रश्न या सहायता के लिए हमसे संपर्क करें।", isActive: true, order: 1 },
  { sectionKey: "joinUs" as const, title: "Join Us", titleHindi: "हमसे जुड़ें", content: "Become a part of our mission to educate children.", contentHindi: "बच्चों को शिक्षित करने के हमारे मिशन का हिस्सा बनें।", isActive: true, order: 1 },
  { sectionKey: "volunteer" as const, title: "Become a Volunteer", titleHindi: "स्वयंसेवक बनें", content: "Join our team of dedicated volunteers.", contentHindi: "हमारे समर्पित स्वयंसेवकों की टीम में शामिल हों।", isActive: true, order: 1 },
];

const defaultPaymentConfig = [
  { type: "donation" as const, name: "Donation", nameHindi: "दान", upiId: "manavwelfare@upi", isActive: true, order: 1 },
  { type: "fee" as const, name: "Fee Payment", nameHindi: "शुल्क भुगतान", upiId: "manavwelfare@upi", isActive: true, order: 1 },
  { type: "membership" as const, name: "Membership", nameHindi: "सदस्यता", upiId: "manavwelfare@upi", isActive: true, order: 1 },
];

const defaultSettings = [
  { key: "enableRegistration", value: "true", label: "Enable Registration", labelHindi: "रजिस्ट्रेशन सक्षम", description: "Allow new student registrations", type: "boolean" as const, category: "registration" },
  { key: "enableFeePayment", value: "true", label: "Enable Fee Payment", labelHindi: "शुल्क भुगतान सक्षम", description: "Allow fee payments", type: "boolean" as const, category: "fees" },
  { key: "enableResults", value: "true", label: "Enable Results", labelHindi: "परिणाम सक्षम", description: "Show results to students", type: "boolean" as const, category: "results" },
  { key: "enableAdmitCards", value: "true", label: "Enable Admit Cards", labelHindi: "प्रवेश पत्र सक्षम", description: "Allow admit card downloads", type: "boolean" as const, category: "admitCards" },
  { key: "enableMemberships", value: "true", label: "Enable Memberships", labelHindi: "सदस्यता सक्षम", description: "Allow membership registrations", type: "boolean" as const, category: "memberships" },
  { key: "admit_card_download", value: "disabled", label: "Admit Card Download Button", labelHindi: "एडमिट कार्ड डाउनलोड बटन", description: "Show admit card download button in header (enabled/disabled)", type: "string" as const, category: "admitCards" },
  { key: "siteName", value: "Manav Welfare Seva Society", label: "Site Name", labelHindi: "साइट का नाम", description: "Organization name", type: "string" as const, category: "general" },
  { key: "siteNameHindi", value: "मानव वेलफेयर सेवा सोसाइटी", label: "Site Name (Hindi)", labelHindi: "साइट का नाम (हिंदी)", description: "Organization name in Hindi", type: "string" as const, category: "general" },
  { key: "contactPhone", value: "+91 98126 76818", label: "Contact Phone", labelHindi: "संपर्क फ़ोन", description: "Contact phone number", type: "string" as const, category: "contact" },
  { key: "contactEmail", value: "info@manavwelfare.org", label: "Contact Email", labelHindi: "संपर्क ईमेल", description: "Contact email address", type: "string" as const, category: "contact" },
  { key: "upiId", value: "manavwelfare@upi", label: "UPI ID", labelHindi: "UPI आईडी", description: "UPI ID for payments", type: "string" as const, category: "payments" },
  { key: "villageFee", value: "99", label: "Village Fee", labelHindi: "ग्राम शुल्क", description: "Village level fee amount", type: "number" as const, category: "fees" },
  { key: "blockFee", value: "199", label: "Block Fee", labelHindi: "ब्लॉक शुल्क", description: "Block level fee amount", type: "number" as const, category: "fees" },
  { key: "districtFee", value: "299", label: "District Fee", labelHindi: "जिला शुल्क", description: "District level fee amount", type: "number" as const, category: "fees" },
  { key: "haryanaFee", value: "399", label: "Haryana Fee", labelHindi: "हरियाणा शुल्क", description: "Haryana level fee amount", type: "number" as const, category: "fees" },
];

export async function seedDatabase() {
  try {
    const adminExists = await storage.getAdminByEmail("admin@mwss.org");
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      await storage.createAdmin({
        email: "admin@mwss.org",
        password: hashedPassword,
        name: "Super Admin",
      });
      console.log("Default admin created: admin@mwss.org / Admin@123");
    }

    const studentExists = await storage.getStudentByEmail("student@mwss.org");
    if (!studentExists) {
      const hashedPassword = await bcrypt.hash("Student@123", 10);
      const year = new Date().getFullYear();
      await storage.createStudent({
        email: "student@mwss.org",
        password: hashedPassword,
        fullName: "Demo Student",
        fatherName: "Demo Father",
        phone: "9876543210",
        class: "10",
        registrationNumber: `MWSS${year}0001`,
        rollNumber: "900001",
        feeLevel: "village",
        feeAmount: 99,
        feePaid: true,
        isActive: true,
      });
      console.log("Demo student created: student@mwss.org / Student@123");
    }

    const existingMenuItems = await storage.getAllMenuItems();
    for (const item of defaultMenuItems) {
      const exists = existingMenuItems.find(m => m.path === item.path);
      if (!exists) {
        await storage.createMenuItem({
          ...item,
          isActive: true,
        });
        console.log(`Menu item created: ${item.title}`);
      }
    }

    for (const setting of defaultSettings) {
      const exists = await storage.getAdminSettingByKey(setting.key);
      if (!exists) {
        await storage.createAdminSetting(setting);
        console.log(`Setting created: ${setting.key}`);
      }
    }

    const existingFeeStructures = await storage.getAllFeeStructures();
    if (existingFeeStructures.length === 0) {
      for (const fee of defaultFeeStructures) {
        await storage.createFeeStructure(fee);
      }
      console.log("Default fee structures created");
    }

    const existingContentSections = await storage.getAllContentSections();
    if (existingContentSections.length === 0) {
      for (const content of defaultContentSections) {
        await storage.createContentSection(content);
      }
      console.log("Default content sections created");
    }

    const existingPaymentConfigs = await storage.getAllPaymentConfigs();
    if (existingPaymentConfigs.length === 0) {
      for (const payment of defaultPaymentConfig) {
        await storage.createPaymentConfig(payment);
      }
      console.log("Default payment configs created");
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
