import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const feeLevelEnum = pgEnum("fee_level", ["village", "block", "district", "haryana"]);
export const statusEnum = pgEnum("status", ["pending", "approved", "rejected"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["pending", "read", "replied"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "approved"]);
export const paymentTypeEnum = pgEnum("payment_type", ["donation", "fee", "membership", "general"]);
export const settingTypeEnum = pgEnum("setting_type", ["boolean", "string", "number", "json"]);
export const sectionKeyEnum = pgEnum("section_key", ["about", "services", "gallery", "events", "joinUs", "contact", "volunteer"]);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  fatherName: text("father_name"),
  motherName: text("mother_name"),
  address: text("address"),
  city: text("city"),
  state: text("state").default("Haryana"),
  pincode: text("pincode"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  photoUrl: text("photo_url"),
  class: text("class").notNull(),
  registrationNumber: text("registration_number").notNull().unique(),
  rollNumber: text("roll_number"),
  feeLevel: feeLevelEnum("fee_level").default("village").notNull(),
  feeAmount: integer("fee_amount").default(99).notNull(),
  feePaid: boolean("fee_paid").default(false).notNull(),
  paymentDate: timestamp("payment_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  examName: text("exam_name").notNull(),
  marksObtained: integer("marks_obtained"),
  totalMarks: integer("total_marks").default(100).notNull(),
  grade: text("grade"),
  rank: integer("rank"),
  resultDate: text("result_date"),
  remarks: text("remarks"),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admitCards = pgTable("admit_cards", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  examName: text("exam_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => students.id),
  memberName: text("member_name").notNull(),
  memberEmail: text("member_email"),
  memberPhone: text("member_phone").notNull(),
  memberAddress: text("member_address"),
  membershipType: text("membership_type").default("regular").notNull(),
  membershipNumber: text("membership_number").unique(),
  qrCodeUrl: text("qr_code_url"),
  upiId: text("upi_id"),
  isActive: boolean("is_active").default(true).notNull(),
  validFrom: text("valid_from"),
  validUntil: text("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  path: text("path").notNull(),
  iconKey: text("icon_key").notNull(),
  order: integer("order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  group: text("group").default("main"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  labelHindi: text("label_hindi"),
  description: text("description"),
  type: settingTypeEnum("type").default("boolean").notNull(),
  category: text("category").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentConfigs = pgTable("payment_configs", {
  id: serial("id").primaryKey(),
  type: paymentTypeEnum("type").notNull(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  qrCodeUrl: text("qr_code_url"),
  upiId: text("upi_id"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  ifscCode: text("ifsc_code"),
  accountHolderName: text("account_holder_name"),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  sectionKey: sectionKeyEnum("section_key").notNull(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  content: text("content").notNull(),
  contentHindi: text("content_hindi"),
  imageUrls: text("image_urls").array(),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const volunteerApplications = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  occupation: text("occupation"),
  skills: text("skills"),
  availability: text("availability"),
  message: text("message"),
  status: statusEnum("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feeStructures = pgTable("fee_structures", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  level: feeLevelEnum("level").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const membershipCards = pgTable("membership_cards", {
  id: serial("id").primaryKey(),
  membershipId: integer("membership_id").references(() => memberships.id).notNull(),
  cardNumber: text("card_number").notNull().unique(),
  memberName: text("member_name").notNull(),
  memberPhoto: text("member_photo"),
  validFrom: text("valid_from").notNull(),
  validUntil: text("valid_until").notNull(),
  cardImageUrl: text("card_image_url"),
  isGenerated: boolean("is_generated").default(false).notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  paymentAmount: integer("payment_amount"),
  paymentDate: timestamp("payment_date"),
  approvedBy: integer("approved_by").references(() => admins.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  content: text("content").notNull(),
  contentHindi: text("content_hindi"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("pending").notNull(),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({ id: true, createdAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, createdAt: true, updatedAt: true });
export const insertResultSchema = createInsertSchema(results).omit({ id: true, createdAt: true });
export const insertAdmitCardSchema = createInsertSchema(admitCards).omit({ id: true, uploadedAt: true });
export const insertMembershipSchema = createInsertSchema(memberships).omit({ id: true, createdAt: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPaymentConfigSchema = createInsertSchema(paymentConfigs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContentSectionSchema = createInsertSchema(contentSections).omit({ id: true, createdAt: true, updatedAt: true });
export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMembershipCardSchema = createInsertSchema(membershipCards).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPageSchema = createInsertSchema(pages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type InsertAdmitCard = z.infer<typeof insertAdmitCardSchema>;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type InsertPaymentConfig = z.infer<typeof insertPaymentConfigSchema>;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type InsertMembershipCard = z.infer<typeof insertMembershipCardSchema>;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

export type Admin = typeof admins.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Result = typeof results.$inferSelect;
export type AdmitCard = typeof admitCards.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type PaymentConfig = typeof paymentConfigs.$inferSelect;
export type ContentSection = typeof contentSections.$inferSelect;
export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type FeeStructure = typeof feeStructures.$inferSelect;
export type MembershipCard = typeof membershipCards.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
