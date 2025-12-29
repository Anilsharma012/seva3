import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Award, Receipt, LogOut, Download, IdCard, Users, Hash, Loader2 } from "lucide-react";

interface StudentData {
  id: number;
  registrationNumber: string;
  class: string;
  rollNumber?: string;
  feeLevel: string;
  feeAmount: number;
  feePaid: boolean;
  fullName: string;
  fatherName?: string;
  phone?: string;
  email?: string;
}

interface ResultData {
  id: number;
  examName: string;
  marksObtained?: number;
  totalMarks: number;
  grade?: string;
  rank?: number;
}

interface AdmitCardData {
  id: number;
  examName: string;
  fileUrl: string;
  fileName: string;
}

interface MembershipCardData {
  id: number;
  cardNumber: string;
  memberName: string;
  memberPhoto?: string;
  validFrom: string;
  validUntil: string;
  paymentStatus: string;
  isGenerated: boolean;
}

interface TransactionData {
  id: number;
  type: string;
  amount: number;
  transactionId: string;
  status: string;
  createdAt: string;
  purpose?: string;
}

export default function StudentDashboard() {
  const { user, logout, isStudent, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [results, setResults] = useState<ResultData[]>([]);
  const [admitCards, setAdmitCards] = useState<AdmitCardData[]>([]);
  const [membershipCard, setMembershipCard] = useState<MembershipCardData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!authLoading && !isStudent) {
      navigate("/student/login");
      return;
    }
    
    if (user?.id) {
      fetchStudentData();
      fetchMembershipCard();
      fetchTransactions();
    }
  }, [isStudent, user, authLoading, navigate]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    
    try {
      const res = await fetch("/api/my-transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        setResults(data.results || []);
        setAdmitCards(data.admitCards || []);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembershipCard = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/my-membership-card", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembershipCard(data);
      }
    } catch (error) {
      console.error("Error fetching membership card:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/student/login");
  };

  const downloadAdmitCard = (card: AdmitCardData) => {
    try {
      const admitData = JSON.parse(card.fileUrl);
      const admitCardHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admit Card - ${student?.fullName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px solid #c00; padding-bottom: 15px; margin-bottom: 20px; }
    .title { color: #c00; font-size: 24px; font-weight: bold; margin: 10px 0; }
    .subtitle { color: #666; font-size: 14px; }
    .admit-title { background: #c00; color: white; padding: 12px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
    .details { display: flex; gap: 30px; margin: 20px 0; }
    .details-left { flex: 1; }
    .row { display: flex; margin: 10px 0; }
    .label { font-weight: bold; width: 160px; }
    .value { flex: 1; }
    .exam-info { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .exam-info h3 { margin: 0 0 10px 0; color: #333; }
    .terms-section { margin-top: 25px; border: 2px solid #c00; padding: 20px; border-radius: 8px; }
    .terms-header { background: #c00; color: white; padding: 10px 15px; margin: -20px -20px 15px -20px; border-radius: 6px 6px 0 0; font-weight: bold; font-size: 16px; }
    .signature { margin-top: 30px; text-align: right; }
    @media print { body { padding: 10px; } .terms-section { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Manav Welfare Seva Society / मानव वेलफेयर सेवा सोसाइटी</div>
    <div class="subtitle">Reg. No: 01215 | Phone: +91 98126 76818 | Bhuna, Haryana</div>
  </div>
  <div class="admit-title">ADMIT CARD / प्रवेश पत्र</div>
  <div class="details">
    <div class="details-left">
      <div class="row"><span class="label">Roll Number / रोल नंबर:</span><span class="value">${student?.rollNumber || 'N/A'}</span></div>
      <div class="row"><span class="label">Registration No / पंजीकरण:</span><span class="value">${student?.registrationNumber}</span></div>
      <div class="row"><span class="label">Student Name / नाम:</span><span class="value">${student?.fullName}</span></div>
      <div class="row"><span class="label">Father's Name / पिता:</span><span class="value">${student?.fatherName || 'N/A'}</span></div>
      <div class="row"><span class="label">Class / कक्षा:</span><span class="value">${student?.class}</span></div>
    </div>
  </div>
  <div class="exam-info">
    <h3>Exam Details / परीक्षा विवरण</h3>
    <div class="row"><span class="label">Exam Name / परीक्षा:</span><span class="value">${admitData?.examName || card.examName}</span></div>
    <div class="row"><span class="label">Date / तारीख:</span><span class="value">${admitData?.examDate || 'To be announced / घोषित किया जाएगा'}</span></div>
    <div class="row"><span class="label">Time / समय:</span><span class="value">${admitData?.examTime || 'To be announced / घोषित किया जाएगा'}</span></div>
    <div class="row"><span class="label">Center / केंद्र:</span><span class="value">${admitData?.examCenter || 'To be announced / घोषित किया जाएगा'}</span></div>
  </div>
  <div class="terms-section">
    <div class="terms-header">Terms & Conditions / नियम एवं शर्तें</div>
    <ol style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.6;">
      <li style="margin-bottom: 6px;">Bring this admit card to the examination center. / यह प्रवेश पत्र परीक्षा केंद्र पर लाएं।</li>
      <li style="margin-bottom: 6px;">Bring a valid photo ID (Aadhar/School ID). / वैध फोटो पहचान पत्र (आधार/स्कूल आईडी) लाएं।</li>
      <li style="margin-bottom: 6px;">Arrive 30 minutes before exam time. / परीक्षा समय से 30 मिनट पहले पहुंचें।</li>
      <li style="margin-bottom: 6px;">Electronic devices are strictly prohibited. / इलेक्ट्रॉनिक उपकरण सख्त वर्जित हैं।</li>
      <li style="margin-bottom: 6px;">No candidate will be allowed after exam starts. / परीक्षा शुरू होने के बाद प्रवेश नहीं मिलेगा।</li>
      <li style="margin-bottom: 6px;">Maintain silence and discipline in exam hall. / परीक्षा हॉल में शांति और अनुशासन बनाए रखें।</li>
      <li style="margin-bottom: 6px;">Use of unfair means will result in disqualification. / अनुचित साधनों का प्रयोग अयोग्यता का कारण बनेगा।</li>
      <li style="margin-bottom: 6px;">Follow all instructions given by invigilators. / निरीक्षकों द्वारा दिए गए सभी निर्देशों का पालन करें।</li>
      <li style="margin-bottom: 6px;">Do not leave exam hall without permission. / बिना अनुमति परीक्षा हॉल न छोड़ें।</li>
      <li style="margin-bottom: 6px;">Society's decision on all matters is final. / सभी मामलों में सोसाइटी का निर्णय अंतिम होगा।</li>
    </ol>
  </div>
  <div class="signature">
    <p>_____________________</p>
    <p>Authorized Signature / अधिकृत हस्ताक्षर</p>
  </div>
</body>
</html>`;
      const blob = new Blob([admitCardHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admit_card_${student?.rollNumber || student?.registrationNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      window.open(card.fileUrl, '_blank');
    }
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

  if (!student) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Student record not found. Please contact admin.</p>
          <Button onClick={handleLogout} className="mt-4" data-testid="button-logout">Logout</Button>
        </div>
      </Layout>
    );
  }

  const sidebarItems = [
    { id: "dashboard", icon: GraduationCap, label: "Dashboard", labelHi: "डैशबोर्ड" },
    { id: "admit-card", icon: IdCard, label: "Admit Card", labelHi: "प्रवेश पत्र" },
    { id: "roll-number", icon: Hash, label: "Roll Number", labelHi: "रोल नंबर" },
    { id: "membership", icon: Users, label: "Membership", labelHi: "सदस्यता" },
    { id: "results", icon: Award, label: "Results", labelHi: "परिणाम" },
    { id: "transactions", icon: Receipt, label: "Transactions", labelHi: "लेनदेन" },
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
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground" data-testid="text-student-name">{student.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{student.registrationNumber}</p>
                  {student.email && <p className="text-xs text-muted-foreground">{student.email}</p>}
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
                      data-testid={`button-nav-${item.id}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
                    data-testid="button-logout"
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
                    <h1 className="text-2xl font-bold" data-testid="text-welcome">Welcome, {student.fullName}!</h1>
                    <p className="text-muted-foreground">Student Dashboard / छात्र डैशबोर्ड</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Registration No.</p>
                      <p className="text-lg font-bold" data-testid="text-registration-number">{student.registrationNumber}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-secondary">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Roll Number</p>
                      <p className="text-lg font-bold" data-testid="text-roll-number">{student.rollNumber || "Not Assigned"}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="text-lg font-bold" data-testid="text-class">{student.class}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Fee Status</p>
                      <Badge variant={student.feePaid ? "default" : "secondary"} className={student.feePaid ? "bg-green-500" : "bg-orange-500"}>
                        {student.feePaid ? "Paid" : "Pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="text-secondary" />
                      Student Details / छात्र विवरण
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{student.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Father's Name</p>
                      <p className="font-medium">{student.fatherName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee Level</p>
                      <p className="font-medium capitalize">{student.feeLevel} Level</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee Amount</p>
                      <p className="font-medium">Rs.{student.feeAmount}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "admit-card" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IdCard className="text-purple-600" />
                    Admit Card / प्रवेश पत्र
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {admitCards.length > 0 ? (
                    <div className="space-y-3">
                      {admitCards.map((card) => (
                        <div key={card._id} className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg" data-testid={`card-admit-${card._id}`}>
                          <div>
                            <p className="font-medium">{card.examName}</p>
                            <p className="text-sm text-muted-foreground">Click to download your admit card</p>
                          </div>
                          <Button onClick={() => downloadAdmitCard(card)} data-testid={`button-download-admit-${card._id}`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <IdCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Admit card not generated yet</p>
                      <p className="text-sm">प्रवेश पत्र अभी उपलब्ध नहीं है</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "roll-number" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="text-blue-600" />
                    Roll Number / रोल नंबर
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {student.rollNumber ? (
                    <div className="text-center py-8">
                      <div className="inline-block bg-primary/10 rounded-2xl p-8">
                        <p className="text-sm text-muted-foreground mb-2">Your Roll Number</p>
                        <p className="text-5xl font-bold text-primary" data-testid="text-roll-number-display">{student.rollNumber}</p>
                      </div>
                      <p className="mt-4 text-muted-foreground">
                        Use this roll number for all exams and official communications.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Roll number not assigned yet</p>
                      <p className="text-sm">रोल नंबर अभी आवंटित नहीं हुआ है</p>
                      <p className="text-sm mt-2">Please ensure your fee is paid and contact admin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "membership" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-green-600" />
                    Membership Card / सदस्यता कार्ड
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {membershipCard && membershipCard.paymentStatus === "approved" ? (
                    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                          {membershipCard.memberPhoto ? (
                            <img src={membershipCard.memberPhoto} alt="Member" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <Users className="h-12 w-12 text-primary" />
                          )}
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-sm text-muted-foreground">Member Name</p>
                          <p className="text-xl font-bold" data-testid="text-member-name">{membershipCard.memberName}</p>
                          <p className="text-sm text-muted-foreground mt-2">Card Number</p>
                          <p className="font-mono font-bold text-primary" data-testid="text-card-number">{membershipCard.cardNumber}</p>
                        </div>
                        <div className="md:ml-auto text-center md:text-right">
                          <p className="text-sm text-muted-foreground">Valid Until</p>
                          <p className="font-bold">{new Date(membershipCard.validUntil).toLocaleDateString()}</p>
                          <Badge className="mt-2 bg-green-500">Active</Badge>
                        </div>
                      </div>
                    </div>
                  ) : membershipCard && membershipCard.paymentStatus === "pending" ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                      <p className="font-medium">Membership Payment Pending</p>
                      <p className="text-sm text-muted-foreground">Your membership will be activated after payment approval.</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No membership card found</p>
                      <p className="text-sm">सदस्यता कार्ड उपलब्ध नहीं है</p>
                      <Button className="mt-4" onClick={() => navigate("/membership")} data-testid="button-get-membership">
                        Get Membership
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "results" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="text-green-600" />
                    Results / परिणाम
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {results.length > 0 ? (
                    <div className="space-y-3">
                      {results.map((r) => (
                        <div key={r.id} className="p-4 bg-muted rounded-lg" data-testid={`card-result-${r.id}`}>
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <p className="font-medium">{r.examName}</p>
                              <p className="text-sm text-muted-foreground">
                                Marks: {r.marksObtained}/{r.totalMarks}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              {r.grade && <Badge variant="secondary">Grade: {r.grade}</Badge>}
                              {r.rank && <Badge variant="outline">Rank: {r.rank}</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No results available yet</p>
                      <p className="text-sm">अभी कोई परिणाम उपलब्ध नहीं है</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "transactions" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="text-blue-600" />
                    Transaction History / लेनदेन इतिहास
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.map((t) => (
                        <div key={t.id} className="p-4 bg-muted rounded-lg" data-testid={`card-transaction-${t.id}`}>
                          <div className="flex flex-wrap justify-between items-center gap-4">
                            <div>
                              <p className="font-medium">{t.purpose || t.type}</p>
                              <p className="text-sm text-muted-foreground">
                                UTR/Transaction ID: <span className="font-mono">{t.transactionId}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold text-primary">Rs.{t.amount}</span>
                              <Badge variant={t.status === 'approved' ? 'default' : t.status === 'pending' ? 'secondary' : 'destructive'}>
                                {t.status === 'approved' ? 'Approved / स्वीकृत' : t.status === 'pending' ? 'Pending / लंबित' : 'Rejected / अस्वीकृत'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm">कोई लेनदेन नहीं मिला</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
