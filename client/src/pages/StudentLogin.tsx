import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isStudent, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && isStudent) {
      navigate("/student/dashboard");
    }
  }, [isStudent, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password, "student");
    
    if (result.success) {
      toast({
        title: "सफल लॉगिन",
        description: "Student Dashboard में आपका स्वागत है!",
      });
    } else {
      toast({
        title: "लॉगिन विफल",
        description: result.error || "गलत Email या Password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-elevated">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-4 border-secondary/20">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="h-6 w-6 text-secondary" />
              <CardTitle className="text-2xl">Student Login</CardTitle>
            </div>
            <CardDescription>
              मानव वेलफेयर सेवा सोसायटी - छात्र पोर्टल
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / ईमेल</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password / पासवर्ड</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login / लॉगिन करें"}
              </Button>
            </form>
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                अभी तक रजिस्टर नहीं हुए?
              </p>
              <Link to="/student/register">
                <Button variant="outline" className="w-full">
                  New Registration / नया रजिस्ट्रेशन
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
