import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, CreditCard, Building, QrCode, CheckCircle, Shield, Award, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaymentConfig {
  _id: string;
  type: string;
  name: string;
  nameHindi?: string;
  qrCodeUrl?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  isActive: boolean;
}

const impactItems = [
  { amount: "500", impact: "Educate 1 child for a month" },
  { amount: "2,000", impact: "Provide school supplies for 10 children" },
  { amount: "5,000", impact: "Sponsor a health camp for 50 people" },
  { amount: "10,000", impact: "Plant 100 trees" },
  { amount: "25,000", impact: "Support a child's education for a year" },
];

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentConfigs();
  }, []);

  const fetchPaymentConfigs = async () => {
    try {
      const res = await fetch("/api/public/payment-config/donation");
      if (res.ok) {
        const data = await res.json();
        setPaymentConfigs(data);
      }
    } catch (error) {
      console.error("Error fetching payment configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = () => {
    if (!amount || parseInt(amount) < 100) {
      toast({ title: "Error", description: "Please enter a valid amount (minimum Rs.100)", variant: "destructive" });
      return;
    }
    toast({ title: "Thank you!", description: "Please complete payment using the methods shown below." });
  };

  const donationConfig = paymentConfigs[0];
  const hasQR = donationConfig?.qrCodeUrl;
  const hasUPI = donationConfig?.upiId;
  const hasBank = donationConfig?.bankName;

  return (
    <Layout>
      <section className="relative py-24 bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">Every Rupee Makes a Difference</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Donate to <span className="text-primary">Transform Lives</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your contribution helps us provide free education, organize health camps, 
              and support communities in need. Join us in making a lasting impact.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-card rounded-3xl p-8 shadow-elevated">
              <h2 className="text-2xl font-bold text-foreground mb-6">Make a Donation</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["500", "1000", "2000", "5000", "10000", "25000"].map((value) => (
                    <button
                      key={value}
                      onClick={() => setAmount(value)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        amount === value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-primary/10"
                      }`}
                      data-testid={`button-amount-${value}`}
                    >
                      Rs.{parseInt(value).toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rs.</span>
                  <Input
                    type="number"
                    placeholder="Enter custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 bg-muted border-border"
                    data-testid="input-custom-amount"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Payment Method
                </label>
                <div className="space-y-3">
                  {hasUPI && (
                    <button
                      onClick={() => setSelectedMethod("upi")}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        selectedMethod === "upi"
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted border-2 border-transparent hover:border-primary/30"
                      }`}
                      data-testid="button-method-upi"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === "upi" ? "bg-primary text-primary-foreground" : "bg-card"
                      }`}>
                        <QrCode className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">UPI / QR Code</p>
                        <p className="text-sm text-muted-foreground">Scan and pay instantly</p>
                      </div>
                    </button>
                  )}
                  {hasBank && (
                    <button
                      onClick={() => setSelectedMethod("bank")}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        selectedMethod === "bank"
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted border-2 border-transparent hover:border-primary/30"
                      }`}
                      data-testid="button-method-bank"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === "bank" ? "bg-primary text-primary-foreground" : "bg-card"
                      }`}>
                        <Building className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">NEFT / RTGS / IMPS</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : selectedMethod === "upi" && (hasQR || hasUPI) ? (
                <div className="bg-muted rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4 text-center">Scan QR Code to Pay</h3>
                  {hasQR && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={donationConfig.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-64 h-64 object-contain border rounded-lg bg-white p-2"
                        data-testid="img-qr-code"
                      />
                    </div>
                  )}
                  {hasUPI && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Or pay using UPI ID:</p>
                      <p className="font-mono font-bold text-lg text-foreground" data-testid="text-upi-id">{donationConfig.upiId}</p>
                    </div>
                  )}
                </div>
              ) : selectedMethod === "bank" && hasBank ? (
                <div className="bg-muted rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-foreground mb-4">Bank Transfer Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span className="font-medium text-foreground" data-testid="text-account-name">{donationConfig.accountHolderName || "Manav Welfare Seva Society"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium text-foreground" data-testid="text-bank-name">{donationConfig.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account No:</span>
                      <span className="font-medium text-foreground" data-testid="text-account-number">{donationConfig.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IFSC Code:</span>
                      <span className="font-medium text-foreground" data-testid="text-ifsc">{donationConfig.ifscCode}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-6 mb-6 text-center text-muted-foreground">
                  Payment details will be configured by admin soon.
                </div>
              )}

              <Button 
                onClick={handleDonate}
                size="lg" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated"
                data-testid="button-donate"
              >
                <Heart className="h-5 w-5 mr-2" />
                Donate {amount ? `Rs.${parseInt(amount).toLocaleString()}` : "Now"}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  80G Tax Benefit
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Impact</h2>
              <p className="text-muted-foreground mb-8">
                See how your donation can help transform lives and communities.
              </p>

              <div className="space-y-4">
                {impactItems.map((item) => (
                  <div key={item.amount} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-20 text-right">
                      <span className="text-xl font-bold text-primary">Rs.{item.amount}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground">{item.impact}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-sm text-foreground">
                  <strong>80G Tax Benefit:</strong> All donations to Manav Welfare Seva Society 
                  are eligible for tax deduction under Section 80G of the Income Tax Act.
                </p>
              </div>

              <div className="mt-6 bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Founder & President:</strong> Ch. Sukhvinder Bains Bhuna<br />
                  <strong>Director:</strong> Ch. Komal<br />
                  <strong>Contact:</strong> +91 98126 76818
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Donate to Us?</h2>
            <p className="text-muted-foreground mb-8">
              We ensure complete transparency and accountability in the use of your donations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">100% Transparent</h3>
                <p className="text-sm text-muted-foreground">Complete financial transparency with regular updates</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Registered NGO</h3>
                <p className="text-sm text-muted-foreground">Government registered with all valid certifications</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Direct Impact</h3>
                <p className="text-sm text-muted-foreground">Your donation directly reaches those in need</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
