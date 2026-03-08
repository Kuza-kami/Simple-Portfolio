import { Project } from '../types';

export const moreProjects: Project[] = [
  {
    id: 16,
    title: "Project Pi",
    category: "Textile",
    year: "2022",
    image: "https://picsum.photos/seed/pi/800/1300",
    description: "Fitness tracking application.",
    extendedDescription: "A comprehensive fitness tracking application designed to help users monitor their health goals.",
    size: "Mobile App",
    medium: "Figma / React Native",
    process: [
      { image: "https://picsum.photos/seed/pi1/800/600", description: "Initial wireframes" },
      { image: "https://picsum.photos/seed/pi2/800/600", description: "High-fidelity mockups" }
    ]
  },
  {
    id: 17,
    title: "Project Rho",
    category: "Design",
    year: "2023",
    image: "https://picsum.photos/seed/rho/800/800",
    description: "Restaurant branding and menus.",
    extendedDescription: "Complete branding package for a modern fusion restaurant, including logo, menus, and signage.",
    size: "Brand Identity",
    medium: "Illustrator / Photoshop",
    process: [
      { image: "https://picsum.photos/seed/rho1/800/600", description: "Logo concepts" },
      { image: "https://picsum.photos/seed/rho2/800/600", description: "Menu layout design" }
    ]
  },
  {
    id: 18,
    title: "Project Sigma",
    category: "Sketches",
    year: "2024",
    image: "https://picsum.photos/seed/sigma/800/1100",
    description: "SaaS dashboard interface.",
    extendedDescription: "User interface design for a complex SaaS analytics dashboard.",
    size: "Desktop UI",
    medium: "Figma",
    process: [
      { image: "https://picsum.photos/seed/sigma1/800/600", description: "User flow diagrams" },
      { image: "https://picsum.photos/seed/sigma2/800/600", description: "Component library" }
    ]
  },
  {
    id: 19,
    title: "Project Tau",
    category: "Textile",
    year: "2022",
    image: "https://picsum.photos/seed/tau/800/600",
    description: "Annual report design.",
    extendedDescription: "Layout and data visualization for a corporate annual report.",
    size: "Print / A4",
    medium: "InDesign",
    process: [
      { image: "https://picsum.photos/seed/tau1/800/600", description: "Data visualization sketches" },
      { image: "https://picsum.photos/seed/tau2/800/600", description: "Print proofing" }
    ]
  },
  {
    id: 20,
    title: "Project Upsilon",
    category: "Textile",
    year: "2024",
    image: "https://picsum.photos/seed/upsilon/800/1500",
    description: "Boutique hotel identity.",
    extendedDescription: "Visual identity system for a luxury boutique hotel.",
    size: "Brand System",
    medium: "Mixed Media",
    process: [
      { image: "https://picsum.photos/seed/upsilon1/800/600", description: "Moodboard and texture exploration" },
      { image: "https://picsum.photos/seed/upsilon2/800/600", description: "Stationery design" }
    ]
  },
  {
    id: 21,
    title: "Project Phi",
    category: "Design",
    year: "2023",
    image: "https://picsum.photos/seed/phi/800/900",
    description: "Social media app concept.",
    extendedDescription: "Conceptual design for a new social media platform focused on privacy.",
    size: "Mobile App",
    medium: "Figma",
    process: [
      { image: "https://picsum.photos/seed/phi1/800/600", description: "Privacy-focused UX research" },
      { image: "https://picsum.photos/seed/phi2/800/600", description: "Interface prototyping" }
    ]
  },
  {
    id: 22,
    title: "Project Chi",
    category: "Sketches",
    year: "2022",
    image: "https://picsum.photos/seed/chi/800/1200",
    description: "Real estate platform.",
    extendedDescription: "Web platform design for real estate listings and virtual tours.",
    size: "Web Platform",
    medium: "Figma / React",
    process: [
      { image: "https://picsum.photos/seed/chi1/800/600", description: "Property search filtering logic" },
      { image: "https://picsum.photos/seed/chi2/800/600", description: "Virtual tour viewer interface" }
    ]
  },
  {
    id: 23,
    title: "Project Psi",
    category: "Digital Art",
    year: "2024",
    image: "https://picsum.photos/seed/psi/800/700",
    description: "Magazine editorial layout.",
    extendedDescription: "Editorial design for a fashion and lifestyle magazine.",
    size: "Print / Magazine",
    medium: "InDesign / Photoshop",
    process: [
      { image: "https://picsum.photos/seed/psi1/800/600", description: "Typography selection" },
      { image: "https://picsum.photos/seed/psi2/800/600", description: "Photo editing and layout" }
    ]
  },
  {
    id: 24,
    title: "Project Omega",
    category: "Textile",
    year: "2023",
    image: "https://picsum.photos/seed/omega/800/1000",
    description: "Tech startup visual identity.",
    extendedDescription: "Branding and visual language for an AI technology startup.",
    size: "Brand Identity",
    medium: "Vector / SVG",
    process: [
      { image: "https://picsum.photos/seed/omega1/800/600", description: "Logo iteration" },
      { image: "https://picsum.photos/seed/omega2/800/600", description: "Brand guidelines creation" }
    ]
  },
  {
    id: 25,
    title: "Project Alpha 2",
    category: "Design",
    year: "2024",
    image: "https://picsum.photos/seed/alpha2/800/1400",
    description: "E-commerce mobile app.",
    extendedDescription: "Mobile shopping experience design for a fashion retailer.",
    size: "Mobile App",
    medium: "Figma",
    process: [
      { image: "https://picsum.photos/seed/alpha2-1/800/600", description: "Checkout flow optimization" },
      { image: "https://picsum.photos/seed/alpha2-2/800/600", description: "Product discovery interface" }
    ]
  }
];

export const getProjectDetails = (project: Project) => {
  return {
    measurement: project.size || 'Unknown',
    concept: project.challenge ? 'Problem/Solution' : 'Creative Concept',
    media: project.medium || project.category || 'Digital'
  };
};
