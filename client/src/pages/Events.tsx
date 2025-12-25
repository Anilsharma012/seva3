import Layout from "@/components/layout/Layout";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import educationImage from "@/assets/prize-distribution.jpg";
import healthImage from "@/assets/health-camp.jpg";
import treeImage from "@/assets/tree-plantation.jpg";

const upcomingEvents = [
  {
    id: 1,
    title: "Haryana Ko Jano Competition 2025",
    description: "Annual GK competition for students with prizes worth lakhs of rupees.",
    date: "15 January 2025",
    time: "10:00 AM",
    location: "Badhwana, Charkhi Dadri",
    image: educationImage,
    category: "Competition",
  },
  {
    id: 2,
    title: "Free Health Checkup Camp",
    description: "Free medical checkups, blood tests, and medicine distribution for villagers.",
    date: "25 January 2025",
    time: "9:00 AM - 4:00 PM",
    location: "Village Gorkhpur",
    image: healthImage,
    category: "Health",
  },
  {
    id: 3,
    title: "Tree Plantation Drive",
    description: "Join us in planting 1000 trees for a greener future.",
    date: "5 February 2025",
    time: "7:00 AM",
    location: "Multiple Villages",
    image: treeImage,
    category: "Environment",
  },
];

const pastEvents = [
  {
    id: 4,
    title: "Annual Prize Distribution",
    description: "Celebrated student achievements with certificates and prizes.",
    date: "20 December 2024",
    location: "Badhwana",
    image: educationImage,
    attendees: "500+",
  },
  {
    id: 5,
    title: "Blood Donation Camp",
    description: "Successfully collected 100+ units of blood for local hospitals.",
    date: "10 December 2024",
    location: "Charkhi Dadri",
    image: healthImage,
    attendees: "150+",
  },
  {
    id: 6,
    title: "Winter Clothes Distribution",
    description: "Distributed blankets and warm clothes to needy families.",
    date: "1 December 2024",
    location: "Multiple Villages",
    image: educationImage,
    attendees: "300+",
  },
];

export default function Events() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-3">
              Events
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Upcoming & Past <span className="text-primary">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Stay updated with our latest events, competitions, health camps, and 
              community initiatives. Join us in making a difference!
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                    Register Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Past Events</h2>
            <Link to="/gallery" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
              View Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-card rounded-2xl overflow-hidden shadow-card group">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-card/90 text-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {event.attendees} Attendees
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-warm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Want to Organize an Event?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Partner with us to organize educational events, health camps, or environmental 
            initiatives in your village or community.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-card text-primary hover:bg-card/90">
              Contact Us
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
