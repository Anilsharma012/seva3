import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Heart, BookOpen, Leaf, Stethoscope, HandHeart, GraduationCap, Send, Phone, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const interestAreas = [
  { id: "education", label: "Education / शिक्षा", icon: BookOpen },
  { id: "health", label: "Health Camps / स्वास्थ्य", icon: Stethoscope },
  { id: "women", label: "Women Empowerment / महिला सशक्तिकरण", icon: Users },
  { id: "environment", label: "Environment / पर्यावरण", icon: Leaf },
  { id: "gk-exam", label: "GK Exam Coordination / प्रतियोगिता", icon: GraduationCap },
  { id: "relief", label: "Relief Work / राहत कार्य", icon: HandHeart },
];

const benefits = [
  {
    icon: Heart,
    title: "Make a Real Difference",
    description: "Directly impact lives of underprivileged children and communities",
  },
  {
    icon: Users,
    title: "Join a Family",
    description: "Be part of 50+ dedicated volunteers across Haryana",
  },
  {
    icon: GraduationCap,
    title: "Gain Experience",
    description: "Perfect for students seeking internship and field work experience",
  },
];

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    village: "",
    message: "",
    interests: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interestId]
        : prev.interests.filter((id) => id !== interestId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/public/volunteer-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          address: formData.village,
          skills: formData.interests.join(", "),
          message: formData.message,
        }),
      });
      
      if (res.ok) {
        setIsSubmitted(true);
        toast.success("धन्यवाद! आपका पंजीकरण सफल रहा। हम जल्द ही आपसे संपर्क करेंगे।");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          village: "",
          message: "",
          interests: [],
        });
      } else {
        const data = await res.json();
        toast.error(data.error || "Application submission failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Join Us / हमसे जुड़ें
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Become a <span className="text-primary">Volunteer</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              समाज सेवा में हमारे साथ जुड़ें और बदलाव का हिस्सा बनें। चाहे आप छात्र हों या पेशेवर, 
              हर कोई अपने तरीके से योगदान दे सकता है।
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Join us in serving society and be a part of positive change. Whether you're a student 
              or professional, everyone can contribute in their own way.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Volunteer Registration Form
              </h2>
              <p className="text-muted-foreground">
                स्वयंसेवक पंजीकरण फॉर्म भरें / Fill the volunteer registration form
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-card space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name / पूरा नाम *
                  </label>
                  <Input
                    type="text"
                    placeholder="आपका नाम"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mobile Number / मोबाइल नंबर *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address / ईमेल
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City / शहर *
                  </label>
                  <Input
                    type="text"
                    placeholder="भूना, फतेहाबाद"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Village / गांव (if applicable)
                </label>
                <Input
                  type="text"
                  placeholder="गांव का नाम"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              {/* Interest Areas */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Area of Interest / रुचि का क्षेत्र *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interestAreas.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-primary/5 transition-colors"
                    >
                      <Checkbox
                        id={interest.id}
                        checked={formData.interests.includes(interest.id)}
                        onCheckedChange={(checked) =>
                          handleInterestChange(interest.id, checked as boolean)
                        }
                      />
                      <interest.icon className="h-5 w-5 text-primary" />
                      <label
                        htmlFor={interest.id}
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message / संदेश (Optional)
                </label>
                <Textarea
                  placeholder="कुछ और बताना चाहें तो यहां लिखें..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="bg-background border-border"
                />
              </div>

              {isSubmitted ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>धन्यवाद! आपका आवेदन सफलतापूर्वक जमा हो गया है। हम जल्द ही संपर्क करेंगे।</span>
                </div>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                  {isSubmitting ? "Submitting..." : "Submit Registration / पंजीकरण जमा करें"}
                </Button>
              )}
            </form>

            {/* Contact for queries */}
            <div className="mt-8 text-center p-6 bg-card rounded-xl shadow-card">
              <p className="text-muted-foreground mb-2">
                For any queries, contact us at:
              </p>
              <a
                href="tel:+919812676818"
                className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:underline"
              >
                <Phone className="h-5 w-5" />
                +91 98126 76818
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Internship & Field Work</h2>
          <p className="max-w-2xl mx-auto mb-6 opacity-90">
            छात्रों के लिए विशेष अवसर! हमारे साथ इंटर्नशिप करें और सामाजिक कार्य का अनुभव प्राप्त करें।
            Special opportunity for students! Intern with us and gain hands-on social work experience.
          </p>
          <Button variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
            Learn More About Internships
          </Button>
        </div>
      </section>
    </Layout>
  );
}