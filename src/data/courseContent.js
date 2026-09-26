// src/data/courseContent.js

const youtubeSearch = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const directVideo = (videoUrl) => videoUrl;

const topic = (id, title, description, video) => ({
  id,
  title,
  description,
  video,
  youtube: video,
});

const searchTopic = (id, title, description, search) => ({
  id,
  title,
  description,
  video: youtubeSearch(search),
  youtube: youtubeSearch(search),
});

const courseContent = {
  // ============================================================
  // COURSE 1 - DATA STRUCTURES & ALGORITHMS
  // ============================================================
  1: {
    days: [
      {
        day: 1,
        title: "Introduction & Arrays",
        topics: [
          searchTopic(
            101,
            "Introduction to Data Structures",
            "Learn what data structures are, why they are important, and the difference between linear and non-linear data structures.",
            "Introduction to Data Structures and Algorithms for Beginners"
          ),
          searchTopic(
            102,
            "Arrays",
            "Understand arrays, indexing, traversal, insertion, deletion, and common applications.",
            "Arrays Data Structure Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 2,
        title: "Linked Lists",
        topics: [
          searchTopic(
            201,
            "Introduction to Linked Lists",
            "Learn how linked lists store data using nodes and links between nodes.",
            "Linked List Data Structure Tutorial for Beginners"
          ),
          searchTopic(
            202,
            "Types of Linked Lists",
            "Understand singly linked lists, doubly linked lists, and circular linked lists.",
            "Types of Linked Lists Singly Doubly Circular Linked List"
          ),
        ],
      },
      {
        day: 3,
        title: "Stacks & Queues",
        topics: [
          searchTopic(
            301,
            "Stacks",
            "Learn the LIFO principle and stack operations such as push, pop, and peek.",
            "Stack Data Structure Push Pop Peek Tutorial"
          ),
          searchTopic(
            302,
            "Queues",
            "Understand FIFO queues and operations such as enqueue and dequeue.",
            "Queue Data Structure Enqueue Dequeue Tutorial"
          ),
        ],
      },
      {
        day: 4,
        title: "Trees",
        topics: [
          searchTopic(
            401,
            "Introduction to Trees",
            "Learn the terminology and basic structure of tree data structures.",
            "Tree Data Structure Introduction Tutorial"
          ),
          searchTopic(
            402,
            "Binary Trees",
            "Understand binary trees, nodes, children, traversal, and basic operations.",
            "Binary Tree Data Structure Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Graphs",
        topics: [
          searchTopic(
            501,
            "Introduction to Graphs",
            "Learn vertices, edges, directed graphs, undirected graphs, and graph representations.",
            "Graph Data Structure Introduction Tutorial"
          ),
          searchTopic(
            502,
            "Graph Traversal",
            "Learn Breadth First Search and Depth First Search for traversing graphs.",
            "BFS DFS Graph Traversal Tutorial"
          ),
        ],
      },
      {
        day: 6,
        title: "Sorting & Searching",
        topics: [
          searchTopic(
            601,
            "Sorting Algorithms",
            "Understand common sorting techniques and how they organize data.",
            "Sorting Algorithms Bubble Sort Selection Sort Insertion Sort Merge Sort Quick Sort"
          ),
          searchTopic(
            602,
            "Searching Algorithms",
            "Learn linear search and binary search and when to use each method.",
            "Searching Algorithms Linear Search Binary Search Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Dynamic Programming & Revision",
        topics: [
          searchTopic(
            701,
            "Introduction to Dynamic Programming",
            "Learn the basic idea of dynamic programming, overlapping subproblems, and optimal substructure.",
            "Dynamic Programming Introduction Tutorial for Beginners"
          ),
          searchTopic(
            702,
            "DSA Final Revision",
            "Review arrays, linked lists, stacks, queues, trees, graphs, searching, sorting, and dynamic programming.",
            "Data Structures Algorithms Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 2 - FULL STACK WEB DEVELOPMENT
  // ============================================================
  2: {
    days: [
      {
        day: 1,
        title: "Web Development Fundamentals",
        topics: [
          searchTopic(
            201,
            "Introduction to Web Development",
            "Understand websites, web applications, frontend, backend, servers, and databases.",
            "Web Development Introduction Frontend Backend Tutorial"
          ),
          searchTopic(
            202,
            "HTML",
            "Learn HTML structure, elements, headings, paragraphs, links, images, forms, and semantic HTML.",
            "HTML Full Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 2,
        title: "CSS & Responsive Design",
        topics: [
          searchTopic(
            203,
            "CSS",
            "Learn selectors, properties, box model, colors, typography, flexbox, and grid.",
            "CSS Full Tutorial for Beginners"
          ),
          searchTopic(
            204,
            "Responsive Design",
            "Learn how to make websites adapt to desktops, tablets, and mobile devices.",
            "Responsive Web Design CSS Media Queries Tutorial"
          ),
        ],
      },
      {
        day: 3,
        title: "JavaScript",
        topics: [
          searchTopic(
            205,
            "JavaScript Basics",
            "Learn variables, data types, operators, conditions, loops, functions, and arrays.",
            "JavaScript Full Course for Beginners"
          ),
          searchTopic(
            206,
            "DOM",
            "Learn how JavaScript interacts with HTML through the Document Object Model.",
            "JavaScript DOM Manipulation Tutorial"
          ),
        ],
      },
      {
        day: 4,
        title: "React",
        topics: [
          searchTopic(
            207,
            "React Fundamentals",
            "Understand React, components, JSX, props, state, and basic application structure.",
            "React JS Full Course for Beginners"
          ),
          searchTopic(
            208,
            "React Components",
            "Learn how to create reusable functional components and pass data using props.",
            "React Components Props Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Node.js & Express",
        topics: [
          searchTopic(
            209,
            "Node.js",
            "Learn server-side JavaScript, Node.js architecture, modules, and npm.",
            "Node.js Full Course for Beginners"
          ),
          searchTopic(
            210,
            "Express",
            "Learn Express.js, application setup, middleware, routes, and request handling.",
            "Express.js Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 6,
        title: "APIs & Database",
        topics: [
          searchTopic(
            211,
            "REST APIs",
            "Understand REST architecture, endpoints, HTTP methods, requests, and responses.",
            "REST API Tutorial Node Express HTTP Methods"
          ),
          searchTopic(
            212,
            "Database Integration",
            "Learn how a backend application communicates with a database.",
            "Node Express Database Integration Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Full Stack Project",
        topics: [
          searchTopic(
            213,
            "Full Stack Application",
            "Understand how frontend, backend, APIs, and databases work together in a complete application.",
            "Build Full Stack Web Application React Node Express"
          ),
          searchTopic(
            214,
            "Project Revision",
            "Review the complete frontend-to-backend development workflow.",
            "Full Stack Web Development Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 3 - ARTIFICIAL INTELLIGENCE
  // DIRECT YOUTUBE VIDEOS
  // ============================================================
  3: {
    days: [
      {
        day: 1,
        title: "AI Fundamentals",
        topics: [
          topic(
            301,
            "What is AI?",
            "Understand artificial intelligence, its goals, history, and common applications.",
            directVideo(
              "https://www.youtube.com/watch?v=rw4SFwleSqA"
            )
          ),
          topic(
            302,
            "Types of AI",
            "Learn about narrow AI, general AI, and superintelligence as commonly discussed AI categories.",
            directVideo(
              "https://www.youtube.com/watch?v=RhSJH-7X_os"
            )
          ),
        ],
      },
      {
        day: 2,
        title: "Machine Learning",
        topics: [
          topic(
            303,
            "Introduction to Machine Learning",
            "Learn what machine learning is and how systems learn patterns from data.",
            directVideo(
              "https://www.youtube.com/watch?v=hR-tMLTMw0s"
            )
          ),
          topic(
            304,
            "Supervised Learning",
            "Understand supervised learning using labeled training data and common algorithms.",
            directVideo(
              "https://www.youtube.com/watch?v=VyWAvY2CF9c&t=2134s"
            )
          ),
        ],
      },
      {
        day: 3,
        title: "Learning Methods",
        topics: [
          topic(
            305,
            "Unsupervised Learning",
            "Learn how models discover patterns in unlabeled data.",
            directVideo(
              "https://www.youtube.com/watch?v=VyWAvY2CF9c&t=2421s"
            )
          ),
          topic(
            306,
            "Reinforcement Learning",
            "Understand agents, environments, rewards, actions, and policies.",
            directVideo(
              "https://www.youtube.com/watch?v=xTPJHFn_r50"
            )
          ),
        ],
      },
      {
        day: 4,
        title: "Deep Learning",
        topics: [
          topic(
            307,
            "Deep Learning",
            "Learn the fundamentals of deep learning and how neural networks learn complex patterns.",
            directVideo(
              "https://www.youtube.com/watch?v=VyWAvY2CF9c&t=78s"
            )
          ),
          topic(
            308,
            "Neural Networks",
            "Understand neurons, layers, activation functions, weights, and training.",
            directVideo(
              "https://www.youtube.com/watch?v=lpYfrshSZ4I"
            )
          ),
        ],
      },
      {
        day: 5,
        title: "Natural Language Processing",
        topics: [
          topic(
            309,
            "Introduction to NLP",
            "Learn how computers process and understand human language.",
            directVideo(
              "https://www.youtube.com/watch?v=rw4SFwleSqA"
            )
          ),
          topic(
            310,
            "NLP Applications",
            "Explore chatbots, sentiment analysis, translation, text classification, and speech applications.",
            directVideo(
              "https://www.youtube.com/watch?v=rw4SFwleSqA"
            )
          ),
        ],
      },
      {
        day: 6,
        title: "Prompt Engineering",
        topics: [
          topic(
            311,
            "Prompt Engineering",
            "Learn how prompts can be designed to obtain useful and reliable results from AI systems.",
            directVideo(
              "https://www.youtube.com/watch?v=zBaa8Ct2C-k"
            )
          ),
          topic(
            312,
            "Effective AI Prompts",
            "Learn practical techniques for writing clear, specific, and structured AI prompts.",
            directVideo(
              "https://www.youtube.com/watch?v=zBaa8Ct2C-k"
            )
          ),
        ],
      },
      {
        day: 7,
        title: "AI Applications & Revision",
        topics: [
          topic(
            313,
            "AI Applications",
            "Explore applications of AI in healthcare, finance, education, cybersecurity, and business.",
            directVideo(
              "https://www.youtube.com/watch?v=rw4SFwleSqA"
            )
          ),
          topic(
            314,
            "AI Revision",
            "Review AI, machine learning, deep learning, NLP, and prompt engineering.",
            directVideo(
              "https://www.youtube.com/watch?v=rw4SFwleSqA"
            )
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 4 - DATABASE MANAGEMENT
  // ============================================================
  4: {
    days: [
      {
        day: 1,
        title: "Database Fundamentals",
        topics: [
          searchTopic(
            401,
            "Introduction to Databases",
            "Understand databases, DBMS, database users, and advantages of database systems.",
            "DBMS Introduction Database Management System Tutorial"
          ),
          searchTopic(
            402,
            "Database Models",
            "Learn relational, hierarchical, network, and other database models.",
            "Database Models DBMS Tutorial"
          ),
        ],
      },
      {
        day: 2,
        title: "ER Modeling",
        topics: [
          searchTopic(
            403,
            "ER Model",
            "Learn entities, attributes, relationships, and cardinality.",
            "ER Model DBMS Entity Relationship Model"
          ),
          searchTopic(
            404,
            "ER Diagrams",
            "Learn how to represent database requirements using ER diagrams.",
            "ER Diagram Tutorial DBMS"
          ),
        ],
      },
      {
        day: 3,
        title: "SQL",
        topics: [
          searchTopic(
            405,
            "SQL Basics",
            "Learn SELECT, INSERT, UPDATE, DELETE, CREATE, and other fundamental SQL commands.",
            "SQL Basics Tutorial for Beginners"
          ),
          searchTopic(
            406,
            "SQL Queries",
            "Learn how to write filtering, grouping, aggregation, and ordering queries.",
            "SQL Queries Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 4,
        title: "Joins & Normalization",
        topics: [
          searchTopic(
            407,
            "SQL Joins",
            "Understand INNER JOIN, LEFT JOIN, RIGHT JOIN, and other join concepts.",
            "SQL Joins Tutorial Inner Left Right Full Join"
          ),
          searchTopic(
            408,
            "Normalization",
            "Learn database normalization and normal forms such as 1NF, 2NF, and 3NF.",
            "Database Normalization 1NF 2NF 3NF Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Transactions",
        topics: [
          searchTopic(
            409,
            "Transactions",
            "Understand database transactions and ACID properties.",
            "DBMS Transactions ACID Properties Tutorial"
          ),
          searchTopic(
            410,
            "Concurrency",
            "Learn concurrency control and problems that occur when multiple transactions run together.",
            "DBMS Concurrency Control Tutorial"
          ),
        ],
      },
      {
        day: 6,
        title: "Indexes & Security",
        topics: [
          searchTopic(
            411,
            "Indexes",
            "Learn database indexes and how they improve query performance.",
            "Database Indexing DBMS Tutorial"
          ),
          searchTopic(
            412,
            "Database Security",
            "Understand authentication, authorization, access control, and common database security practices.",
            "Database Security DBMS Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Database Project & Revision",
        topics: [
          searchTopic(
            413,
            "Database Project",
            "Learn how database concepts are applied while designing a practical database project.",
            "DBMS Database Project Tutorial"
          ),
          searchTopic(
            414,
            "Final Revision",
            "Review database models, ER diagrams, SQL, joins, normalization, transactions, indexing, and security.",
            "DBMS Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 5 - ANDROID APP DEVELOPMENT
  // ============================================================
  5: {
    days: [
      {
        day: 1,
        title: "Android Fundamentals",
        topics: [
          searchTopic(
            501,
            "Introduction to Android",
            "Understand Android, mobile applications, Android architecture, and the Android development ecosystem.",
            "Android Development Introduction for Beginners"
          ),
          searchTopic(
            502,
            "Android Studio",
            "Learn how to install, configure, and use Android Studio for application development.",
            "Android Studio Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 2,
        title: "Activities & Layouts",
        topics: [
          searchTopic(
            503,
            "Activities",
            "Learn Android activities, activity lifecycle, and navigation between screens.",
            "Android Activity Lifecycle Tutorial"
          ),
          searchTopic(
            504,
            "Layouts",
            "Learn Android layouts and how UI elements are positioned on a screen.",
            "Android Layouts XML Linear Constraint Layout Tutorial"
          ),
        ],
      },
      {
        day: 3,
        title: "UI Components",
        topics: [
          searchTopic(
            505,
            "UI Components",
            "Learn common Android UI components such as TextView, Button, EditText, ImageView, and more.",
            "Android UI Components Tutorial"
          ),
          searchTopic(
            506,
            "RecyclerView",
            "Learn how RecyclerView efficiently displays lists of data in Android applications.",
            "Android RecyclerView Tutorial for Beginners"
          ),
        ],
      },
      {
        day: 4,
        title: "Navigation",
        topics: [
          searchTopic(
            507,
            "Intents",
            "Learn explicit and implicit intents and how Android components communicate.",
            "Android Intent Explicit Implicit Tutorial"
          ),
          searchTopic(
            508,
            "Navigation",
            "Learn navigation between screens and the Android navigation system.",
            "Android Navigation Component Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Local Data",
        topics: [
          searchTopic(
            509,
            "SQLite",
            "Learn how SQLite can be used to store structured data locally in Android applications.",
            "Android SQLite Database Tutorial"
          ),
          searchTopic(
            510,
            "Local Data Storage",
            "Explore methods for storing application data locally on Android devices.",
            "Android Local Data Storage SharedPreferences Room SQLite"
          ),
        ],
      },
      {
        day: 6,
        title: "APIs & Networking",
        topics: [
          searchTopic(
            511,
            "APIs",
            "Understand APIs and how mobile applications communicate with external services.",
            "Android API Integration Tutorial"
          ),
          searchTopic(
            512,
            "Networking",
            "Learn HTTP requests, networking libraries, and retrieving remote data in Android.",
            "Android Networking REST API Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Android Project & Revision",
        topics: [
          searchTopic(
            513,
            "Android Project",
            "Learn how the major Android concepts come together in a practical application.",
            "Android App Development Project Tutorial"
          ),
          searchTopic(
            514,
            "Final Revision",
            "Review Android Studio, activities, layouts, UI, navigation, storage, APIs, and networking.",
            "Android Development Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 6 - CYBERSECURITY FUNDAMENTALS
  // ============================================================
  6: {
    days: [
      {
        day: 1,
        title: "Cybersecurity Fundamentals",
        topics: [
          searchTopic(
            601,
            "Introduction to Cybersecurity",
            "Understand cybersecurity, information security, threats, vulnerabilities, and risks.",
            "Cybersecurity Introduction for Beginners"
          ),
          searchTopic(
            602,
            "CIA Triad",
            "Learn confidentiality, integrity, and availability and their importance in security.",
            "CIA Triad Cybersecurity Tutorial"
          ),
        ],
      },
      {
        day: 2,
        title: "Cyber Attacks",
        topics: [
          searchTopic(
            603,
            "Types of Cyber Attacks",
            "Learn common cyber attacks such as DoS, SQL injection, brute force, and other attack categories.",
            "Types of Cyber Attacks Explained"
          ),
          searchTopic(
            604,
            "Malware",
            "Understand viruses, worms, trojans, ransomware, spyware, and other malicious software.",
            "Malware Types Virus Worm Trojan Ransomware Tutorial"
          ),
        ],
      },
      {
        day: 3,
        title: "Social Engineering",
        topics: [
          searchTopic(
            605,
            "Phishing",
            "Learn how phishing attacks trick users into revealing information or performing unsafe actions.",
            "Phishing Attack Cybersecurity Explained"
          ),
          searchTopic(
            606,
            "Social Engineering",
            "Understand psychological manipulation techniques used in social engineering attacks.",
            "Social Engineering Cybersecurity Tutorial"
          ),
        ],
      },
      {
        day: 4,
        title: "Network Security",
        topics: [
          searchTopic(
            607,
            "Network Security",
            "Learn fundamental techniques used to protect computer networks.",
            "Network Security Fundamentals Tutorial"
          ),
          searchTopic(
            608,
            "Firewalls",
            "Understand firewalls and how they control network traffic.",
            "Firewall Explained Cybersecurity Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Cryptography",
        topics: [
          searchTopic(
            609,
            "Cryptography",
            "Learn the fundamentals of cryptography and secure communication.",
            "Cryptography Introduction for Beginners"
          ),
          searchTopic(
            610,
            "Encryption",
            "Understand encryption, decryption, symmetric encryption, and asymmetric encryption.",
            "Encryption Symmetric Asymmetric Cryptography Tutorial"
          ),
        ],
      },
      {
        day: 6,
        title: "Web Security",
        topics: [
          searchTopic(
            611,
            "Web Application Security",
            "Learn common web application vulnerabilities and basic security practices.",
            "Web Application Security OWASP Tutorial"
          ),
          searchTopic(
            612,
            "Authentication",
            "Understand passwords, authentication, authorization, sessions, and secure login systems.",
            "Authentication Authorization Cybersecurity Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Security Practices & Revision",
        topics: [
          searchTopic(
            613,
            "Cybersecurity Best Practices",
            "Learn practical methods for protecting systems, accounts, networks, and data.",
            "Cybersecurity Best Practices for Beginners"
          ),
          searchTopic(
            614,
            "Final Revision",
            "Review threats, malware, phishing, network security, cryptography, web security, and authentication.",
            "Cybersecurity Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 7 - DATA ANALYTICS
  // ============================================================
  7: {
    days: [
      {
        day: 1,
        title: "Data Analytics Fundamentals",
        topics: [
          searchTopic(
            701,
            "Introduction to Data Analytics",
            "Understand data analytics, its process, applications, and role in decision-making.",
            "Data Analytics Introduction for Beginners"
          ),
          searchTopic(
            702,
            "Data Collection",
            "Learn common methods and sources used to collect data for analysis.",
            "Data Collection Methods Data Analytics Tutorial"
          ),
        ],
      },
      {
        day: 2,
        title: "Data Preparation",
        topics: [
          searchTopic(
            703,
            "Data Cleaning",
            "Learn how to identify and handle missing, duplicate, incorrect, and inconsistent data.",
            "Data Cleaning Tutorial for Data Analysis"
          ),
          searchTopic(
            704,
            "Data Preparation",
            "Learn how raw data is transformed into a usable format for analysis.",
            "Data Preparation Data Analysis Tutorial"
          ),
        ],
      },
      {
        day: 3,
        title: "Excel",
        topics: [
          searchTopic(
            705,
            "Excel for Data Analytics",
            "Learn how Excel can be used to organize, analyze, filter, and summarize data.",
            "Excel Data Analysis Tutorial for Beginners"
          ),
          searchTopic(
            706,
            "Excel Charts",
            "Learn how to create charts and visualize data in Excel.",
            "Excel Charts Data Visualization Tutorial"
          ),
        ],
      },
      {
        day: 4,
        title: "Python & Pandas",
        topics: [
          searchTopic(
            707,
            "Python for Data Analytics",
            "Learn why Python is widely used for data analysis and explore its basic analytical workflow.",
            "Python Data Analysis Full Tutorial"
          ),
          searchTopic(
            708,
            "Pandas",
            "Learn Series, DataFrames, filtering, grouping, and data manipulation with Pandas.",
            "Pandas Python Data Analysis Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Data Visualization",
        topics: [
          searchTopic(
            709,
            "Data Visualization",
            "Understand how visualizations communicate patterns, trends, and relationships in data.",
            "Data Visualization Tutorial for Beginners"
          ),
          searchTopic(
            710,
            "Charts & Graphs",
            "Learn common charts such as bar charts, line charts, pie charts, and scatter plots.",
            "Charts Graphs Data Visualization Tutorial"
          ),
        ],
      },
      {
        day: 6,
        title: "Statistics & EDA",
        topics: [
          searchTopic(
            711,
            "Statistics",
            "Learn basic descriptive statistics including mean, median, mode, variance, and standard deviation.",
            "Statistics for Data Analysis Beginners"
          ),
          searchTopic(
            712,
            "Exploratory Data Analysis",
            "Learn how EDA helps discover patterns, relationships, outliers, and trends.",
            "Exploratory Data Analysis EDA Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Analytics Project & Revision",
        topics: [
          searchTopic(
            713,
            "Analytics Project",
            "Learn the workflow for completing a practical data analytics project.",
            "Data Analytics Project Python Pandas Tutorial"
          ),
          searchTopic(
            714,
            "Final Revision",
            "Review data collection, cleaning, Excel, Python, Pandas, visualization, statistics, and EDA.",
            "Data Analytics Complete Revision"
          ),
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 8 - BACKEND DEVELOPMENT
  // ============================================================
  8: {
    days: [
      {
        day: 1,
        title: "Backend Fundamentals",
        topics: [
          searchTopic(
            801,
            "Backend Fundamentals",
            "Understand backend development, servers, APIs, databases, and server-side programming.",
            "Backend Development Introduction for Beginners"
          ),
          searchTopic(
            802,
            "Client and Server",
            "Learn how clients and servers communicate through requests and responses.",
            "Client Server Architecture Explained"
          ),
        ],
      },
      {
        day: 2,
        title: "Node.js",
        topics: [
          searchTopic(
            803,
            "Node.js",
            "Learn Node.js and how JavaScript can run outside the browser.",
            "Node.js Full Course for Beginners"
          ),
          searchTopic(
            804,
            "npm",
            "Learn npm, packages, package.json, dependencies, and scripts.",
            "npm Node Package Manager Tutorial"
          ),
        ],
      },
      {
        day: 3,
        title: "Express",
        topics: [
          searchTopic(
            805,
            "Express",
            "Learn how Express simplifies Node.js server development.",
            "Express.js Full Tutorial for Beginners"
          ),
          searchTopic(
            806,
            "Express Routes",
            "Learn how to create routes and handle requests using Express.",
            "Express.js Routes Tutorial"
          ),
        ],
      },
      {
        day: 4,
        title: "REST APIs",
        topics: [
          searchTopic(
            807,
            "REST API",
            "Understand REST APIs, resources, endpoints, requests, responses, and JSON.",
            "REST API Tutorial for Beginners"
          ),
          searchTopic(
            808,
            "HTTP Methods",
            "Learn GET, POST, PUT, PATCH, and DELETE HTTP methods.",
            "HTTP Methods GET POST PUT PATCH DELETE Tutorial"
          ),
        ],
      },
      {
        day: 5,
        title: "Authentication",
        topics: [
          searchTopic(
            809,
            "Authentication",
            "Learn authentication concepts and how backend applications verify users.",
            "Node Express Authentication Tutorial"
          ),
          searchTopic(
            810,
            "JWT",
            "Understand JSON Web Tokens and token-based authentication.",
            "JWT Authentication Node Express Tutorial"
          ),
        ],
      },
      {
        day: 6,
        title: "Database & CRUD",
        topics: [
          searchTopic(
            811,
            "Database Integration",
            "Learn how backend applications connect to and communicate with databases.",
            "Node Express Database Integration Tutorial"
          ),
          searchTopic(
            812,
            "CRUD",
            "Learn Create, Read, Update, and Delete operations in a backend application.",
            "CRUD REST API Node Express Tutorial"
          ),
        ],
      },
      {
        day: 7,
        title: "Backend Project & Revision",
        topics: [
          searchTopic(
            813,
            "Build Backend API",
            "Combine Node.js, Express, routes, authentication, and database operations into an API.",
            "Build REST API Node Express Backend Project"
          ),
          searchTopic(
            814,
            "Final Revision",
            "Review Node.js, npm, Express, routes, REST APIs, HTTP methods, authentication, JWT, databases, and CRUD.",
            "Backend Development Complete Revision Node Express"
          ),
        ],
      },
    ],
  },
};

export { courseContent };
export default courseContent;