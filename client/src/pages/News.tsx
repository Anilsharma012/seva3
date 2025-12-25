import Layout from "@/components/layout/Layout";
import { Calendar, ExternalLink, Newspaper } from "lucide-react";
import educationImage from "@/assets/prize-distribution.jpg";
import healthImage from "@/assets/health-camp.jpg";
import communityImage from "@/assets/community-service.jpg";

const newsItems = [
  {
    id: 1,
    title: "Manav Welfare Distributes Prizes Worth Lakhs to Students",
    excerpt: "In a grand ceremony, over 500 students received prizes for their performance in the annual Haryana GK competition.",
    date: "December 20, 2024",
    image: educationImage,
    source: "Local News",
    category: "Education",
  },
  {
    id: 2,
    title: "Free Health Camp Benefits 300+ Villagers",
    excerpt: "The health camp organized in Gorkhpur village provided free medical checkups and medicines to over 300 residents.",
    date: "December 15, 2024",
    image: healthImage,
    source: "Dainik Bhaskar",
    category: "Health",
  },
  {
    id: 3,
    title: "NGO Plants 1000 Trees in Environmental Drive",
    excerpt: "Volunteers from Manav Welfare Seva Society successfully planted 1000 saplings across multiple villages.",
    date: "November 28, 2024",
    image: communityImage,
    source: "Haryana Today",
    category: "Environment",
  },
  {
    id: 4,
    title: "Blood Donation Camp Collects 100+ Units",
    excerpt: "The quarterly blood donation drive saw enthusiastic participation from youth and community members.",
    date: "November 10, 2024",
    image: healthImage,
    source: "Local News",
    category: "Health",
  },
  {
    id: 5,
    title: "Free Education Center Opens in Badhwana",
    excerpt: "A new free education center was inaugurated to provide quality education to underprivileged children.",
    date: "October 25, 2024",
    image: educationImage,
    source: "Regional Express",
    category: "Education",
  },
  {
    id: 6,
    title: "Society Recognized for Community Service",
    excerpt: "Manav Welfare Seva Society received appreciation from district administration for outstanding community service.",
    date: "October 2, 2024",
    image: communityImage,
    source: "Govt. of Haryana",
    category: "Recognition",
  },
];

const latestUpdates = [
  { date: "Dec 2024", text: "Registration open for Haryana Ko Jano 2025 competition" },
  { date: "Dec 2024", text: "Winter clothes distribution drive completed" },
  { date: "Nov 2024", text: "New batch started for free education classes" },
  { date: "Nov 2024", text: "Partnership with local hospital for health camps" },
  { date: "Oct 2024", text: "Launched online registration portal for students" },
];

export default function News() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              News & Media
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Latest <span className="text-primary">Updates</span> & News
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Stay informed about our latest initiatives, media coverage, and the 
              impact we're making in communities across Haryana.
            </p>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main News */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-primary" />
                News & Media Coverage
              </h2>
              
              <div className="space-y-8">
                {newsItems.map((item) => (
                  <article key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="relative h-48 md:h-full overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                            {item.source}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Latest Updates */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-6 pb-3 border-b border-border">
                  Latest Updates
                </h3>
                <div className="space-y-4">
                  {latestUpdates.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded h-fit whitespace-nowrap">
                        {update.date}
                      </span>
                      <p className="text-sm text-muted-foreground">{update.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-6 pb-3 border-b border-border">
                  Follow Us
                </h3>
                <div className="space-y-3">
                  <a 
                    href="https://www.facebook.com/choudary.sukhvinder" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="text-blue-500 font-bold">f</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Facebook</p>
                      <p className="text-xs text-muted-foreground">@manavwelfare</p>
                    </div>
                  </a>
                  <a 
                    href="https://www.instagram.com/manavwelfaresewasociety" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <span className="text-pink-500 font-bold">📷</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Instagram</p>
                      <p className="text-xs text-muted-foreground">@manavwelfaresewasociety</p>
                    </div>
                  </a>
                  <a 
                    href="https://www.youtube.com/@manavwelfaresewasociety" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-primary/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-red-500 font-bold">▶</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">YouTube</p>
                      <p className="text-xs text-muted-foreground">@manavwelfaresewasociety</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Press Contact */}
              <div className="bg-gradient-warm rounded-2xl p-6 text-primary-foreground">
                <h3 className="text-lg font-semibold mb-3">Press Inquiries</h3>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  For media coverage and press inquiries, please contact us.
                </p>
                <a 
                  href="mailto:press@manavwelfare.org" 
                  className="inline-block bg-card text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-card/90 transition-colors"
                >
                  Contact Press Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
