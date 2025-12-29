import { db } from "./db";
import { eq, desc, sql, like, and, gte } from "drizzle-orm";
import {
  admins, students, results, admitCards, memberships, menuItems,
  adminSettings, paymentConfigs, contentSections, volunteerApplications,
  feeStructures, membershipCards, pages, contactInquiries,
  volunteerAccounts, paymentTransactions, teamMembers, services,
  InsertAdmin, InsertStudent, InsertResult, InsertAdmitCard, InsertMembership,
  InsertMenuItem, InsertAdminSetting, InsertPaymentConfig, InsertContentSection,
  InsertVolunteerApplication, InsertFeeStructure, InsertMembershipCard, InsertPage, InsertContactInquiry,
  InsertVolunteerAccount, InsertPaymentTransaction, InsertTeamMember, InsertService,
  Admin, Student, Result, AdmitCard, Membership, MenuItem, AdminSetting, PaymentConfig,
  ContentSection, VolunteerApplication, FeeStructure, MembershipCard, Page, ContactInquiry,
  VolunteerAccount, PaymentTransaction, TeamMember, Service
} from "@shared/schema";

export interface IStorage {
  createAdmin(data: InsertAdmin): Promise<Admin>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  getAdminById(id: number): Promise<Admin | undefined>;

  createStudent(data: InsertStudent): Promise<Student>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  getStudentById(id: number): Promise<Student | undefined>;
  getStudentByRollNumber(rollNumber: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined>;
  countStudentsWithRegPrefix(prefix: string): Promise<number>;
  countStudentsToday(): Promise<number>;
  countStudentsFeePaid(): Promise<number>;
  countActiveStudents(): Promise<number>;

  createResult(data: InsertResult): Promise<Result>;
  getResultsByStudentId(studentId: number, publishedOnly?: boolean): Promise<Result[]>;
  getAllResults(publishedOnly?: boolean): Promise<Result[]>;
  updateResult(id: number, data: Partial<InsertResult>): Promise<Result | undefined>;

  createAdmitCard(data: InsertAdmitCard): Promise<AdmitCard>;
  getAdmitCardsByStudentId(studentId: number): Promise<AdmitCard[]>;
  getAllAdmitCards(): Promise<AdmitCard[]>;
  deleteAdmitCard(id: number): Promise<void>;

  createMembership(data: InsertMembership): Promise<Membership>;
  getMembershipByUserId(userId: number): Promise<Membership | undefined>;
  getAllMemberships(): Promise<Membership[]>;
  updateMembership(id: number, data: Partial<InsertMembership>): Promise<Membership | undefined>;
  countMemberships(): Promise<number>;

  createMenuItem(data: InsertMenuItem): Promise<MenuItem>;
  getActiveMenuItems(): Promise<MenuItem[]>;
  getAllMenuItems(): Promise<MenuItem[]>;
  updateMenuItem(id: number, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<void>;

  createAdminSetting(data: InsertAdminSetting): Promise<AdminSetting>;
  getAdminSettingByKey(key: string): Promise<AdminSetting | undefined>;
  getAllAdminSettings(): Promise<AdminSetting[]>;
  updateAdminSettingByKey(key: string, data: Partial<InsertAdminSetting>): Promise<AdminSetting | undefined>;

  createPaymentConfig(data: InsertPaymentConfig): Promise<PaymentConfig>;
  getPaymentConfigsByType(type: string): Promise<PaymentConfig[]>;
  getAllPaymentConfigs(): Promise<PaymentConfig[]>;
  updatePaymentConfig(id: number, data: Partial<InsertPaymentConfig>): Promise<PaymentConfig | undefined>;
  deletePaymentConfig(id: number): Promise<void>;

  createContentSection(data: InsertContentSection): Promise<ContentSection>;
  getContentSectionsByKey(key: string): Promise<ContentSection[]>;
  getAllContentSections(): Promise<ContentSection[]>;
  updateContentSection(id: number, data: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  deleteContentSection(id: number): Promise<void>;

  createVolunteerApplication(data: InsertVolunteerApplication): Promise<VolunteerApplication>;
  getAllVolunteerApplications(): Promise<VolunteerApplication[]>;
  updateVolunteerApplication(id: number, data: Partial<InsertVolunteerApplication>): Promise<VolunteerApplication | undefined>;

  createFeeStructure(data: InsertFeeStructure): Promise<FeeStructure>;
  getAllFeeStructures(): Promise<FeeStructure[]>;
  updateFeeStructure(id: number, data: Partial<InsertFeeStructure>): Promise<FeeStructure | undefined>;

  createMembershipCard(data: InsertMembershipCard): Promise<MembershipCard>;
  getMembershipCardByMembershipId(membershipId: number): Promise<MembershipCard | undefined>;
  getAllMembershipCards(): Promise<MembershipCard[]>;
  updateMembershipCard(id: number, data: Partial<InsertMembershipCard>): Promise<MembershipCard | undefined>;

  createPage(data: InsertPage): Promise<Page>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  getAllPages(): Promise<Page[]>;
  updatePage(id: number, data: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: number): Promise<void>;

  createContactInquiry(data: InsertContactInquiry): Promise<ContactInquiry>;
  getAllContactInquiries(): Promise<ContactInquiry[]>;
  updateContactInquiry(id: number, data: Partial<InsertContactInquiry>): Promise<ContactInquiry | undefined>;

  createVolunteerAccount(data: InsertVolunteerAccount): Promise<VolunteerAccount>;
  getVolunteerAccountByEmail(email: string): Promise<VolunteerAccount | undefined>;
  getVolunteerAccountById(id: number): Promise<VolunteerAccount | undefined>;
  getAllVolunteerAccounts(): Promise<VolunteerAccount[]>;
  updateVolunteerAccount(id: number, data: Partial<InsertVolunteerAccount>): Promise<VolunteerAccount | undefined>;

  createPaymentTransaction(data: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransactionById(id: number): Promise<PaymentTransaction | undefined>;
  getPaymentTransactionByTransactionId(transactionId: string): Promise<PaymentTransaction | undefined>;
  getAllPaymentTransactions(): Promise<PaymentTransaction[]>;
  getPaymentTransactionsByType(type: string): Promise<PaymentTransaction[]>;
  getPendingPaymentTransactions(): Promise<PaymentTransaction[]>;
  updatePaymentTransaction(id: number, data: Partial<InsertPaymentTransaction>): Promise<PaymentTransaction | undefined>;

  createTeamMember(data: InsertTeamMember): Promise<TeamMember>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  getActiveTeamMembers(): Promise<TeamMember[]>;
  updateTeamMember(id: number, data: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<void>;

  createService(data: InsertService): Promise<Service>;
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  updateService(id: number, data: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createAdmin(data: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(data).returning();
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return await db.query.admins.findFirst({ where: eq(admins.email, email) });
  }

  async getAdminById(id: number): Promise<Admin | undefined> {
    return await db.query.admins.findFirst({ where: eq(admins.id, id) });
  }

  async createStudent(data: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(data).returning();
    return student;
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return await db.query.students.findFirst({ where: eq(students.email, email) });
  }

  async getStudentById(id: number): Promise<Student | undefined> {
    return await db.query.students.findFirst({ where: eq(students.id, id) });
  }

  async getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> {
    return await db.query.students.findFirst({ where: eq(students.rollNumber, rollNumber) });
  }

  async getAllStudents(): Promise<Student[]> {
    return await db.query.students.findMany({ orderBy: [desc(students.createdAt)] });
  }

  async updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db.update(students).set({ ...data, updatedAt: new Date() }).where(eq(students.id, id)).returning();
    return student;
  }

  async countStudentsWithRegPrefix(prefix: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(students).where(like(students.registrationNumber, `${prefix}%`));
    return Number(result[0]?.count || 0);
  }

  async countStudentsToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await db.select({ count: sql<number>`count(*)` }).from(students).where(gte(students.createdAt, today));
    return Number(result[0]?.count || 0);
  }

  async countStudentsFeePaid(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(students).where(eq(students.feePaid, true));
    return Number(result[0]?.count || 0);
  }

  async countActiveStudents(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(students).where(eq(students.isActive, true));
    return Number(result[0]?.count || 0);
  }

  async createResult(data: InsertResult): Promise<Result> {
    const [result] = await db.insert(results).values(data).returning();
    return result;
  }

  async getResultsByStudentId(studentId: number, publishedOnly = false): Promise<Result[]> {
    const conditions = publishedOnly
      ? and(eq(results.studentId, studentId), eq(results.isPublished, true))
      : eq(results.studentId, studentId);
    return await db.query.results.findMany({ where: conditions, orderBy: [desc(results.createdAt)] });
  }

  async getAllResults(publishedOnly = false): Promise<Result[]> {
    const conditions = publishedOnly ? eq(results.isPublished, true) : undefined;
    return await db.query.results.findMany({ where: conditions, orderBy: [desc(results.createdAt)] });
  }

  async updateResult(id: number, data: Partial<InsertResult>): Promise<Result | undefined> {
    const [result] = await db.update(results).set(data).where(eq(results.id, id)).returning();
    return result;
  }

  async createAdmitCard(data: InsertAdmitCard): Promise<AdmitCard> {
    const [admitCard] = await db.insert(admitCards).values(data).returning();
    return admitCard;
  }

  async getAdmitCardsByStudentId(studentId: number): Promise<AdmitCard[]> {
    return await db.query.admitCards.findMany({ where: eq(admitCards.studentId, studentId), orderBy: [desc(admitCards.uploadedAt)] });
  }

  async getAllAdmitCards(): Promise<AdmitCard[]> {
    return await db.query.admitCards.findMany({ orderBy: [desc(admitCards.uploadedAt)] });
  }

  async deleteAdmitCard(id: number): Promise<void> {
    await db.delete(admitCards).where(eq(admitCards.id, id));
  }

  async createMembership(data: InsertMembership): Promise<Membership> {
    const [membership] = await db.insert(memberships).values(data).returning();
    return membership;
  }

  async getMembershipByUserId(userId: number): Promise<Membership | undefined> {
    return await db.query.memberships.findFirst({ where: eq(memberships.userId, userId) });
  }

  async getAllMemberships(): Promise<Membership[]> {
    return await db.query.memberships.findMany({ orderBy: [desc(memberships.createdAt)] });
  }

  async updateMembership(id: number, data: Partial<InsertMembership>): Promise<Membership | undefined> {
    const [membership] = await db.update(memberships).set(data).where(eq(memberships.id, id)).returning();
    return membership;
  }

  async countMemberships(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(memberships);
    return Number(result[0]?.count || 0);
  }

  async createMenuItem(data: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(data).returning();
    return item;
  }

  async getActiveMenuItems(): Promise<MenuItem[]> {
    return await db.query.menuItems.findMany({ where: eq(menuItems.isActive, true), orderBy: [menuItems.order] });
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return await db.query.menuItems.findMany({ orderBy: [menuItems.order] });
  }

  async updateMenuItem(id: number, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [item] = await db.update(menuItems).set({ ...data, updatedAt: new Date() }).where(eq(menuItems.id, id)).returning();
    return item;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  async createAdminSetting(data: InsertAdminSetting): Promise<AdminSetting> {
    const [setting] = await db.insert(adminSettings).values(data).returning();
    return setting;
  }

  async getAdminSettingByKey(key: string): Promise<AdminSetting | undefined> {
    return await db.query.adminSettings.findFirst({ where: eq(adminSettings.key, key) });
  }

  async getAllAdminSettings(): Promise<AdminSetting[]> {
    return await db.query.adminSettings.findMany({ orderBy: [adminSettings.category, adminSettings.key] });
  }

  async updateAdminSettingByKey(key: string, data: Partial<InsertAdminSetting>): Promise<AdminSetting | undefined> {
    const existing = await this.getAdminSettingByKey(key);
    if (!existing) {
      const [setting] = await db.insert(adminSettings).values({ ...data, key, value: data.value || "", label: data.label || key } as InsertAdminSetting).returning();
      return setting;
    }
    const [setting] = await db.update(adminSettings).set({ ...data, updatedAt: new Date() }).where(eq(adminSettings.key, key)).returning();
    return setting;
  }

  async createPaymentConfig(data: InsertPaymentConfig): Promise<PaymentConfig> {
    const [config] = await db.insert(paymentConfigs).values(data).returning();
    return config;
  }

  async getPaymentConfigsByType(type: string): Promise<PaymentConfig[]> {
    return await db.query.paymentConfigs.findMany({
      where: and(eq(paymentConfigs.type, type as any), eq(paymentConfigs.isActive, true)),
      orderBy: [paymentConfigs.order]
    });
  }

  async getAllPaymentConfigs(): Promise<PaymentConfig[]> {
    return await db.query.paymentConfigs.findMany({ orderBy: [paymentConfigs.type, paymentConfigs.order] });
  }

  async updatePaymentConfig(id: number, data: Partial<InsertPaymentConfig>): Promise<PaymentConfig | undefined> {
    const [config] = await db.update(paymentConfigs).set({ ...data, updatedAt: new Date() }).where(eq(paymentConfigs.id, id)).returning();
    return config;
  }

  async deletePaymentConfig(id: number): Promise<void> {
    await db.delete(paymentConfigs).where(eq(paymentConfigs.id, id));
  }

  async createContentSection(data: InsertContentSection): Promise<ContentSection> {
    const [section] = await db.insert(contentSections).values(data).returning();
    return section;
  }

  async getContentSectionsByKey(key: string): Promise<ContentSection[]> {
    return await db.query.contentSections.findMany({
      where: and(eq(contentSections.sectionKey, key as any), eq(contentSections.isActive, true)),
      orderBy: [contentSections.order]
    });
  }

  async getAllContentSections(): Promise<ContentSection[]> {
    return await db.query.contentSections.findMany({ orderBy: [contentSections.sectionKey, contentSections.order] });
  }

  async updateContentSection(id: number, data: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [section] = await db.update(contentSections).set({ ...data, updatedAt: new Date() }).where(eq(contentSections.id, id)).returning();
    return section;
  }

  async deleteContentSection(id: number): Promise<void> {
    await db.delete(contentSections).where(eq(contentSections.id, id));
  }

  async createVolunteerApplication(data: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const [app] = await db.insert(volunteerApplications).values(data).returning();
    return app;
  }

  async getAllVolunteerApplications(): Promise<VolunteerApplication[]> {
    return await db.query.volunteerApplications.findMany({ orderBy: [desc(volunteerApplications.createdAt)] });
  }

  async updateVolunteerApplication(id: number, data: Partial<InsertVolunteerApplication>): Promise<VolunteerApplication | undefined> {
    const [app] = await db.update(volunteerApplications).set({ ...data, updatedAt: new Date() }).where(eq(volunteerApplications.id, id)).returning();
    return app;
  }

  async createFeeStructure(data: InsertFeeStructure): Promise<FeeStructure> {
    const [fee] = await db.insert(feeStructures).values(data).returning();
    return fee;
  }

  async getAllFeeStructures(): Promise<FeeStructure[]> {
    return await db.query.feeStructures.findMany({ orderBy: [feeStructures.level] });
  }

  async updateFeeStructure(id: number, data: Partial<InsertFeeStructure>): Promise<FeeStructure | undefined> {
    const [fee] = await db.update(feeStructures).set({ ...data, updatedAt: new Date() }).where(eq(feeStructures.id, id)).returning();
    return fee;
  }

  async createMembershipCard(data: InsertMembershipCard): Promise<MembershipCard> {
    const [card] = await db.insert(membershipCards).values(data).returning();
    return card;
  }

  async getMembershipCardByMembershipId(membershipId: number): Promise<MembershipCard | undefined> {
    return await db.query.membershipCards.findFirst({ where: eq(membershipCards.membershipId, membershipId) });
  }

  async getAllMembershipCards(): Promise<MembershipCard[]> {
    return await db.query.membershipCards.findMany({ orderBy: [desc(membershipCards.createdAt)] });
  }

  async updateMembershipCard(id: number, data: Partial<InsertMembershipCard>): Promise<MembershipCard | undefined> {
    const [card] = await db.update(membershipCards).set({ ...data, updatedAt: new Date() }).where(eq(membershipCards.id, id)).returning();
    return card;
  }

  async createPage(data: InsertPage): Promise<Page> {
    const [page] = await db.insert(pages).values(data).returning();
    return page;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    return await db.query.pages.findFirst({ where: eq(pages.slug, slug) });
  }

  async getAllPages(): Promise<Page[]> {
    return await db.query.pages.findMany({ orderBy: [pages.order] });
  }

  async updatePage(id: number, data: Partial<InsertPage>): Promise<Page | undefined> {
    const [page] = await db.update(pages).set({ ...data, updatedAt: new Date() }).where(eq(pages.id, id)).returning();
    return page;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  async createContactInquiry(data: InsertContactInquiry): Promise<ContactInquiry> {
    const [inquiry] = await db.insert(contactInquiries).values(data).returning();
    return inquiry;
  }

  async getAllContactInquiries(): Promise<ContactInquiry[]> {
    return await db.query.contactInquiries.findMany({ orderBy: [desc(contactInquiries.createdAt)] });
  }

  async updateContactInquiry(id: number, data: Partial<InsertContactInquiry>): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db.update(contactInquiries).set({ ...data, updatedAt: new Date() }).where(eq(contactInquiries.id, id)).returning();
    return inquiry;
  }

  async createVolunteerAccount(data: InsertVolunteerAccount): Promise<VolunteerAccount> {
    const [account] = await db.insert(volunteerAccounts).values(data).returning();
    return account;
  }

  async getVolunteerAccountByEmail(email: string): Promise<VolunteerAccount | undefined> {
    return await db.query.volunteerAccounts.findFirst({ where: eq(volunteerAccounts.email, email) });
  }

  async getVolunteerAccountById(id: number): Promise<VolunteerAccount | undefined> {
    return await db.query.volunteerAccounts.findFirst({ where: eq(volunteerAccounts.id, id) });
  }

  async getAllVolunteerAccounts(): Promise<VolunteerAccount[]> {
    return await db.query.volunteerAccounts.findMany({ orderBy: [desc(volunteerAccounts.createdAt)] });
  }

  async updateVolunteerAccount(id: number, data: Partial<InsertVolunteerAccount>): Promise<VolunteerAccount | undefined> {
    const [account] = await db.update(volunteerAccounts).set({ ...data, updatedAt: new Date() }).where(eq(volunteerAccounts.id, id)).returning();
    return account;
  }

  async createPaymentTransaction(data: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [transaction] = await db.insert(paymentTransactions).values(data).returning();
    return transaction;
  }

  async getPaymentTransactionById(id: number): Promise<PaymentTransaction | undefined> {
    return await db.query.paymentTransactions.findFirst({ where: eq(paymentTransactions.id, id) });
  }

  async getPaymentTransactionByTransactionId(transactionId: string): Promise<PaymentTransaction | undefined> {
    return await db.query.paymentTransactions.findFirst({ where: eq(paymentTransactions.transactionId, transactionId) });
  }

  async getAllPaymentTransactions(): Promise<PaymentTransaction[]> {
    return await db.query.paymentTransactions.findMany({ orderBy: [desc(paymentTransactions.createdAt)] });
  }

  async getPaymentTransactionsByType(type: string): Promise<PaymentTransaction[]> {
    return await db.query.paymentTransactions.findMany({
      where: eq(paymentTransactions.type, type as any),
      orderBy: [desc(paymentTransactions.createdAt)]
    });
  }

  async getPendingPaymentTransactions(): Promise<PaymentTransaction[]> {
    return await db.query.paymentTransactions.findMany({
      where: eq(paymentTransactions.status, "pending"),
      orderBy: [desc(paymentTransactions.createdAt)]
    });
  }

  async updatePaymentTransaction(id: number, data: Partial<InsertPaymentTransaction>): Promise<PaymentTransaction | undefined> {
    const [transaction] = await db.update(paymentTransactions).set({ ...data, updatedAt: new Date() }).where(eq(paymentTransactions.id, id)).returning();
    return transaction;
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.query.teamMembers.findMany({ orderBy: [teamMembers.order] });
  }

  async getActiveTeamMembers(): Promise<TeamMember[]> {
    return await db.query.teamMembers.findMany({
      where: eq(teamMembers.isActive, true),
      orderBy: [teamMembers.order]
    });
  }

  async updateTeamMember(id: number, data: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [member] = await db.update(teamMembers).set({ ...data, updatedAt: new Date() }).where(eq(teamMembers.id, id)).returning();
    return member;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async createService(data: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(data).returning();
    return service;
  }

  async getAllServices(): Promise<Service[]> {
    return await db.query.services.findMany({ orderBy: [services.order] });
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [services.order]
    });
  }

  async updateService(id: number, data: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db.update(services).set({ ...data, updatedAt: new Date() }).where(eq(services.id, id)).returning();
    return service;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }
}

export const storage = new DatabaseStorage();
