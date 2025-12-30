# Manav Welfare Seva Society - NGO Education Management System

## Overview
This is a full-stack education management system for Manav Welfare Seva Society, an NGO providing free education to underprivileged children in Haryana, India. The system manages student registrations, roll numbers, admit cards, results, memberships, and features separate admin and student dashboards.

## Default Credentials
- **Admin Login**: admin@mwss.org / Admin@123
- **Demo Student Login**: student@mwss.org / Student@123

## Recent Changes
- **December 30, 2024**: Email notification system
  - Added nodemailer integration with Gmail for automated emails
  - Email notifications on student/volunteer registration
  - Email notifications on payment/donation submission
  - Email notifications on admin approval (to both admin and user)
  - Email notifications for results, admit cards, roll number assignments
  - Fixed AdminVolunteers page to show both volunteer accounts and applications with tabs
  - Fixed volunteer login response handling
  - Fixed AdminLayout key prop for menu items
- **December 29, 2024**: Enhanced volunteer and payment management system
  - Added volunteer_accounts table with login/password support and approval workflow
  - Added payment_transactions table to track all donations, fees, and memberships with admin approval
  - Added team_members table for managing team/staff profiles (bilingual)
  - Added services table for managing NGO services (bilingual)
  - Volunteer registration with password, admin approval before full access
  - Payment transaction approval workflow - payments pending until admin approves
  - Extended authentication to support volunteer role (admin, student, volunteer)
- **December 29, 2024**: Migrated from MongoDB to PostgreSQL with Drizzle ORM
  - Replaced Mongoose schemas with Drizzle PostgreSQL schemas in shared/schema.ts
  - Implemented storage interface layer in server/storage.ts for database abstraction
  - All API routes now use the storage interface for database operations
  - Removed MongoDB models folder and Supabase code
  - Database seeding updated to use PostgreSQL storage interface
- **December 2024**: Previous MongoDB Atlas implementation
- JWT-based authentication with role-based access control (admin, student, volunteer)
- Database-driven admin sidebar menu (MenuItem schema)
- Configurable admin settings/feature toggles (AdminSetting schema)
- Payment Configuration management (QR codes, UPI IDs, bank details)
- Content Section management (About Us, Services, Gallery, Events, Join Us, Contact)
- Volunteer Application management with status tracking
- Fee Structure management with configurable levels
- Membership Card generation with payment approval workflow
- Custom Page management for dynamic pages
- Bulk Roll Number generation and Bulk Results upload with CSV support

## Tech Stack
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing

## Project Structure
```
client/
  src/
    pages/           # React pages (admin, student, public)
    components/      # Reusable UI components
    contexts/        # AuthContext for authentication
    hooks/           # Custom React hooks
    lib/             # Utility functions
server/
  routes.ts         # Express API routes
  storage.ts        # Database storage interface (PostgreSQL)
  db.ts             # PostgreSQL connection (Drizzle)
  seed.ts           # Database seeding
  middleware/       # Auth middleware
  index.ts          # Server entry point
shared/
  schema.ts         # Drizzle PostgreSQL schemas and types
```

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/student/register` - Student registration
- `GET /api/auth/me` - Get current user

### Students (Admin only)
- `GET /api/students` - List all students
- `POST /api/students` - Create student
- `PATCH /api/students/:id` - Update student

### Results
- `GET /api/results` - List all results
- `POST /api/results` - Add result

### Admit Cards
- `GET /api/admit-cards` - List all admit cards
- `POST /api/admit-cards` - Create admit card

### Memberships
- `GET /api/memberships` - List all memberships
- `POST /api/memberships` - Create membership
- `PATCH /api/memberships/:id` - Update membership

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/my-profile` - Student profile with results/admit cards

### Admin Configuration (Admin only)
- `GET /api/admin/menu` - Get active menu items
- `GET /api/admin/menu/all` - Get all menu items (including inactive)
- `POST /api/admin/menu` - Create menu item
- `PATCH /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/settings` - Get all settings
- `PATCH /api/admin/settings/:key` - Update setting
- `GET /api/public/settings` - Get public settings (no auth required)

### Payment Configuration (Admin only)
- `GET /api/admin/payment-config` - Get all payment configs
- `POST /api/admin/payment-config` - Create payment config
- `PATCH /api/admin/payment-config/:id` - Update payment config
- `DELETE /api/admin/payment-config/:id` - Delete payment config
- `GET /api/public/payment-config/:type` - Get active payment configs by type

### Content Sections (Admin only)
- `GET /api/admin/content-sections` - Get all content sections
- `POST /api/admin/content-sections` - Create content section
- `PATCH /api/admin/content-sections/:id` - Update content section
- `DELETE /api/admin/content-sections/:id` - Delete content section
- `GET /api/public/content/:sectionKey` - Get active content by section key

### Volunteer Applications
- `GET /api/admin/volunteers` - Get all volunteer applications (Admin only)
- `POST /api/public/volunteer-apply` - Submit volunteer application (Public)
- `PATCH /api/admin/volunteers/:id` - Update volunteer status (Admin only)
- `DELETE /api/admin/volunteers/:id` - Delete volunteer (Admin only)

### Fee Structures (Admin only)
- `GET /api/admin/fee-structures` - Get all fee structures
- `POST /api/admin/fee-structures` - Create fee structure
- `PATCH /api/admin/fee-structures/:id` - Update fee structure
- `DELETE /api/admin/fee-structures/:id` - Delete fee structure
- `GET /api/public/fee-structures` - Get active fee structures

### Membership Cards (Admin only)
- `GET /api/admin/membership-cards` - Get all membership cards
- `POST /api/admin/membership-cards` - Create membership card
- `PATCH /api/admin/membership-cards/:id` - Update/approve membership card
- `GET /api/my-membership-card` - Get member's own card (Authenticated)

### Custom Pages
- `GET /api/admin/pages` - Get all pages (Admin only)
- `POST /api/admin/pages` - Create page (Admin only)
- `PATCH /api/admin/pages/:id` - Update page (Admin only)
- `DELETE /api/admin/pages/:id` - Delete page (Admin only)
- `GET /api/public/pages/:slug` - Get published page by slug

### Contact Inquiries
- `GET /api/admin/contact-inquiries` - Get all inquiries (Admin only)
- `POST /api/public/contact` - Submit contact form (Public)
- `PATCH /api/admin/contact-inquiries/:id` - Update inquiry status (Admin only)
- `DELETE /api/admin/contact-inquiries/:id` - Delete inquiry (Admin only)

### Bulk Operations (Admin only)
- `POST /api/admin/roll-numbers/bulk` - Bulk assign roll numbers
- `POST /api/admin/results/bulk` - Bulk upload results
- `POST /api/admin/students/:id/payment` - Record fee payment
- `GET /api/admin/fee-records` - Export fee payment records

### Volunteer Accounts
- `POST /api/auth/volunteer/register` - Volunteer registration with password
- `POST /api/auth/volunteer/login` - Volunteer login
- `GET /api/admin/volunteer-accounts` - Get all volunteer accounts (Admin only)
- `PATCH /api/admin/volunteer-accounts/:id` - Approve/update volunteer (Admin only)

### Payment Transactions (Approval Workflow)
- `POST /api/public/payment-transaction` - Submit payment (Public)
- `GET /api/admin/payment-transactions` - Get all transactions (Admin only)
- `GET /api/admin/payment-transactions/pending` - Get pending transactions (Admin only)
- `PATCH /api/admin/payment-transactions/:id` - Approve/reject transaction (Admin only)
- `GET /api/public/payment-transaction/check/:transactionId` - Check transaction status (Public)

### Team Members (Bilingual)
- `GET /api/admin/team-members` - Get all team members (Admin only)
- `GET /api/public/team-members` - Get active team members (Public)
- `POST /api/admin/team-members` - Create team member (Admin only)
- `PATCH /api/admin/team-members/:id` - Update team member (Admin only)
- `DELETE /api/admin/team-members/:id` - Delete team member (Admin only)

### Services (Bilingual)
- `GET /api/admin/services` - Get all services (Admin only)
- `GET /api/public/services` - Get active services (Public)
- `POST /api/admin/services` - Create service (Admin only)
- `PATCH /api/admin/services/:id` - Update service (Admin only)
- `DELETE /api/admin/services/:id` - Delete service (Admin only)

## Database Schema (PostgreSQL with Drizzle)

### students
- id (serial), email, password (hashed), fullName, fatherName, motherName
- phone, address, city, dateOfBirth, gender
- registrationNumber (auto-generated: MWSS{year}{4-digit})
- class, rollNumber, feeLevel, feeAmount, feePaid, isActive

### admins
- id (serial), email, password (hashed), name

### results
- id (serial), studentId (ref), examName, resultDate, totalMarks, marksObtained, grade, rank

### admit_cards
- id (serial), studentId (ref), examName, fileUrl, fileName

### memberships
- id (serial), memberName, memberPhone, memberEmail, memberAddress
- membershipType, membershipNumber, isActive, validFrom, validUntil

### menu_items (Admin Configuration)
- id (serial), title, titleHindi, path, iconKey, order, isActive, group

### admin_settings (Feature Toggles)
- id (serial), key (unique), label, value, category, type, options

### payment_configs
- id (serial), type (donation, fee, membership, general)
- name, nameHindi, qrCodeUrl, upiId
- bankName, accountNumber, ifscCode, accountHolderName
- isActive, order

### content_sections
- id (serial), sectionKey (about, services, gallery, events, joinUs, contact, volunteer)
- title, titleHindi, content, contentHindi, imageUrls
- isActive, order, metadata

### volunteer_applications
- id (serial), fullName, email, phone, address, city
- occupation, skills, availability, message
- status (pending, approved, rejected), adminNotes

### fee_structures
- id (serial), name, nameHindi, level, amount, description, isActive

### membership_cards
- id (serial), membershipId (ref), cardNumber (auto-generated: MC{year}{4-digit})
- memberName, memberPhoto, validFrom, validUntil
- cardImageUrl, isGenerated
- paymentStatus (pending, paid, approved)
- approvedBy (ref admins), approvedAt

### pages (Custom Pages)
- id (serial), slug (unique), title, titleHindi
- content, contentHindi, metaDescription
- isPublished, order

### contact_inquiries
- id (serial), name, email, phone, subject, message
- status (pending, responded, closed)

### volunteer_accounts
- id (serial), email (unique), password (hashed), fullName, phone
- address, city, photoUrl, occupation, skills, availability
- isActive, isApproved, approvedBy (ref admins), approvedAt

### payment_transactions
- id (serial), type (donation, fee, membership)
- name, email, phone, amount, transactionId, paymentMethod, purpose
- status (pending, approved, rejected)
- membershipId (ref), studentId (ref)
- photoUrl, fatherName, address, city, state, pincode, membershipLevel
- adminNotes, approvedBy (ref admins), approvedAt

### team_members (Bilingual)
- id (serial), name, nameHindi, designation, designationHindi
- photoUrl, phone, email, bio, bioHindi
- socialLinks (jsonb), order, isActive

### services (Bilingual)
- id (serial), name, nameHindi, description, descriptionHindi
- iconKey, imageUrl, order, isActive

## Fee Levels
- Village Level: Rs.99
- Block Level: Rs.199
- District Level: Rs.299
- Haryana Level: Rs.399

## Roll Number System
- Classes 1-4: Prefix 100xxx
- Classes 5-8: Prefix 500xxx
- Classes 9-12: Prefix 900xxx

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (provided by Replit)
- `JWT_SECRET` - Secret for JWT token signing

## Running the Application
```bash
npm run dev
```
Server runs on port 5000 serving both frontend and API.

## Database Commands
```bash
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio for database management
```

## Routes
- `/` - Home page
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/students` - Student management
- `/admin/roll-numbers` - Roll number assignment
- `/admin/results` - Results management
- `/admin/admit-cards` - Admit card generation
- `/admin/fees` - Fee management
- `/admin/memberships` - Membership management
- `/admin/volunteers` - Volunteer applications
- `/admin/content` - Content section management
- `/admin/pages` - Custom page management
- `/admin/payments` - Payment configuration (QR/UPI/Bank)
- `/admin/settings` - Admin settings and menu configuration
- `/student/login` - Student login
- `/student/register` - Student registration
- `/student/dashboard` - Student dashboard
