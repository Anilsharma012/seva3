import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, LogOut, Mail, Phone, MapPin, Loader2, Settings } from "lucide-react";

interface MemberData {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  city?: string;
  membershipNumber: string;
  createdAt?: string;
  address?: string;
}

export default function MemberDashboard() {
  const { user, logout, isMember, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!authLoading && !isMember) {
      navigate("/member/login");
      return;
    }
    
    if (user?.id) {
      fetchMemberData();
    }
  }, [isMember, user, authLoading, navigate]);

  const fetchMemberData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/auth/member/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMember({
          id: data.id || data._id,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          city: data.city,
          membershipNumber: data.membershipNumber,
          createdAt: data.createdAt,
          address: data.address,
        });
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/member/login");
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Member record not found. Please contact admin.</p>
          <Button onClick={handleLogout} className="mt-4">
            Logout
          </Button>
        </div>
      </Layout>
    );
  }

  const sidebarItems = [
    { id: "dashboard", icon: Users, label: "Dashboard", labelHi: "डैशबोर्ड" },
    { id: "settings", icon: Settings, label: "Settings", labelHi: "सेटिंग्स" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="text-center mb-4 pb-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{member.membershipNumber}</p>
                  {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 space-y-6">
            {activeTab === "dashboard" && (
              <>
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Welcome, {member.fullName}!</h1>
                    <p className="text-muted-foreground">Member Dashboard / सदस्य डैशबोर्ड</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Membership No.</p>
                      <p className="text-lg font-bold">{member.membershipNumber}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className="bg-green-500 mt-2">Active</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="text-lg font-bold">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="text-lg font-bold">{member.city || "Not specified"}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="text-primary" />
                      Member Details / सदस्य विवरण
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                        <p className="font-medium text-lg">{member.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </p>
                        <p className="font-medium">{member.email}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </p>
                        <p className="font-medium">{member.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          City
                        </p>
                        <p className="font-medium">{member.city || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {member.address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-blue-600" />
                        Address / पता
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground">{member.address}</p>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">
                      Membership Benefits / सदस्यता लाभ
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                      <li>✓ Access to all society programs and events</li>
                      <li>✓ समाज के सभी कार्यक्रमों तक पहुंच</li>
                      <li>✓ Regular updates and newsletters</li>
                      <li>✓ नियमित अपडेट और समाचार पत्र</li>
                      <li>✓ Participation in community service activities</li>
                      <li>✓ सामुदायिक सेवा गतिविधियों में भागीदारी</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="text-blue-600" />
                    Settings / सेटिंग्स
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium mb-2">Account Security / खाता सुरक्षा</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      अपने खाते को सुरक्षित रखने के लिए अपना पासवर्ड नियमित रूप से बदलें।
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/member/forgot-password")}
                    >
                      Change Password / पासवर्ड बदलें
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
