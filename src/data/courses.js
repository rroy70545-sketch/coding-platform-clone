import {
  Code2,
  Database,
  Brain,
  Globe,
  Smartphone,
  ShieldCheck,
  BarChart3,
  Server,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    shortTitle: "DSA",
    description:
      "Master problem solving, algorithms and data structures from the ground up.",
    longDescription:
      "Build strong problem-solving skills with arrays, strings, linked lists, stacks, queues, trees, graphs, sorting, searching and dynamic programming.",
    category: "Programming",
    level: "Beginner to Advanced",
    rating: 4.9,
    students: "25K+",
    duration: "12 weeks",
    lessons: 5,
    projects: 12,
    icon: Code2,
    color: "blue",

    curriculum: [
      {
        title: "Introduction to DSA",
        duration: "15 minutes",
        description:
          "Understand what data structures and algorithms are and why they are important.",
      },
      {
        title: "Arrays and Strings",
        duration: "25 minutes",
        description:
          "Learn arrays, strings, indexing, searching and common operations.",
      },
      {
        title: "Linked Lists",
        duration: "30 minutes",
        description:
          "Understand singly and doubly linked lists and how they work.",
      },
      {
        title: "Stacks and Queues",
        duration: "25 minutes",
        description:
          "Learn stack and queue operations with practical examples.",
      },
      {
        title: "Trees and Graphs",
        duration: "40 minutes",
        description:
          "Explore trees, graphs and their common applications.",
      },
    ],

    skills: [
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Trees & Graphs",
      "Sorting & Searching",
      "Dynamic Programming",
    ],
  },

  {
    id: 2,
    title: "Full Stack Web Development",
    shortTitle: "Full Stack",
    description:
      "Build modern web applications using frontend and backend technologies.",
    longDescription:
      "Learn how modern web applications work from frontend interfaces to backend APIs, databases and deployment.",
    category: "Web Development",
    level: "Beginner",
    rating: 4.8,
    students: "18K+",
    duration: "16 weeks",
    lessons: 5,
    projects: 15,
    icon: Globe,
    color: "indigo",

    curriculum: [
      {
        title: "HTML and CSS Fundamentals",
        duration: "20 minutes",
        description:
          "Learn how websites are structured and styled using HTML and CSS.",
      },
      {
        title: "JavaScript Basics",
        duration: "30 minutes",
        description:
          "Learn variables, functions, conditions, loops and JavaScript fundamentals.",
      },
      {
        title: "React Fundamentals",
        duration: "35 minutes",
        description:
          "Understand components, props, state and modern React development.",
      },
      {
        title: "Backend and APIs",
        duration: "35 minutes",
        description:
          "Learn how backend servers and REST APIs communicate with frontend applications.",
      },
      {
        title: "Database and Deployment",
        duration: "40 minutes",
        description:
          "Understand databases and the basics of deploying a full-stack application.",
      },
    ],

    skills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "Node.js",
      "REST APIs",
      "Databases",
    ],
  },

  {
    id: 3,
    title: "Artificial Intelligence",
    shortTitle: "AI",
    description:
      "Learn machine learning, deep learning and modern AI concepts.",
    longDescription:
      "Understand artificial intelligence from the fundamentals to machine learning, neural networks, deep learning and practical AI applications.",
    category: "AI & ML",
    level: "Intermediate",
    rating: 4.9,
    students: "12K+",
    duration: "14 weeks",
    lessons: 5,
    projects: 10,
    icon: Brain,
    color: "purple",

    curriculum: [
      {
        title: "Introduction to Artificial Intelligence",
        duration: "20 minutes",
        description:
          "Understand AI, its history, applications and different types of AI.",
      },
      {
        title: "Machine Learning",
        duration: "30 minutes",
        description:
          "Learn supervised, unsupervised and reinforcement learning.",
      },
      {
        title: "Neural Networks",
        duration: "35 minutes",
        description:
          "Understand neurons, layers and the basic structure of neural networks.",
      },
      {
        title: "Deep Learning",
        duration: "40 minutes",
        description:
          "Explore deep neural networks and their real-world applications.",
      },
      {
        title: "AI Projects",
        duration: "45 minutes",
        description:
          "Apply AI concepts by building practical beginner-friendly projects.",
      },
    ],

    skills: [
      "Python for AI",
      "Machine Learning",
      "Neural Networks",
      "Deep Learning",
      "Natural Language Processing",
      "AI Projects",
    ],
  },

  {
    id: 4,
    title: "Database Management",
    shortTitle: "Databases",
    description:
      "Learn SQL, database design and modern database management.",
    longDescription:
      "Learn how to design, query and manage databases using SQL and understand the fundamentals of relational database systems.",
    category: "Data",
    level: "Beginner",
    rating: 4.7,
    students: "9K+",
    duration: "8 weeks",
    lessons: 5,
    projects: 7,
    icon: Database,
    color: "green",

    curriculum: [
      {
        title: "Introduction to Databases",
        duration: "15 minutes",
        description:
          "Understand databases, tables, records and why databases are used.",
      },
      {
        title: "SQL Basics",
        duration: "25 minutes",
        description:
          "Learn SELECT, INSERT, UPDATE and DELETE commands.",
      },
      {
        title: "SQL Joins",
        duration: "30 minutes",
        description:
          "Understand INNER JOIN, LEFT JOIN and other common SQL joins.",
      },
      {
        title: "Database Design",
        duration: "30 minutes",
        description:
          "Learn tables, relationships, keys and database normalization.",
      },
      {
        title: "Transactions and Projects",
        duration: "35 minutes",
        description:
          "Understand transactions and apply database concepts in practical projects.",
      },
    ],

    skills: [
      "SQL",
      "Database Design",
      "MySQL",
      "Joins",
      "Normalization",
      "Transactions",
    ],
  },

  {
    id: 5,
    title: "Android App Development",
    shortTitle: "Android",
    description:
      "Create modern Android applications and understand mobile development.",
    longDescription:
      "Learn the fundamentals of mobile application development and create functional Android applications through practical projects.",
    category: "Mobile Development",
    level: "Beginner",
    rating: 4.8,
    students: "7K+",
    duration: "10 weeks",
    lessons: 5,
    projects: 8,
    icon: Smartphone,
    color: "orange",

    curriculum: [
      {
        title: "Introduction to Android",
        duration: "20 minutes",
        description:
          "Understand Android development and the structure of mobile applications.",
      },
      {
        title: "User Interface Design",
        duration: "30 minutes",
        description:
          "Learn how to create clean and responsive Android interfaces.",
      },
      {
        title: "App Navigation",
        duration: "25 minutes",
        description:
          "Understand screens, navigation and user interaction.",
      },
      {
        title: "APIs and Data",
        duration: "35 minutes",
        description:
          "Learn how mobile applications communicate with APIs and handle data.",
      },
      {
        title: "Build a Mobile Project",
        duration: "45 minutes",
        description:
          "Combine your knowledge to create a practical Android application.",
      },
    ],

    skills: [
      "Android Fundamentals",
      "UI Design",
      "App Navigation",
      "APIs",
      "Local Storage",
      "Mobile Projects",
    ],
  },

  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    shortTitle: "Cybersecurity",
    description:
      "Understand cybersecurity concepts, threats and defensive techniques.",
    longDescription:
      "Learn the foundations of cybersecurity including common attacks, security principles, network security and defensive practices.",
    category: "Cybersecurity",
    level: "Beginner",
    rating: 4.9,
    students: "11K+",
    duration: "10 weeks",
    lessons: 5,
    projects: 6,
    icon: ShieldCheck,
    color: "red",

    curriculum: [
      {
        title: "Introduction to Cybersecurity",
        duration: "20 minutes",
        description:
          "Understand cybersecurity, information security and the importance of protecting data.",
      },
      {
        title: "Common Cyber Threats",
        duration: "25 minutes",
        description:
          "Learn about phishing, malware, social engineering and common attacks.",
      },
      {
        title: "Network Security",
        duration: "30 minutes",
        description:
          "Understand basic network security concepts and defensive techniques.",
      },
      {
        title: "Web Security",
        duration: "35 minutes",
        description:
          "Learn common web vulnerabilities and basic security practices.",
      },
      {
        title: "Security Best Practices",
        duration: "25 minutes",
        description:
          "Learn authentication, passwords, updates and other security practices.",
      },
    ],

    skills: [
      "Cybersecurity Basics",
      "Network Security",
      "Web Security",
      "Threats & Attacks",
      "Authentication",
      "Security Practices",
    ],
  },

  {
    id: 7,
    title: "Data Analytics",
    shortTitle: "Analytics",
    description:
      "Turn data into useful insights using analysis and visualization.",
    longDescription:
      "Learn how to clean, analyze and visualize data to discover useful patterns and communicate insights effectively.",
    category: "Data",
    level: "Intermediate",
    rating: 4.8,
    students: "8K+",
    duration: "10 weeks",
    lessons: 5,
    projects: 9,
    icon: BarChart3,
    color: "cyan",

    curriculum: [
      {
        title: "Introduction to Data Analytics",
        duration: "20 minutes",
        description:
          "Understand data analytics and how organizations use data to make decisions.",
      },
      {
        title: "Data Cleaning",
        duration: "30 minutes",
        description:
          "Learn how to identify and clean incorrect or missing data.",
      },
      {
        title: "Python and Pandas",
        duration: "35 minutes",
        description:
          "Learn the basics of using Python and Pandas for data analysis.",
      },
      {
        title: "Data Visualization",
        duration: "30 minutes",
        description:
          "Create useful visualizations to understand and communicate data.",
      },
      {
        title: "Analytics Project",
        duration: "45 minutes",
        description:
          "Apply analytics skills to a practical real-world dataset.",
      },
    ],

    skills: [
      "Data Cleaning",
      "Python",
      "Pandas",
      "Data Visualization",
      "Statistics",
      "Dashboards",
    ],
  },

  {
    id: 8,
    title: "Backend Development",
    shortTitle: "Backend",
    description:
      "Build APIs, server-side applications and backend systems.",
    longDescription:
      "Understand backend architecture, APIs, databases, authentication and server-side application development.",
    category: "Web Development",
    level: "Intermediate",
    rating: 4.8,
    students: "10K+",
    duration: "12 weeks",
    lessons: 5,
    projects: 10,
    icon: Server,
    color: "violet",

    curriculum: [
      {
        title: "Backend Fundamentals",
        duration: "20 minutes",
        description:
          "Understand servers, backend applications and how web requests work.",
      },
      {
        title: "Node.js and Express",
        duration: "30 minutes",
        description:
          "Learn how to create backend applications using Node.js and Express.",
      },
      {
        title: "REST APIs",
        duration: "30 minutes",
        description:
          "Understand REST APIs, HTTP methods and API communication.",
      },
      {
        title: "Authentication",
        duration: "35 minutes",
        description:
          "Learn the fundamentals of user authentication and authorization.",
      },
      {
        title: "Backend Project",
        duration: "45 minutes",
        description:
          "Build a practical backend application using the concepts you've learned.",
      },
    ],

    skills: [
      "Node.js",
      "Express",
      "REST APIs",
      "Authentication",
      "Databases",
      "Backend Projects",
    ],
  },
];

export default courses;