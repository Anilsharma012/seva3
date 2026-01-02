import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, CheckCircle, Copy } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export default function MemberRegistration() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [registrationData, setRegistrationData] = useState<{ email: string; membershipNumber: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    memberName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "Haryana",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.memberName || !formData.email || !formData.password || !formData.phone) {
      toast({
        title: "कृपया सभी जानकारी भरें",
        description: "सभी आवश्यक फ़ील्ड भरें",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password बहुत छोटा है",
        description: "कम से कम 6 अक्षर होने चाहिए",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password मेल नहीं खाते",
        description: "दोनों पासवर्ड एक जैसे होने चाहिए",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.memberName,
        phone: formData.phone,
        city: formData.city,
      });

      if (result.success) {
        setRegistrationData({
          email: formData.email,
          membershipNumber: result.registrationNumber || "",
        });

        toast({
          title: "रजिस्ट्रेशन सफल!",
          description: "आपका रजिस्ट्रेशन पूरा हो गया है।",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "रजिस्ट्रेशन विफल",
        description: error.message || "कुछ गलत हो गया",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Clipboard में कॉपी हो गया" });
  };

  if (registrationData) {
    return (
      <Layout>
        <div className="min-h-[80vh] py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elevated">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Registration Successful!</CardTitle>
                <CardDescription>आपका रजिस्ट्रेशन सफलतापूर्वक हो गया है</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-6 rounded-lg space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Membership Number</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold">{registrationData.membershipNumber}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(registrationData.membershipNumber)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email / ईमेल</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold">{registrationData.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(registrationData.email)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    आपने जो password दिया था वही use करें login के लिए
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <strong>Important / महत्वपूर्ण:</strong> कृपया अपना Email और Password सुरक्षित रखें।
                    आप इनका उपयोग Member Portal में Login करने के लिए करेंगे।
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
                    Home / होम
                  </Button>
                  <Button onClick={() => navigate("/member/dashboard")} className="flex-1 bg-primary">
                    Go to Dashboard / डैशबोर्ड पर जाएं
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 mb-4">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Member Registration
            </h1>
            <p className="text-muted-foreground mt-2">सदस्य रजिस्ट्रेशन फॉर्म</p>
          </div>

          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Member Details / सदस्य जानकारी</CardTitle>
              <CardDescription>कृपया सभी जानकारी सही-सही भरें</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Member Name / सदस्य का नाम *</Label>
                    <Input
                      id="memberName"
                      name="memberName"
                      value={formData.memberName}
                      onChange={handleChange}
                      placeholder="सदस्य का पूरा नाम"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email / ईमेल *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password / पासवर्ड *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="कम से कम 6 अक्षर"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password / पासवर्ड की पुष्टि करें *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="पासवर्ड फिर से दर्ज करें"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number / मोबाइल नंबर *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10 अंकों का नंबर"
                      maxLength={10}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / शहर</Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                      <option value="Haryana">Haryana / हरियाणा</option>
                      <option value="Delhi">Delhi / दिल्ली</option>
                      <option value="Punjab">Punjab / पंजाब</option>
                      <option value="Himachal">Himachal Pradesh / हिमाचल प्रदेश</option>
                      <option value="Other">Other / अन्य</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address / पता</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="आपका पूरा पता"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Register / रजिस्टर करें"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
