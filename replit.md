# Manav Welfare Seva Society - NGO Education Management System

## Overview
This is a full-stack education management system for Manav Welfare Seva Society, an NGO providing free education to underprivileged children in Haryana, India. The system manages student registrations, roll numbers, admit cards, results, memberships, and features separate admin and student dashboards.

## Default Credentials
- **Admin Login**: admin@mwss.org / Admin@123
- **Demo Student Login**: student@mwss.org / Student@123

## Recent Changes
- **December 2024**: Migrated from Supabase/PostgreSQL to MongoDB Atlas
- All frontend pages updated to use REST API endpoints instead of Supabase client
- JWT-based authentication implemented with role-based access control
- Replaced Supabase AuthContext with custom authentication using localStorage
- Added database-driven admin sidebar menu (MenuItem schema)
- Added configurable admin settings/feature toggles (AdminSetting schema)
- Admin can now manage menu items and settings from Settings page
- Menu changes reflect immediately via React Query cache invalidation
- Added Payment Configuration management (QR codes, UPI IDs, bank details)
- Added Content Section management (About Us, Services, Gallery, Events, Join Us, Contact)
- Added Volunteer Application management with status tracking
- Added Fee Structure management with configurable levels
- Added Membership Card generation with payment approval workflow
- Added Custom Page management for dynamic pages
- Added Bulk Roll Number generation
- Added Bulk Results upload with CSV support
- **December 22, 2024**: Fixed critical frontend-backend integration issues
  - Fixed apiRequest to include Authorization header for all mutations (resolved 401 errors)
  - Fixed App.tsx to use configured queryClient with auth headers for all queries
  - Contact form now submits to backend with loading/success states
  - Volunteer form now submits to backend with proper field mapping
  - Added ContactInquiry model and API endpoints for contact submissions
  - Created Admin Contact Inquiries management page (/admin/contact-inquiries)

## Tech Stack
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: MongoDB Atlas (Mongoose ODM)
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
  models/           # Mongoose schemas (Admin, Student, Result, AdmitCard, Membership)
  routes.ts         # Express API routes
  middleware/       # Auth middleware
  db.ts             # MongoDB connection
  index.ts          # Server entry point
shared/
  schema.ts         # Shared types (legacy Drizzle schemas)
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

## Database Schema (MongoDB)

### Student
- email, password (hashed), fullName, fatherName, motherName
- phone, address, city, dateOfBirth, gender
- registrationNumber (auto-generated: MWSS{year}{4-digit})
- class, rollNumber, feeLevel, feeAmount, feePaid

### Admin
- email, password (hashed), name

### Result
- studentId (ref), examName, resultDate, totalMarks, marksObtained, grade, rank

### AdmitCard
- studentId (ref), examName, fileUrl, fileName

### Membership
- memberName, memberPhone, memberEmail, memberAddress
- membershipType, membershipNumber, isActive, validFrom, validUntil

### MenuItem (Admin Configuration)
- title, titleHindi, path, iconKey, order, isActive, group
- Used to dynamically populate admin sidebar menu

### AdminSetting (Feature Toggles)
- key (unique), label, value, category, type, options
- Categories: general, fees, registration, exams, notifications
- Used to configure feature toggles and settings

### PaymentConfig
- type (donation, fee, membership, general)
- name, nameHindi, qrCodeUrl, upiId
- bankName, accountNumber, ifscCode, accountHolderName
- isActive, order

### ContentSection
- sectionKey (about, services, gallery, events, joinUs, contact, volunteer)
- title, titleHindi, content, contentHindi, imageUrls
- isActive, order, metadata

### VolunteerApplication
- fullName, email, phone, address, city
- occupation, skills, availability, message
- status (pending, approved, rejected), adminNotes

### FeeStructure
- name, nameHindi, level, amount, description, isActive

### MembershipCard
- membershipId (ref), cardNumber (auto-generated: MC{year}{4-digit})
- memberName, memberPhoto, validFrom, validUntil
- cardImageUrl, isGenerated
- paymentStatus (pending, paid, approved)
- approvedBy (ref Admin), approvedAt

### Page (Custom Pages)
- slug (unique), title, titleHindi
- content, contentHindi, metaDescription
- isPublished, order

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
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT token signing

## Running the Application
```bash
npm run dev
```
Server runs on port 5000 serving both frontend and API.

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
