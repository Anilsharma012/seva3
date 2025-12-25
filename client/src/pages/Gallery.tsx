import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
// Real uploaded images
import newsWatermelon from "@/assets/news-watermelon.jpeg";
import freeEducation from "@/assets/free-education-class.jpeg";
import watermelonDist from "@/assets/watermelon-distribution.jpeg";
import communityReal from "@/assets/community-service-real.jpeg";
import eventCeremony from "@/assets/event-ceremony.jpeg";
import tributeEvent from "@/assets/tribute-event.jpeg";
import educationBanner from "@/assets/education-banner.jpeg";
import chairman from "@/assets/chairman.jpeg";

const categories = [
  { id: "all", label: "All" },
  { id: "events", label: "Events" },
  { id: "health", label: "Health Camps" },
  { id: "environment", label: "Tree Plantation" },
  { id: "news", label: "News Coverage" },
  { id: "education", label: "Education" },
];

const galleryItems = [
  { id: 1, image: newsWatermelon, title: "तरबूज वितरण - समाचार कवरेज", category: "news", date: "2024" },
  { id: 2, image: freeEducation, title: "निशुल्क शिक्षा कक्षा - भूना", category: "education", date: "2024" },
  { id: 3, image: watermelonDist, title: "बच्चों को तरबूज वितरण", category: "events", date: "2024" },
  { id: 4, image: communityReal, title: "समुदाय सेवा कार्यक्रम", category: "events", date: "2024" },
  { id: 5, image: eventCeremony, title: "पुरस्कार वितरण समारोह", category: "events", date: "2024" },
  { id: 6, image: tributeEvent, title: "श्रद्धांजलि कार्यक्रम", category: "events", date: "2024" },
  { id: 7, image: educationBanner, title: "शिक्षा जागरूकता अभियान", category: "education", date: "2024" },
  { id: 8, image: chairman, title: "अध्यक्ष श्री सुखविंदर बेस", category: "events", date: "2024" },
  { id: 9, image: freeEducation, title: "गुरु रविदास धर्मशाला में शिक्षा", category: "education", date: "2023" },
  { id: 10, image: watermelonDist, title: "ईंट भट्टे पर सेवा", category: "events", date: "2023" },
  { id: 11, image: communityReal, title: "सामुदायिक सेवा", category: "events", date: "2023" },
  { id: 12, image: newsWatermelon, title: "पल पल न्यूज में कवरेज", category: "news", date: "2023" },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Photo Gallery
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              सेवा के <span className="text-primary">पल</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              हमारी यात्रा की तस्वीरें - शिक्षा, स्वास्थ्य शिविर, पर्यावरण अभियान और समुदाय सेवा।
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <Tabs defaultValue="all" className="mb-12">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="px-6 py-2 rounded-full border border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div 
                    className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer aspect-square"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-primary-foreground font-semibold text-lg">{item.title}</h3>
                      <p className="text-primary-foreground/80 text-sm">{item.date}</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/90 to-transparent p-6">
                      <h3 className="text-primary-foreground font-semibold text-xl">{item.title}</h3>
                      <p className="text-primary-foreground/80">{item.date}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">इस श्रेणी में कोई फोटो नहीं मिली।</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            और देखना चाहते हैं?
          </h2>
          <p className="text-muted-foreground mb-6">
            नवीनतम अपडेट और फ़ोटो के लिए हमें सोशल मीडिया पर फ़ॉलो करें।
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://www.facebook.com/choudary.sukhvinder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Facebook
            </a>
            <a 
              href="https://www.instagram.com/manavwelfaresewasociety" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
