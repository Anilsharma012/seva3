import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Team from "./pages/Team";
import Programs from "./pages/Programs";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import Membership from "./pages/Membership";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentRegistration from "./pages/StudentRegistration";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminRollNumbers from "./pages/admin/AdminRollNumbers";
import AdminResults from "./pages/admin/AdminResults";
import AdminAdmitCards from "./pages/admin/AdminAdmitCards";
import AdminFees from "./pages/admin/AdminFees";
import AdminMemberships from "./pages/admin/AdminMemberships";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminVolunteers from "./pages/admin/AdminVolunteers";
import AdminContent from "./pages/admin/AdminContent";
import AdminPages from "./pages/admin/AdminPages";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminContactInquiries from "./pages/admin/AdminContactInquiries";


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:category" element={<Programs />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/gallery/:category" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/volunteer/login" element={<VolunteerLogin />} />
            <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
            <Route path="/membership" element={<Membership />} />
            {/* Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegistration />} />
            {/* Student Dashboard */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            {/* Admin Dashboard */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/roll-numbers" element={<AdminRollNumbers />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/admit-cards" element={<AdminAdmitCards />} />
            <Route path="/admin/fees" element={<AdminFees />} />
            <Route path="/admin/memberships" element={<AdminMemberships />} />
            <Route path="/admin/volunteers" element={<AdminVolunteers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/pages" element={<AdminPages />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/contact-inquiries" element={<AdminContactInquiries />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
