import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface IStudent extends Document {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  photoUrl?: string;
  class: string;
  registrationNumber: string;
  rollNumber?: string;
  feeLevel: 'village' | 'block' | 'district' | 'haryana';
  feeAmount: number;
  feePaid: boolean;
  paymentDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResult extends Document {
  studentId: mongoose.Types.ObjectId;
  examName: string;
  marksObtained?: number;
  totalMarks: number;
  grade?: string;
  rank?: number;
  resultDate?: string;
  remarks?: string;
  isPublished: boolean;
  createdAt: Date;
}

export interface IAdmitCard extends Document {
  studentId: mongoose.Types.ObjectId;
  examName: string;
  fileUrl: string;
  fileName: string;
  termsEnglish?: string;
  termsHindi?: string;
  uploadedAt: Date;
}

export interface IMembership extends Document {
  userId?: mongoose.Types.ObjectId;
  memberName: string;
  memberEmail?: string;
  memberPhone: string;
  memberAddress?: string;
  membershipType: string;
  membershipNumber?: string;
  qrCodeUrl?: string;
  upiId?: string;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: Date;
}

export interface IMenuItem extends Document {
  title: string;
  titleHindi?: string;
  path: string;
  iconKey: string;
  order: number;
  isActive: boolean;
  group?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminSetting extends Document {
  key: string;
  value: string;
  label: string;
  labelHindi?: string;
  description?: string;
  type: 'boolean' | 'string' | 'number' | 'json';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentConfig extends Document {
  type: 'donation' | 'fee' | 'membership' | 'general';
  name: string;
  nameHindi?: string;
  qrCodeUrl?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentSection extends Document {
  sectionKey: 'about' | 'services' | 'gallery' | 'events' | 'joinUs' | 'contact' | 'volunteer' | 'team' | 'home';
  title: string;
  titleHindi?: string;
  content: string;
  contentHindi?: string;
  imageUrls?: string[];
  isActive: boolean;
  order: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVolunteerApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  occupation?: string;
  skills?: string;
  availability?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeeStructure extends Document {
  name: string;
  nameHindi?: string;
  level: 'village' | 'block' | 'district' | 'haryana';
  amount: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMembershipCard extends Document {
  membershipId: mongoose.Types.ObjectId;
  cardNumber: string;
  memberName: string;
  memberPhoto?: string;
  validFrom: string;
  validUntil: string;
  cardImageUrl?: string;
  isGenerated: boolean;
  paymentStatus: 'pending' | 'paid' | 'approved';
  paymentAmount?: number;
  paymentDate?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  titleHindi?: string;
  content: string;
  contentHindi?: string;
  metaDescription?: string;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVolunteerAccount extends Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address?: string;
  city?: string;
  photoUrl?: string;
  occupation?: string;
  skills?: string;
  availability?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentTransaction extends Document {
  type: 'donation' | 'membership' | 'fee' | 'other';
  name: string;
  email?: string;
  phone: string;
  amount: number;
  transactionId: string;
  paymentMethod?: string;
  purpose?: string;
  status: 'pending' | 'approved' | 'rejected';
  membershipId?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  photoUrl?: string;
  fatherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  membershipLevel?: string;
  adminNotes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember extends Document {
  name: string;
  nameHindi?: string;
  designation: string;
  designationHindi?: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  bio?: string;
  bioHindi?: string;
  socialLinks?: any;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IService extends Document {
  name: string;
  nameHindi?: string;
  description: string;
  descriptionHindi?: string;
  iconKey?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryImage extends Document {
  imageUrl: string;
  title: string;
  category: string;
  date?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const StudentSchema = new Schema<IStudent>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: String,
  fatherName: String,
  motherName: String,
  address: String,
  city: String,
  state: { type: String, default: 'Haryana' },
  pincode: String,
  dateOfBirth: String,
  gender: String,
  photoUrl: String,
  class: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  rollNumber: String,
  feeLevel: { type: String, enum: ['village', 'block', 'district', 'haryana'], default: 'village' },
  feeAmount: { type: Number, default: 99 },
  feePaid: { type: Boolean, default: false },
  paymentDate: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ResultSchema = new Schema<IResult>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  examName: { type: String, required: true },
  marksObtained: Number,
  totalMarks: { type: Number, default: 100 },
  grade: String,
  rank: Number,
  resultDate: String,
  remarks: String,
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const AdmitCardSchema = new Schema<IAdmitCard>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  examName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  termsEnglish: String,
  termsHindi: String,
  uploadedAt: { type: Date, default: Date.now }
});

const MembershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: 'Student' },
  memberName: { type: String, required: true },
  memberEmail: String,
  memberPhone: { type: String, required: true },
  memberAddress: String,
  membershipType: { type: String, default: 'regular' },
  membershipNumber: { type: String, unique: true, sparse: true },
  qrCodeUrl: String,
  upiId: String,
  isActive: { type: Boolean, default: true },
  validFrom: String,
  validUntil: String,
  createdAt: { type: Date, default: Date.now }
});

const MenuItemSchema = new Schema<IMenuItem>({
  title: { type: String, required: true },
  titleHindi: String,
  path: { type: String, required: true },
  iconKey: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  group: { type: String, default: 'main' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AdminSettingSchema = new Schema<IAdminSetting>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  labelHindi: String,
  description: String,
  type: { type: String, enum: ['boolean', 'string', 'number', 'json'], default: 'boolean' },
  category: { type: String, default: 'general' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentConfigSchema = new Schema<IPaymentConfig>({
  type: { type: String, enum: ['donation', 'fee', 'membership', 'general'], required: true },
  name: { type: String, required: true },
  nameHindi: String,
  qrCodeUrl: String,
  upiId: String,
  bankName: String,
  accountNumber: String,
  ifscCode: String,
  accountHolderName: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContentSectionSchema = new Schema<IContentSection>({
  sectionKey: { type: String, enum: ['about', 'services', 'gallery', 'events', 'joinUs', 'contact', 'volunteer', 'team', 'home'], required: true },
  title: { type: String, required: true },
  titleHindi: String,
  content: { type: String, required: true },
  contentHindi: String,
  imageUrls: [String],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const VolunteerApplicationSchema = new Schema<IVolunteerApplication>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: String,
  occupation: String,
  skills: String,
  availability: String,
  message: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FeeStructureSchema = new Schema<IFeeStructure>({
  name: { type: String, required: true },
  nameHindi: String,
  level: { type: String, enum: ['village', 'block', 'district', 'haryana'], required: true },
  amount: { type: Number, required: true },
  description: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MembershipCardSchema = new Schema<IMembershipCard>({
  membershipId: { type: Schema.Types.ObjectId, ref: 'Membership', required: true },
  cardNumber: { type: String, required: true, unique: true },
  memberName: { type: String, required: true },
  memberPhoto: String,
  validFrom: { type: String, required: true },
  validUntil: { type: String, required: true },
  cardImageUrl: String,
  isGenerated: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'approved'], default: 'pending' },
  paymentAmount: Number,
  paymentDate: Date,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PageSchema = new Schema<IPage>({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  titleHindi: String,
  content: { type: String, required: true },
  contentHindi: String,
  metaDescription: String,
  isPublished: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ContactInquirySchema = new Schema<IContactInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'read', 'replied'], default: 'pending' },
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const VolunteerAccountSchema = new Schema<IVolunteerAccount>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: String,
  photoUrl: String,
  occupation: String,
  skills: String,
  availability: String,
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentTransactionSchema = new Schema<IPaymentTransaction>({
  type: { type: String, enum: ['donation', 'membership', 'fee', 'other'], required: true },
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true },
  paymentMethod: String,
  purpose: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  membershipId: { type: Schema.Types.ObjectId, ref: 'Membership' },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  photoUrl: String,
  fatherName: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  membershipLevel: String,
  adminNotes: String,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  nameHindi: String,
  designation: { type: String, required: true },
  designationHindi: String,
  photoUrl: String,
  phone: String,
  email: String,
  bio: String,
  bioHindi: String,
  socialLinks: Schema.Types.Mixed,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  nameHindi: String,
  description: { type: String, required: true },
  descriptionHindi: String,
  iconKey: String,
  imageUrl: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const GalleryImageSchema = new Schema<IGalleryImage>({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export const Student = mongoose.model<IStudent>('Student', StudentSchema);
export const Result = mongoose.model<IResult>('Result', ResultSchema);
export const AdmitCard = mongoose.model<IAdmitCard>('AdmitCard', AdmitCardSchema);
export const Membership = mongoose.model<IMembership>('Membership', MembershipSchema);
export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
export const AdminSetting = mongoose.model<IAdminSetting>('AdminSetting', AdminSettingSchema);
export const PaymentConfig = mongoose.model<IPaymentConfig>('PaymentConfig', PaymentConfigSchema);
export const ContentSection = mongoose.model<IContentSection>('ContentSection', ContentSectionSchema);
export const VolunteerApplication = mongoose.model<IVolunteerApplication>('VolunteerApplication', VolunteerApplicationSchema);
export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
export const MembershipCard = mongoose.model<IMembershipCard>('MembershipCard', MembershipCardSchema);
export const Page = mongoose.model<IPage>('Page', PageSchema);
export const ContactInquiry = mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
export const VolunteerAccount = mongoose.model<IVolunteerAccount>('VolunteerAccount', VolunteerAccountSchema);
export const PaymentTransaction = mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Service = mongoose.model<IService>('Service', ServiceSchema);
export const GalleryImage = mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
