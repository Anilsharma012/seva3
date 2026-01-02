import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "student" | "member" | null;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, type?: "admin" | "student" | "member") => Promise<{ success: boolean; error?: string }>;
  signup: (data: StudentRegistrationData | MemberRegistrationData) => Promise<{ success: boolean; error?: string; registrationNumber?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
  isMember: boolean;
  forgotPassword: (email: string, type: "student" | "member") => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string, type: "student" | "member") => Promise<{ success: boolean; error?: string }>;
}

interface MemberRegistrationData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city?: string;
}

interface StudentRegistrationData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  address?: string;
  city?: string;
  pincode?: string;
  dateOfBirth?: string;
  gender?: string;
  class: string;
  feeLevel?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data._id || data.id,
          email: data.email,
          role: data.role,
          name: data.name || data.fullName,
        });
      } else {
        localStorage.removeItem("auth_token");
        setToken(null);
      }
    } catch {
      localStorage.removeItem("auth_token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, type: "admin" | "student" | "member" = "student"): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const endpoints: Record<string, string> = {
        admin: "/api/auth/admin/login",
        student: "/api/auth/student/login",
        member: "/api/auth/member/login",
      };
      const endpoint = endpoints[type] || endpoints.student;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || "Login failed" };
      }

      localStorage.setItem("auth_token", data.token);
      setToken(data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
      });
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Network error" };
    }
  };

  const signup = async (data: StudentRegistrationData | MemberRegistrationData): Promise<{ success: boolean; error?: string; registrationNumber?: string }> => {
    setIsLoading(true);
    try {
      const isMember = 'city' in data && !('class' in data);
      const endpoint = isMember ? "/api/auth/member/register" : "/api/auth/student/register";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || "Registration failed" };
      }

      localStorage.setItem("auth_token", result.token);
      setToken(result.token);
      setUser({
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
      });
      setIsLoading(false);
      return { success: true, registrationNumber: result.registrationNumber };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
