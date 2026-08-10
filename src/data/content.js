export const school = {
  name: "Saint Vincent Pallotti School Masaka",
  shortName: "SVPM",
  tagline:
    "Empowering young minds through academic excellence, Christian values, discipline, and holistic education.",
  address: "Masaka Sector, Kicukiro District, Kigali, Rwanda",
  phone: "+250 788 602 647",
  email: "info@svpmasaka.rw",
  hours: "Mon–Fri 8:00–17:00; Sat 8:00–12:00",
};

export const settings = [
  { key: "school_name", value: school.name },
  { key: "school_tagline", value: school.tagline },
  { key: "school_address", value: school.address },
  { key: "school_phone", value: school.phone },
  { key: "school_email", value: school.email },
];

export const home = {
  hero: {
    eyebrow: "Welcome to Saint Vincent Pallotti Masaka",
    heading: "Welcome to Saint Vincent Pallotti Masaka",
    subheading: school.tagline,
  },
  stats: [
    { value: "3", label: "Levels of Study" },
    { value: "6", label: "Academic Departments" },
    { value: "8", label: "Core Values" },
  ],
  features: [
    {
      title: "Academic Excellence",
      description:
        "A rigorous, learner-centred curriculum that prepares students for success at every stage of their journey.",
    },
    {
      title: "Catholic Values",
      description:
        "Faith-based education rooted in Christian values and the legacy of St. Vincent Pallotti.",
    },
    {
      title: "Qualified Teachers",
      description: "Dedicated and experienced educators who nurture and support every learner.",
    },
    {
      title: "Safe Environment",
      description: "A secure, caring campus where every student feels protected and respected.",
    },
    {
      title: "Modern Learning",
      description: "Modern classrooms and ICT resources that make learning engaging and relevant.",
    },
    {
      title: "Holistic Development",
      description:
        "We nurture the mind, body, and spirit — academically, morally, spiritually, and socially.",
    },
  ],
  principalWelcome:
    "Welcome to Saint Vincent Pallotti Masaka. We are committed to nurturing young people academically, morally, spiritually, and socially.",
};

export const about = {
  sections: [
    {
      id: 1,
      sectionKey: "our_story",
      title: "Our Story",
      subtitle: "About Us",
      content: {
        body: "Saint Vincent Pallotti School Masaka is a private Catholic day school located in Masaka Sector, Kicukiro District, Kigali, Rwanda. It serves learners from Pre-Primary through O-Level.",
      },
    },
    {
      id: 2,
      sectionKey: "vision_mission",
      title: "Vision & Mission",
      subtitle: "Who We Are",
      content: {
        items: [
          {
            title: "Our Vision",
            description:
              "To become a leading Catholic school recognized for academic excellence, innovation, moral integrity, and responsible citizenship.",
          },
          {
            title: "Our Mission",
            description: "To provide holistic education rooted in Christian values.",
          },
        ],
      },
    },
    {
      id: 3,
      sectionKey: "core_values",
      title: "Our Core Values",
      subtitle: "What We Stand For",
      content: {
        items: [
          { title: "Faith", description: "Trusting God in all that we do." },
          {
            title: "Excellence",
            description: "Striving for the highest standards in academics and character.",
          },
          { title: "Respect", description: "Honouring every person with dignity." },
          { title: "Integrity", description: "Acting with honesty and truthfulness." },
          { title: "Discipline", description: "Self-control and commitment to learning." },
          { title: "Responsibility", description: "Owning our actions and serving others." },
          { title: "Compassion", description: "Caring for others with kindness." },
          { title: "Teamwork", description: "Working together to achieve more." },
        ],
      },
    },
  ],
};

export const programs = [
  {
    id: 1,
    title: "Pre-Primary",
    ageRange: "Early Years",
    description:
      "Play-based learning that builds early literacy, numeracy, and social skills in a caring, faith-filled environment.",
  },
  {
    id: 2,
    title: "Primary",
    ageRange: "Primary Level",
    description:
      "A strong foundation across core subjects with a focus on character development and lifelong learning.",
  },
  {
    id: 3,
    title: "Ordinary Level (O-Level)",
    ageRange: "Secondary",
    description:
      "A broad secondary curriculum that prepares learners for national examinations and future success.",
  },
];

export const subjects = {
  primary: [
    "Mathematics",
    "English",
    "Kinyarwanda",
    "Science",
    "Social Studies",
    "ICT",
    "Religious Education",
  ],
  oLevel: [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "History",
    "Entrepreneurship",
    "ICT",
    "Kinyarwanda",
  ],
};

export const departments = [
  {
    id: 1,
    name: "Mathematics",
    description: "Building problem-solving and analytical skills across all levels.",
  },
  {
    id: 2,
    name: "Science",
    description: "Exploring Physics, Chemistry, and Biology through practical, hands-on learning.",
  },
  {
    id: 3,
    name: "Languages",
    description: "Developing strong communication skills in English and Kinyarwanda.",
  },
  {
    id: 4,
    name: "ICT",
    description: "Preparing learners for a digital world with modern technology skills.",
  },
  {
    id: 5,
    name: "Humanities",
    description:
      "Understanding society and the world through Geography, History, and Social Studies.",
  },
  {
    id: 6,
    name: "Religious Education",
    description: "Guiding learners in faith, values, and responsible citizenship.",
  },
];

export const admission = {
  process: [
    {
      title: "Complete Application",
      description: "Fill out the application form for your child's grade level.",
    },
    {
      title: "Submit Documents",
      description: "Provide the required documents listed below.",
    },
    {
      title: "Review",
      description: "Our admissions team reviews the application and documents.",
    },
    {
      title: "Admission Decision",
      description: "We communicate the admission decision to your family.",
    },
    {
      title: "Fee Payment",
      description: "Pay the applicable fees to confirm your place.",
    },
    {
      title: "Enrollment",
      description: "Complete enrollment and welcome your child to SVPM!",
    },
  ],
  documents: [
    "Birth Certificate",
    "Passport Photos",
    "Previous Report Card",
    "Parent ID",
    "Transfer Letter (if applicable)",
    "Medical Record",
  ],
  fees: {
    note: "Tuition fees are reviewed periodically. Please contact the Admissions Office for the latest fee structure.",
    levels: [
      {
        level: "Pre-Primary",
        description:
          "Early childhood learning in a nurturing, play-based environment for our youngest learners.",
        total: "RWF XXX,XXX",
        items: [
          { label: "Tuition", detail: "Term tuition", price: "RWF —" },
          { label: "Registration", detail: "One-time", price: "RWF —" },
          { label: "Uniform", detail: "Required", price: "RWF —" },
          { label: "Learning Materials", detail: "Books/materials", price: "RWF —" },
          { label: "Meals", detail: "Per term", price: "RWF —" },
          { label: "Transport", detail: "Optional", price: "RWF —" },
        ],
      },
      {
        level: "Primary",
        description:
          "Building strong foundations in core subjects with independent thinking and collaboration.",
        total: "RWF XXX,XXX",
        items: [
          { label: "Tuition", detail: "Term tuition", price: "RWF —" },
          { label: "Registration", detail: "One-time", price: "RWF —" },
          { label: "Uniform", detail: "Required", price: "RWF —" },
          { label: "Learning Materials", detail: "Books/materials", price: "RWF —" },
          { label: "Meals", detail: "Per term", price: "RWF —" },
          { label: "Transport", detail: "Optional", price: "RWF —" },
        ],
      },
      {
        level: "O-Level",
        description:
          "Rigorous academic preparation focusing on critical thinking and global perspectives.",
        total: "RWF XXX,XXX",
        items: [
          { label: "Tuition", detail: "Term tuition", price: "RWF —" },
          { label: "Registration", detail: "One-time", price: "RWF —" },
          { label: "Uniform", detail: "Required", price: "RWF —" },
          { label: "Learning Materials", detail: "Books/materials", price: "RWF —" },
          { label: "Meals", detail: "Per term", price: "RWF —" },
          { label: "Transport", detail: "Optional", price: "RWF —" },
        ],
      },
    ],
    closingNote: "Official tuition fees are available from the Admissions Office upon request.",
  },
  timeline: {
    note: "Admission applications are accepted throughout the year, subject to available places.",
    steps: [
      { activity: "Applications Open", status: "Contact Admissions" },
      { activity: "Application Deadline", status: "Contact Admissions" },
      { activity: "Entrance Assessment (if required)", status: "Scheduled after application" },
      { activity: "Admission Decision", status: "Communicated after review" },
      { activity: "Student Registration", status: "Before the start of the academic term" },
      { activity: "Academic Year Begins", status: "According to the Rwanda school calendar" },
    ],
  },
  contact: {
    heading: "Admissions Office",
    location:
      "Saint Vincent Pallotti School Masaka\nMasaka Sector, Kicukiro District\nKigali, Rwanda",
    phone: "+250 788 602 647",
    email: "admissions@svpmasaka.rw",
    hours: [
      { day: "Monday", time: "8:00 AM – 5:00 PM" },
      { day: "Tuesday", time: "8:00 AM – 5:00 PM" },
      { day: "Wednesday", time: "8:00 AM – 5:00 PM" },
      { day: "Thursday", time: "8:00 AM – 5:00 PM" },
      { day: "Friday", time: "8:00 AM – 5:00 PM" },
      { day: "Saturday", time: "8:00 AM – 12:00 PM" },
      { day: "Sunday", time: "Closed" },
    ],
    helpText:
      "Our Admissions Team is available to answer questions about applications, school visits, fees, and enrollment.",
  },
};

export const faqs = [
  {
    id: 1,
    question: "What documents are required for admission?",
    answer:
      "Birth Certificate, Passport Photos, Previous Report Card, Parent ID, Transfer Letter (if applicable), and Medical Record.",
  },
  {
    id: 2,
    question: "What is the admission process?",
    answer:
      "Complete the application, submit the required documents, undergo review, receive an admission decision, pay fees, and complete enrollment.",
  },
  {
    id: 3,
    question: "How much are tuition fees?",
    answer: "Please contact the school office for the current tuition and registration fees.",
  },
  {
    id: 4,
    question: "Which grade levels are available?",
    answer: "We serve learners from Pre-Primary through Ordinary Level (O-Level).",
  },
  {
    id: 5,
    question: "How do I book a school tour?",
    answer: "Use the 'Book a Tour' form on the Admissions page to schedule a visit.",
  },
];

export const news = [
  {
    id: 1,
    title: "Sports Day",
    category: "School Events",
    excerpt: "A fun-filled day of athletics, games, and school spirit at SVPM.",
    content:
      "Our annual Sports Day brought students together for a fun-filled day of athletics, games, and school spirit. Parents and teachers cheered on the learners as they competed with enthusiasm and sportsmanship.",
  },
  {
    id: 2,
    title: "Science Fair",
    category: "Academics",
    excerpt: "Students showcase their projects in science and technology.",
    content:
      "Learners across all levels showcased their science and technology projects at our annual Science Fair, demonstrating creativity, curiosity, and a passion for discovery.",
  },
  {
    id: 3,
    title: "Graduation",
    category: "Graduation",
    excerpt: "Celebrating our O-Level graduates and their achievements.",
    content:
      "We proudly celebrated the graduation of our O-Level students. It was a joyful occasion honouring their hard work, growth, and the bright futures that lie ahead.",
  },
  {
    id: 4,
    title: "Parent Meetings",
    category: "Community",
    excerpt: "Engaging parents in their children's learning journey.",
    content:
      "Regular parent meetings keep families engaged in their children's learning journey, strengthening the partnership between home and school.",
  },
  {
    id: 5,
    title: "National Exam Results",
    category: "Examinations",
    excerpt: "Results and updates for national examinations.",
    content:
      "We share national examination results and updates with our school community, celebrating the achievements of our learners.",
  },
  {
    id: 6,
    title: "Community Outreach",
    category: "Community",
    excerpt: "Serving our community through outreach and service.",
    content:
      "Students and staff came together to serve the local community through outreach and service, living out our values of compassion and responsibility.",
  },
];

export const events = [
  {
    id: 1,
    title: "Sports Day",
    eventDate: "2026-09-18",
    description: "A fun-filled day of athletics, games, and school spirit.",
    category: "School Events",
    location: "School Grounds",
  },
  {
    id: 2,
    title: "Science Fair",
    eventDate: "2026-10-09",
    description: "Students showcase their science and technology projects.",
    category: "Academics",
    location: "School Hall",
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    eventDate: "2026-09-04",
    description: "Meet teachers to discuss student progress.",
    category: "Community",
    location: "School Campus",
  },
  {
    id: 4,
    title: "Community Outreach Day",
    eventDate: "2026-11-06",
    description: "Students and staff serve the local community.",
    category: "Community",
    location: "Masaka, Kicukiro",
  },
  {
    id: 5,
    title: "Graduation Ceremony",
    eventDate: "2026-11-20",
    description: "Celebrating our O-Level graduates.",
    category: "Graduation",
    location: "School Hall",
  },
];

export const calendar = [
  {
    id: 1,
    term: "Term 1",
    eventDate: "2026-09-07",
    title: "First Day of Term 1",
    description: "Opening of the 2026–2027 academic year.",
  },
  {
    id: 2,
    term: "Term 1",
    eventDate: "2026-11-30",
    title: "Term 1 Examinations",
    description: "End-of-term assessments for all levels.",
  },
  {
    id: 3,
    term: "Term 2",
    eventDate: "2027-01-11",
    title: "First Day of Term 2",
    description: "Resumption of classes for Term 2.",
  },
  {
    id: 4,
    term: "Term 3",
    eventDate: "2027-05-03",
    title: "First Day of Term 3",
    description: "Resumption of classes for Term 3.",
  },
];

export const gallery = [
  { id: 1, title: "Campus Tour", category: "campus", imageUrl: null },
  { id: 2, title: "Classrooms", category: "academics", imageUrl: null },
  { id: 3, title: "Laboratories", category: "academics", imageUrl: null },
  { id: 4, title: "Sports Day", category: "sports", imageUrl: null },
  { id: 5, title: "Graduation", category: "events", imageUrl: null },
  { id: 6, title: "School Events", category: "events", imageUrl: null },
  { id: 7, title: "Our Students", category: "campus", imageUrl: null },
  { id: 8, title: "Our Teachers", category: "campus", imageUrl: null },
];

export const studentLife = {
  hero: {
    heading: "Life at SVPM",
    subheading: "Clubs, sports, arts, and community beyond the classroom.",
  },
  sections: [
    {
      id: 1,
      sectionKey: "life_beyond_classroom",
      title: "Life Beyond the Classroom",
      subtitle: "Student Life",
      content: {
        body: "At Saint Vincent Pallotti School Masaka, learning continues beyond the classroom through sports, arts, and service.",
        items: [
          {
            title: "Sports",
            description:
              "From sports days to inter-house competitions, staying active is a big part of school life.",
          },
          {
            title: "Arts & Culture",
            description: "Creative expression through music, drama, and cultural activities.",
          },
          {
            title: "Community Service",
            description:
              "Students grow in compassion and responsibility through outreach and service.",
          },
        ],
      },
    },
  ],
};

export const galleryCategories = ["sports", "arts", "campus", "events", "academics"];
