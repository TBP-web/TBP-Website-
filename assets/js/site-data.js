/**
 * The Bandhan Project (tbp;) - Central CMS Data Store & State Manager
 * Provides client-side real-time persistence with localStorage & storage sync
 */

const TBP_STORAGE_KEY = 'TBP_WEBSITE_DATA_V1';
const TBP_ADMIN_AUTH_KEY = 'TBP_ADMIN_LOGGED_IN';

const DEFAULT_SITE_DATA = {
  brand: {
    name: "The Bandhan Project",
    shortName: "tbp;",
    tagline: "lean into Goodness",
    logo: "assets/images/logo.png",
    favicon: "assets/images/favicon.png",
    themeColor: "#0b3b95"
  },
  hero: {
    title: "Building Bonds, Empowering Communities — <span>lean into Goodness</span>",
    subtitle: "Welcome to The Bandhan Project — an inspiring initiative founded by Harsh Bhayani dedicated to meaningful connections, impactful community drives, networking summits, and youth empowerment.",
    buttonText: "Our Mission",
    buttonLink: "#about",
    secondaryButtonText: "Past Events",
    secondaryButtonLink: "#events",
    bgImage: "assets/images/hero-area.jpg"
  },
  about: {
    title: "About The Bandhan Project",
    subtitle: "Bridging Communities Through <span>Action & Empathy</span>",
    desc: "The Bandhan Project (tbp;) is a mission-driven movement committed to fostering deep societal bonds, community empowerment, and purposeful engagement. We create spaces and platforms where leaders, innovators, and changemakers unite to lean into Goodness and spark sustainable, positive change.",
    buttonText: "Connect With Us",
    buttonLink: "#contact",
    image: "assets/images/about_image.jpg",
    visionTitle: "Our Vision",
    vision: "A connected society where individuals, youth leaders, and changemakers consistently lean into Goodness — turning empathy into action and everyday relationships into lasting, shared impact.",
    missionTitle: "Our Mission",
    mission: "To build enduring bonds across communities through drives, forums, and collaborative projects that equip young people with the confidence, network, and opportunity to lead change where they live.",
    stats: [
      { count: "1250", label: "Community Members", prefix: "", suffix: "+" },
      { count: "48", label: "Projects & Drives", prefix: "", suffix: "+" },
      { count: "18", label: "Partner Chapters", prefix: "", suffix: "+" },
      { count: "100", label: "Impact Driven", prefix: "", suffix: "%" }
    ]
  },
  yknot: {
    active: true,
    badge: "Our First Impact Project",
    title: "yKnot",
    subtitle: "Say “why knot?” — and turn possibility into action.",
    description: "yKnot is The Bandhan Project's first impact venture — a lifestyle brand built around one simple, powerful question: “why knot?” It nudges people to let go of fear and hesitation and to embrace new ideas, new opportunities, and the things that bring them genuine joy.\n\nInspired by the strength and intricacy of the Monkey's Fist knot, yKnot stands for resilience, balance, and the belief that anything is possible. Every purchase helps fund our work to foster human connection and inspire positive action.",
    image: "assets/images/about_image.jpg",
    buttonText: "Visit the yKnot Store",
    buttonLink: "https://www.yknotstore.com"
  },
  events: [
    {
      id: "evt_1",
      title: "Annual Youth Leadership & Impact Summit",
      category: "Summit",
      date: "October 18, 2025",
      time: "Full Day Conclave",
      location: "Main Auditorium & Hybrid Stream",
      description: "A landmark gathering bringing together passionate youth changemakers, mentors, and community innovators. The summit featured interactive keynotes, panel discussions on social entrepreneurship, and hands-on collaborative problem-solving workshops.",
      images: [
        "assets/images/hero-area.jpg",
        "assets/images/blog-1.jpg",
        "assets/images/blog-2.jpg",
        "assets/images/blog-3.jpg"
      ],
      active: true
    },
    {
      id: "evt_2",
      title: "Community Outreach & Skill Exchange Workshop",
      category: "Workshop",
      date: "November 05, 2025",
      time: "Afternoon Session",
      location: "Innovation Hub, Hall B",
      description: "An impactful grassroots initiative focused on practical skill building, digital literacy, and peer-to-peer mentoring. Over 150 participants collaborated on real-world projects and community action plans.",
      images: [
        "assets/images/blog-1.jpg",
        "assets/images/blog-2.jpg",
        "assets/images/about_image.jpg",
        "assets/images/hero-area.jpg"
      ],
      active: true
    },
    {
      id: "evt_3",
      title: "The Bandhan Networking Mixer & Panel",
      category: "Networking",
      date: "December 12, 2025",
      time: "Evening Conclave",
      location: "Grand Convention Center",
      description: "An inspiring evening dedicated to forging meaningful partnerships across diverse social sectors. Leaders, volunteers, and student chapters connected to share insights and launch new collaborative initiatives.",
      images: [
        "assets/images/blog-2.jpg",
        "assets/images/blog-3.jpg",
        "assets/images/hero-area.jpg",
        "assets/images/blog-1.jpg"
      ],
      active: true
    }
  ],
  founderNote: {
    badge: "A Word from Our Founder",
    title: "Why We Built The Bandhan Project",
    quote: "“When leadership is guided by purpose and we consciously lean into Goodness, every connection becomes a catalyst for positive change.”",
    paragraphs: [
      "As the Director of Coatings and Coatings (India) Pvt. Ltd., my industrial journey has always been anchored in precision, integrity, and building enduring relationships. Over the years, I realized that the true measure of leadership lies not merely in enterprise growth, but in the positive resonance we create within our communities.",
      "The Bandhan Project (tbp;) was born out of a deep calling to bridge societal divides and ignite purposeful collaboration. We believe that when individuals, youth leaders, and changemakers unite under a shared ethos to 'lean into Goodness', collective action can dismantle barriers and uplift lives.",
      "Every summit, workshop, and grassroots drive we organize is a puzzle piece connecting hearts and minds. Thank you for joining hands with us on this transformative mission."
    ],
    founderName: "Harsh Bhayani",
    founderTitle: "Director, Coatings and Coatings (India) Pvt. Ltd. | Founder, The Bandhan Project",
    founderImage: "assets/images/about_image.jpg"
  },
  gallery: [
    {
      id: "gal_1",
      title: "Community Youth Drive",
      subtitle: "Empowering Next-Gen Leaders",
      image: "assets/images/blog-1.jpg"
    },
    {
      id: "gal_2",
      title: "Collaborative Workshop",
      subtitle: "Skill Sharing & Learning",
      image: "assets/images/blog-2.jpg"
    },
    {
      id: "gal_3",
      title: "Impact Conclave",
      subtitle: "Networking & Keynotes",
      image: "assets/images/blog-3.jpg"
    }
  ],
  contact: {
    title: "Get in Touch",
    subtitle: "Have questions, want to partner with us, or learn about our initiatives? Send us a message!",
    email: "contact@thebandhanproject.org",
    phone: "+91 98765 43210",
    address: "The Bandhan Project Headquarters",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com"
  },
  footer: {
    aboutText: "The Bandhan Project (tbp;) — Founded by Harsh Bhayani. Dedicated to creating lasting community bonds, leadership forums, impactful social initiatives, and inspiring communities to lean into Goodness.",
    copyright: "© 2026 The Bandhan Project (tbp;). All Rights Reserved."
  },
  admin: {
    password: "admin123"
  }
};

class SiteDataManager {
  constructor() {
    this.initData();
    this.setupListeners();
  }

  initData() {
    try {
      const stored = localStorage.getItem(TBP_STORAGE_KEY);
      if (!stored) {
        this.saveData(DEFAULT_SITE_DATA, false);
      }
    } catch (e) {
      console.warn('localStorage not accessible, using default memory state', e);
    }
  }

  getData() {
    try {
      const stored = localStorage.getItem(TBP_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SITE_DATA,
          ...parsed,
          brand: { ...DEFAULT_SITE_DATA.brand, ...(parsed.brand || {}) },
          hero: { ...DEFAULT_SITE_DATA.hero, ...(parsed.hero || {}) },
          about: { ...DEFAULT_SITE_DATA.about, ...(parsed.about || {}) },
          yknot: { ...DEFAULT_SITE_DATA.yknot, ...(parsed.yknot || {}) },
          events: Array.isArray(parsed.events) && parsed.events.length > 0 ? parsed.events : DEFAULT_SITE_DATA.events,
          founderNote: { ...DEFAULT_SITE_DATA.founderNote, ...(parsed.founderNote || {}) },
          contact: { ...DEFAULT_SITE_DATA.contact, ...(parsed.contact || {}) },
          footer: { ...DEFAULT_SITE_DATA.footer, ...(parsed.footer || {}) },
          admin: { ...DEFAULT_SITE_DATA.admin, ...(parsed.admin || {}) }
        };
      }
    } catch (e) {
      console.error('Error reading site data', e);
    }
    return DEFAULT_SITE_DATA;
  }

  saveData(data, notify = true) {
    try {
      localStorage.setItem(TBP_STORAGE_KEY, JSON.stringify(data));
      if (notify) {
        window.dispatchEvent(new CustomEvent('tbp_data_updated', { detail: data }));
      }
      return { success: true };
    } catch (e) {
      console.error('Error saving site data to localStorage', e);
      return { success: false, error: e.message };
    }
  }

  resetToDefault() {
    this.saveData(DEFAULT_SITE_DATA, true);
    return DEFAULT_SITE_DATA;
  }

  exportDataJson() {
    const data = this.getData();
    return JSON.stringify(data, null, 2);
  }

  importDataJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.saveData(parsed, true);
        return { success: true };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  isAdminAuthenticated() {
    return sessionStorage.getItem(TBP_ADMIN_AUTH_KEY) === 'true';
  }

  loginAdmin(enteredPassword) {
    const data = this.getData();
    const correctPassword = data.admin?.password || 'admin123';
    if (enteredPassword === correctPassword) {
      sessionStorage.setItem(TBP_ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logoutAdmin() {
    sessionStorage.removeItem(TBP_ADMIN_AUTH_KEY);
  }

  setAdminPassword(newPassword) {
    const data = this.getData();
    data.admin = data.admin || {};
    data.admin.password = newPassword;
    this.saveData(data);
  }

  setupListeners() {
    window.addEventListener('storage', (event) => {
      if (event.key === TBP_STORAGE_KEY) {
        window.dispatchEvent(new CustomEvent('tbp_data_updated', {
          detail: this.getData()
        }));
      }
    });
  }
}

// Global instance
window.TBP_DATA = new SiteDataManager();
