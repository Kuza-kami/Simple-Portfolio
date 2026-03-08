import { Project } from '../types';

export const portfolioProjects: Project[] = [
  {
    id: 1,
    title: "Project Alpha",
    category: "Design",
    year: "2024",
    image: "https://picsum.photos/seed/alpha/800/1200",
    images: [
      "https://picsum.photos/seed/alpha/800/1200",
      "https://picsum.photos/seed/alpha2/800/1200",
      "https://picsum.photos/seed/alpha3/800/1200",
      "https://picsum.photos/seed/alpha4/800/1200"
    ],
    process: [
      {
        image: "https://picsum.photos/seed/alpha/800/1200",
        description: "Initial Concept Sketch",
        size: "21 x 29.7 CM",
        date: "10 Jan 2024",
        medium: "Graphite on Paper"
      },
      {
        image: "https://picsum.photos/seed/alpha2/800/1200",
        description: "Digital Wireframe",
        size: "1920 x 1080 PX",
        date: "15 Jan 2024",
        medium: "Figma Prototype"
      },
      {
        image: "https://picsum.photos/seed/alpha3/800/1200",
        description: "High Fidelity Mockup",
        size: "1920 x 1080 PX",
        date: "20 Jan 2024",
        medium: "Adobe Photoshop"
      },
      {
        image: "https://picsum.photos/seed/alpha4/800/1200",
        description: "Final Brand Assets",
        size: "Various Formats",
        date: "01 Feb 2024",
        medium: "Vector Graphics"
      }
    ],
    description: "A comprehensive branding project.",
    extendedDescription: "This comprehensive branding project aimed to redefine the visual identity of a leading tech startup. The process involved deep market research, competitor analysis, and iterative design sprints. The final output included a versatile logo system, a vibrant color palette, and a comprehensive brand guideline document that ensures consistency across all touchpoints. The design language focuses on clarity, innovation, and human-centric values, resonating with the target audience and establishing a strong market presence.",
    challenge: "The startup faced a crowded market with established competitors. They needed a visual identity that would not only stand out but also communicate their complex technical value proposition in a simple, human-centric way without losing professional credibility.",
    solution: "We developed a 'modular clarity' design system. By breaking down complex concepts into simple geometric forms and pairing them with a vibrant, high-contrast color palette, we created a visual language that feels both cutting-edge and accessible. The new identity system scales seamlessly from mobile app icons to large-scale billboard advertising.",
    technologies: ["Figma", "Adobe Illustrator", "Cinema 4D", "After Effects"]
  },
  {
    id: 2,
    title: "Project Beta",
    category: "Sketches",
    year: "2023",
    image: "https://picsum.photos/seed/beta/800/600",
    images: [
      "https://picsum.photos/seed/beta/800/600",
      "https://picsum.photos/seed/beta2/800/600",
      "https://picsum.photos/seed/beta3/800/600"
    ],
    description: "A modern web application.",
    extendedDescription: "Project Beta represents a modern web application designed to streamline workflow efficiency for remote teams. The interface prioritizes intuitive navigation and minimal cognitive load. Key features include real-time collaboration tools, customizable dashboards, and seamless integration with third-party services. The design process utilized low-fidelity wireframes to high-fidelity prototypes, ensuring every interaction was tested and refined for optimal user experience.",
    challenge: "Remote teams often struggle with fragmented communication and tool fatigue. The challenge was to unify multiple workflow streams into a single, cohesive interface without overwhelming the user with information density.",
    solution: "We implemented a 'context-aware' dashboard that adapts to the user's current task. By using progressive disclosure techniques, we hid complex features until they were needed. The result is a clean, focus-driven interface that reduced task completion time by 40% in user testing.",
    technologies: ["React", "TypeScript", "Node.js", "Socket.io", "Framer Motion"],
    size: "1440 x 900 PX",
    medium: "Web Application"
  },
  {
    id: 3,
    title: "Project Gamma",
    category: "Textile",
    year: "2023",
    image: "https://picsum.photos/seed/gamma/800/1000",
    images: [
      "https://picsum.photos/seed/gamma/800/1000",
      "https://picsum.photos/seed/gamma2/800/1000"
    ],
    description: "Print design for a local magazine.",
    extendedDescription: "This print design project for a local magazine focused on capturing the essence of urban culture through bold typography and experimental layouts. The objective was to create a visual narrative that complements the editorial content while standing out on the newsstand. The use of high-quality paper stock and special printing techniques added a tactile dimension to the reading experience, making it a collector's item for design enthusiasts.",
    challenge: "In a digital-first world, print media must offer a physical experience that screens cannot replicate. The magazine needed to feel like an artifact, not just a container for text.",
    solution: "We utilized experimental grid systems and mixed-media typography to create a dynamic reading rhythm. Special production techniques, including spot UV coating and die-cut pages, were used to add tactile interest and surprise the reader at key moments in the narrative.",
    technologies: ["Adobe InDesign", "Adobe Photoshop", "Print Production", "Typography"],
    size: "21 x 29.7 CM",
    medium: "Print on Paper"
  },
  {
    id: 4,
    title: "Project Delta",
    category: "Textile",
    year: "2024",
    image: "https://picsum.photos/seed/delta/800/800",
    images: [
        "https://picsum.photos/seed/delta/800/800",
        "https://picsum.photos/seed/delta2/800/800",
        "https://picsum.photos/seed/delta3/800/800",
        "https://picsum.photos/seed/delta4/800/800",
        "https://picsum.photos/seed/delta5/800/800"
    ],
    description: "Mobile app UI/UX design.",
    extendedDescription: "The mobile app UI/UX design for Project Delta centers on the fashion industry, connecting independent designers with a global audience. The app features a personalized feed, virtual try-on technology, and a secure checkout process. The aesthetic is chic and minimalist, allowing the fashion pieces to take center stage. User research played a crucial role in shaping the features, ensuring the app addresses the specific needs and pain points of fashion-forward consumers.",
    challenge: "Buying fashion online lacks the tactile assurance of in-store shopping. Users were hesitant to purchase from independent designers due to sizing and fit concerns.",
    solution: "We integrated an AR-based virtual try-on feature and a detailed 'fit profile' system. The UI was stripped back to a monochromatic palette to let the clothing textures and colors pop. Trust signals were embedded throughout the user journey, increasing conversion rates by 25%.",
    technologies: ["SwiftUI", "ARKit", "Figma", "Prototyping"],
    size: "iPhone 15 Pro Max",
    medium: "Interactive Prototype"
  },
  {
    id: 5,
    title: "Project Epsilon",
    category: "Design",
    year: "2022",
    image: "https://picsum.photos/seed/epsilon/800/1400",
    images: [
      "https://picsum.photos/seed/epsilon/800/1400",
      "https://picsum.photos/seed/epsilon2/800/1400",
      "https://picsum.photos/seed/epsilon3/800/1400"
    ],
    description: "E-commerce platform redesign.",
    extendedDescription: "A complete overhaul of a legacy e-commerce platform, focusing on improving conversion rates and user retention. The redesign introduced a streamlined checkout process, personalized product recommendations, and a mobile-first interface. Performance optimization was a key priority, resulting in significantly faster load times and a smoother shopping experience across all devices.",
    challenge: "The legacy platform suffered from a 70% cart abandonment rate due to a complex checkout flow and slow mobile performance.",
    solution: "We redesigned the checkout into a single-page, friction-free experience with guest checkout options. The entire frontend was rebuilt using a headless architecture for sub-second page loads. We also introduced AI-driven product recommendations to increase average order value.",
    technologies: ["Next.js", "Shopify Headless", "Tailwind CSS", "Framer Motion"],
    size: "1920 x 1080 PX",
    medium: "E-Commerce Site"
  },
  {
    id: 6,
    title: "Project Zeta",
    category: "Sketches",
    year: "2024",
    image: "https://picsum.photos/seed/zeta/800/900",
    images: [
      "https://picsum.photos/seed/zeta/800/900",
      "https://picsum.photos/seed/zeta2/800/900",
      "https://picsum.photos/seed/zeta3/800/900"
    ],
    description: "Brand identity for a startup.",
    extendedDescription: "Developing a distinct brand identity for a fintech startup aiming to disrupt the traditional banking sector. The visual language combines stability with innovation, utilizing a bold color palette and geometric typography. The project deliverables included a logo suite, marketing collateral, and a comprehensive design system to guide future product development.",
    challenge: "Fintech brands often look sterile and cold. The client wanted to convey trust and security without appearing boring or traditional.",
    solution: "We chose a deep navy blue as the base for trust, accented with electric lime to signal energy and innovation. The logo uses strong geometric shapes to suggest stability, while the typography adds a human, approachable touch. The result is a brand that feels both safe and exciting.",
    technologies: ["Adobe Illustrator", "Brand Strategy", "Figma", "Motion Graphics"],
    size: "Various Assets",
    medium: "Brand Identity"
  },
  {
    id: 7,
    title: "Project Eta",
    category: "Digital Art",
    year: "2023",
    image: "https://picsum.photos/seed/eta/800/1100",
    images: [
      "https://picsum.photos/seed/eta/800/1100",
      "https://picsum.photos/seed/eta2/800/1100",
      "https://picsum.photos/seed/eta3/800/1100"
    ],
    description: "Exhibition poster series.",
    extendedDescription: "A series of illustrative posters for a contemporary art exhibition. Each piece explores the theme of 'Digital Nature,' blending organic forms with glitch aesthetics. The illustrations were created using a mix of traditional ink drawing and digital painting techniques, resulting in a unique visual style that bridges the gap between the physical and virtual worlds.",
    challenge: "The exhibition theme 'Digital Nature' required a visual representation of the tension between the organic and the artificial.",
    solution: "We created a series of illustrations where hand-drawn botanical elements were digitally corrupted and glitched. This juxtaposition visually communicated the exhibition's core thesis. The posters were printed on metallic paper to further enhance the digital/physical contrast.",
    technologies: ["Procreate", "Adobe Photoshop", "Traditional Ink", "Digital Painting"]
  },
  {
    id: 8,
    title: "Project Theta",
    category: "Textile",
    year: "2024",
    image: "https://picsum.photos/seed/theta/800/700",
    images: [
      "https://picsum.photos/seed/theta/800/700",
      "https://picsum.photos/seed/theta2/800/700",
      "https://picsum.photos/seed/theta3/800/700"
    ],
    description: "Corporate website overhaul.",
    extendedDescription: "Redesigning the corporate website for a global logistics firm. The goal was to modernize their online presence and better communicate their sustainability initiatives. The new site features immersive video backgrounds, interactive data visualizations, and a clean, grid-based layout that reflects the company's commitment to precision and efficiency.",
    challenge: "Logistics is a complex, data-heavy industry. The challenge was to make this data engaging and understandable for a general audience.",
    solution: "We used WebGL data visualizations to turn dry statistics into interactive stories. The user can explore global shipping routes and sustainability metrics in real-time. The site's clean, Swiss-style layout reflects the precision of the logistics industry.",
    technologies: ["Three.js", "React", "GSAP", "Data Visualization"]
  },
  {
    id: 9,
    title: "Project Iota",
    category: "Design",
    year: "2023",
    image: "https://picsum.photos/seed/iota2/800/1200",
    images: [
      "https://picsum.photos/seed/iota2/800/1200",
      "https://picsum.photos/seed/iota3/800/1200",
      "https://picsum.photos/seed/iota4/800/1200"
    ],
    description: "Rebranding for a local coffee shop.",
    extendedDescription: "A warm and inviting rebrand for a beloved local coffee shop. The design draws inspiration from the history of coffee cultivation, featuring botanical illustrations and earthy tones. The project included packaging design for coffee beans, menu layout, and signage, creating a cohesive and welcoming atmosphere for customers.",
    challenge: "The coffee shop was losing customers to trendy chains. They needed to reassert their local, artisanal roots.",
    solution: "We went back to basics, creating a brand identity that celebrates the craft of coffee making. Hand-drawn illustrations of coffee plants and a warm, earthy color palette create a sense of authenticity and warmth. The new packaging became a local favorite, boosting bean sales by 30%.",
    technologies: ["Illustration", "Packaging Design", "Adobe Illustrator", "Brand Storytelling"]
  },
  {
    id: 10,
    title: "Project Kappa",
    category: "Sketches",
    year: "2024",
    image: "https://picsum.photos/seed/kappa2/800/600",
    images: [
      "https://picsum.photos/seed/kappa2/800/600",
      "https://picsum.photos/seed/kappa3/800/600",
      "https://picsum.photos/seed/kappa4/800/600"
    ],
    description: "Fintech mobile application.",
    extendedDescription: "Designing the user interface for a new investment app targeting Gen Z users. The challenge was to make complex financial data accessible and engaging. The solution involved gamified elements, simplified onboarding flows, and a dark mode interface that feels modern and premium. User testing showed a significant increase in engagement and understanding of investment concepts.",
    challenge: "Investment apps are often intimidating for young, first-time investors. The jargon and complex charts can be a barrier to entry.",
    solution: "We gamified the learning process, rewarding users for completing educational modules. The UI uses simple, friendly language and clear data visualizations. A 'dark mode' default gives the app a premium, tech-forward feel that appeals to the target demographic.",
    technologies: ["Figma", "Protopie", "User Testing", "Mobile UI Design"]
  },
  {
    id: 11,
    title: "Project Lambda",
    category: "Textile",
    year: "2022",
    image: "https://picsum.photos/seed/lambda2/800/1000",
    images: [
      "https://picsum.photos/seed/lambda2/800/1000",
      "https://picsum.photos/seed/lambda3/800/1000",
      "https://picsum.photos/seed/lambda4/800/1000"
    ],
    description: "Art gallery exhibition catalog.",
    extendedDescription: "Layout and typography design for a retrospective exhibition catalog. The book features high-quality reproductions of the artist's work, accompanied by critical essays. The design is understated and elegant, allowing the artwork to breathe. Special attention was paid to typography, using a classic serif font for the main text and a contemporary sans-serif for captions and sidebars.",
    challenge: "The catalog needed to present a diverse range of artworks spanning 40 years without feeling cluttered or disjointed.",
    solution: "We established a strict modular grid system that could accommodate various image aspect ratios. A neutral, ample whitespace strategy allows each artwork to stand on its own. The typography is classic and unobtrusive, serving the content rather than competing with it.",
    technologies: ["Editorial Design", "Typography", "Adobe InDesign", "Print"]
  },
  {
    id: 12,
    title: "Project Mu",
    category: "Textile",
    year: "2023",
    image: "https://picsum.photos/seed/mu2/800/800",
    images: [
      "https://picsum.photos/seed/mu2/800/800",
      "https://picsum.photos/seed/mu3/800/800",
      "https://picsum.photos/seed/mu4/800/800"
    ],
    description: "Interactive learning platform.",
    extendedDescription: "Creating the UX/UI for an online learning platform focused on creative skills. The platform features video courses, community forums, and project galleries. The design prioritizes content discovery and community engagement, with a clean and intuitive interface that encourages exploration. The use of vibrant colors and playful icons adds a sense of fun and creativity to the learning experience.",
    challenge: "Online learning can be isolating. The platform needed to foster a sense of community and collaboration among students.",
    solution: "We integrated social features directly into the course interface, allowing students to share work and give feedback in real-time. The 'project gallery' became the heart of the platform, showcasing student work and inspiring others. The vibrant UI encourages exploration and play.",
    technologies: ["React", "Firebase", "Tailwind CSS", "UX Research"]
  },
  {
    id: 13,
    title: "Project Nu",
    category: "Design",
    year: "2024",
    image: "https://picsum.photos/seed/nu2/800/1400",
    images: [
      "https://picsum.photos/seed/nu2/800/1400",
      "https://picsum.photos/seed/nu3/800/1400",
      "https://picsum.photos/seed/nu4/800/1400"
    ],
    description: "Sustainable fashion brand identity.",
    extendedDescription: "Branding for a new fashion label dedicated to sustainability and ethical production. The visual identity reflects these values through the use of natural colors, organic textures, and minimalist typography. The project included logo design, packaging, and a lookbook that highlights the brand's commitment to environmental responsibility.",
    challenge: "Sustainable fashion often looks 'crunchy' or low-end. The brand wanted to position itself as a luxury, high-fashion alternative.",
    solution: "We combined raw, organic textures with high-end, minimalist typography. The color palette is derived from natural dyes but applied in a sophisticated, monochromatic way. The packaging is 100% compostable but feels premium to the touch, proving that luxury and sustainability can coexist.",
    technologies: ["Sustainable Design", "Branding", "Packaging", "Art Direction"]
  },
  {
    id: 14,
    title: "Project Xi",
    category: "Sketches",
    year: "2023",
    image: "https://picsum.photos/seed/xi2/800/900",
    images: [
      "https://picsum.photos/seed/xi2/800/900",
      "https://picsum.photos/seed/xi3/800/900",
      "https://picsum.photos/seed/xi4/800/900"
    ],
    description: "Health and wellness tracker.",
    extendedDescription: "UI design for a wearable health tracker companion app. The app visualizes data such as heart rate, sleep quality, and activity levels in an easy-to-understand format. The design uses a calming color palette and smooth animations to create a relaxing user experience. Personalized insights and goal-tracking features help users stay motivated on their wellness journey.",
    challenge: "Health data can be anxiety-inducing. The app needed to present this information in a way that was informative but also calming and motivating.",
    solution: "We used soft, rounded shapes and a pastel color palette to create a gentle, non-threatening interface. Data is presented in simple, digestible chunks. 'Celebration' animations reward users for meeting goals, reinforcing positive behavior without pressure.",
    technologies: ["Mobile UI", "Data Viz", "Animation", "HealthKit"]
  },
  {
    id: 15,
    title: "Project Omicron",
    category: "Digital Art",
    year: "2024",
    image: "https://picsum.photos/seed/omicron/800/1100",
    images: [
      "https://picsum.photos/seed/omicron/800/1100",
      "https://picsum.photos/seed/omicron2/800/1100",
      "https://picsum.photos/seed/omicron3/800/1100"
    ],
    description: "Limited edition vinyl packaging.",
    extendedDescription: "Packaging design for a limited edition vinyl release by an experimental electronic artist. The design features abstract geometric patterns and metallic foil stamping, reflecting the futuristic sound of the music. The package includes a gatefold sleeve, a printed inner sleeve, and a poster, creating a premium physical product for fans and collectors.",
    challenge: "The music was abstract and futuristic. The packaging needed to visually represent this soundscape without relying on literal imagery.",
    solution: "We used generative design algorithms to create complex geometric patterns that mimic the structure of the music. These patterns were printed in metallic silver foil on matte black stock, creating a shimmering, shifting effect that changes with the light, much like the music itself.",
    technologies: ["Generative Design", "Print Production", "Adobe Illustrator", "Processing"]
  }
];

export const timelineEvents = [
  {
    year: "2024",
    title: "Pro Arte Alphen Park",
    desc: "A creative milestone and educational journey.",
    extendedDesc: "Completed comprehensive art and design training at Pro Arte Alphen Park, specializing in visual communication and digital media. This period marked a significant evolution in my artistic style, moving from traditional mediums to digital experimentation. The curriculum covered design theory, art history, and practical studio work, laying the foundation for my current multidisciplinary approach.",
    image: "https://picsum.photos/seed/timeline1/800/600"
  },
  {
    year: "2025",
    title: "MURAL At primary school",
    desc: "Bringing color and inspiration to young minds.",
    extendedDesc: "Commissioned to design and execute a large-scale mural for a local primary school. The project involved collaborating with students and teachers to create a concept that reflected the school's values of growth and curiosity. The final piece spans 20 meters and utilizes weather-resistant acrylics, transforming a dull playground wall into a vibrant, interactive storytelling canvas.",
    image: "https://picsum.photos/seed/timeline2/800/600"
  },
  {
    year: "2026",
    title: "COMING SOON",
    desc: "Exciting new projects on the horizon.",
    extendedDesc: "Currently in the planning stages for several large-scale interactive installations and a potential solo exhibition. I am also exploring new technologies in generative art and AR to push the boundaries of my practice further. Stay tuned for updates as these projects move from concept to reality.",
    image: "https://picsum.photos/seed/timeline3/800/600"
  }
];
