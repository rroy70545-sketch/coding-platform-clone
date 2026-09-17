const quizzes = {
  // =====================================================
  // DATA STRUCTURES & ALGORITHMS
  // =====================================================

  dsa: [
    {
      id: 1,
      question: "What is a data structure?",
      options: [
        "A way to organize and store data",
        "A programming language",
        "A computer processor",
        "An operating system",
      ],
      answer: 0,
    },

    {
      id: 2,
      question: "Which data structure follows the LIFO principle?",
      options: [
        "Queue",
        "Stack",
        "Array",
        "Linked List",
      ],
      answer: 1,
    },

    {
      id: 3,
      question: "Which data structure follows the FIFO principle?",
      options: [
        "Stack",
        "Tree",
        "Queue",
        "Graph",
      ],
      answer: 2,
    },

    {
      id: 4,
      question: "Which of the following is a linear data structure?",
      options: [
        "Tree",
        "Graph",
        "Array",
        "Binary Tree",
      ],
      answer: 2,
    },

    {
      id: 5,
      question:
        "Which algorithm is commonly used to find the shortest path in a weighted graph?",
      options: [
        "Binary Search",
        "Dijkstra's Algorithm",
        "Bubble Sort",
        "Linear Search",
      ],
      answer: 1,
    },
  ],


  // =====================================================
  // FULL STACK WEB DEVELOPMENT
  // =====================================================

  "full-stack": [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Machine Language",
        "Home Tool Markup Language",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which language is mainly used to add interactivity to web pages?",
      options: [
        "HTML",
        "CSS",
        "JavaScript",
        "SQL",
      ],
      answer: 2,
    },

    {
      id: 3,
      question: "What is React?",
      options: [
        "A database",
        "A JavaScript library",
        "An operating system",
        "A programming language",
      ],
      answer: 1,
    },

    {
      id: 4,
      question:
        "Which HTTP method is commonly used to retrieve data?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "PATCH",
      ],
      answer: 0,
    },

    {
      id: 5,
      question:
        "Which technology is commonly used for storing structured application data?",
      options: [
        "Database",
        "HTML",
        "CSS",
        "Browser",
      ],
      answer: 0,
    },
  ],


  // =====================================================
  // ARTIFICIAL INTELLIGENCE
  // =====================================================

  ai: [
    {
      id: 1,
      question: "What does AI stand for?",
      options: [
        "Automated Internet",
        "Artificial Intelligence",
        "Advanced Interface",
        "Applied Information",
      ],
      answer: 1,
    },

    {
      id: 2,
      question:
        "Which type of machine learning uses labeled data?",
      options: [
        "Unsupervised Learning",
        "Supervised Learning",
        "Reinforcement Learning",
        "Random Learning",
      ],
      answer: 1,
    },

    {
      id: 3,
      question:
        "Which type of learning finds patterns in unlabeled data?",
      options: [
        "Supervised Learning",
        "Reinforcement Learning",
        "Unsupervised Learning",
        "Manual Learning",
      ],
      answer: 2,
    },

    {
      id: 4,
      question: "What is a neural network inspired by?",
      options: [
        "Computer hardware",
        "The human brain",
        "The internet",
        "Databases",
      ],
      answer: 1,
    },

    {
      id: 5,
      question: "Deep learning mainly uses:",
      options: [
        "Deep databases",
        "Neural networks with multiple layers",
        "Only simple rules",
        "HTML and CSS",
      ],
      answer: 1,
    },
  ],


  // =====================================================
  // DATABASE MANAGEMENT
  // =====================================================

  database: [
    {
      id: 1,
      question: "What is SQL mainly used for?",
      options: [
        "Managing databases",
        "Designing images",
        "Creating operating systems",
        "Editing videos",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which SQL command is used to retrieve data?",
      options: [
        "INSERT",
        "UPDATE",
        "SELECT",
        "DELETE",
      ],
      answer: 2,
    },

    {
      id: 3,
      question:
        "Which key uniquely identifies a record in a table?",
      options: [
        "Foreign Key",
        "Primary Key",
        "Secondary Key",
        "Normal Key",
      ],
      answer: 1,
    },

    {
      id: 4,
      question:
        "Which SQL command adds a new record?",
      options: [
        "INSERT",
        "SELECT",
        "UPDATE",
        "CREATE",
      ],
      answer: 0,
    },

    {
      id: 5,
      question: "What is a database table made up of?",
      options: [
        "Rows and columns",
        "Only images",
        "Only files",
        "Only programs",
      ],
      answer: 0,
    },
  ],


  // =====================================================
  // ANDROID APP DEVELOPMENT
  // =====================================================

  android: [
    {
      id: 1,
      question: "What is Android?",
      options: [
        "A mobile operating system",
        "A database",
        "A web browser",
        "A programming language",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which language is commonly used for modern Android development?",
      options: [
        "Kotlin",
        "HTML",
        "SQL",
        "CSS",
      ],
      answer: 0,
    },

    {
      id: 3,
      question: "What is an Android Activity?",
      options: [
        "A database table",
        "A screen or entry point for user interaction",
        "A programming language",
        "A server",
      ],
      answer: 1,
    },

    {
      id: 4,
      question:
        "Which component is commonly used to display text in Android?",
      options: [
        "TextView",
        "DatabaseView",
        "TextSQL",
        "HTMLView",
      ],
      answer: 0,
    },

    {
      id: 5,
      question: "What is an APK?",
      options: [
        "Android application package",
        "Android programming key",
        "Application processing kernel",
        "Android project kit",
      ],
      answer: 0,
    },
  ],


  // =====================================================
  // CYBERSECURITY
  // =====================================================

  cybersecurity: [
    {
      id: 1,
      question: "What is cybersecurity?",
      options: [
        "Protecting digital systems and data",
        "Creating websites",
        "Designing graphics",
        "Managing databases",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which attack attempts to trick users into revealing sensitive information?",
      options: [
        "Phishing",
        "Sorting",
        "Compilation",
        "Caching",
      ],
      answer: 0,
    },

    {
      id: 3,
      question: "What does malware refer to?",
      options: [
        "Malicious software",
        "Database software",
        "Programming tools",
        "Security hardware",
      ],
      answer: 0,
    },

    {
      id: 4,
      question: "Which password is generally stronger?",
      options: [
        "123456",
        "password",
        "Rohit123",
        "T9#kL7!mQ2@z",
      ],
      answer: 3,
    },

    {
      id: 5,
      question:
        "Which principle ensures that only authorized users can access information?",
      options: [
        "Confidentiality",
        "Compression",
        "Compilation",
        "Caching",
      ],
      answer: 0,
    },
  ],


  // =====================================================
  // DATA ANALYTICS
  // =====================================================

  "data-analytics": [
    {
      id: 1,
      question: "What is data analytics?",
      options: [
        "Analyzing data to discover useful insights",
        "Creating computer hardware",
        "Designing websites",
        "Writing operating systems",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which Python library is commonly used for data analysis?",
      options: [
        "Pandas",
        "React",
        "Express",
        "Bootstrap",
      ],
      answer: 0,
    },

    {
      id: 3,
      question: "What is data cleaning?",
      options: [
        "Removing or correcting inaccurate data",
        "Deleting all data",
        "Encrypting a database",
        "Creating a website",
      ],
      answer: 0,
    },

    {
      id: 4,
      question:
        "Which chart is commonly used to show trends over time?",
      options: [
        "Line chart",
        "Pie chart",
        "Icon",
        "Table only",
      ],
      answer: 0,
    },

    {
      id: 5,
      question: "What is the purpose of data visualization?",
      options: [
        "To communicate data and patterns visually",
        "To delete data",
        "To hide all information",
        "To replace databases",
      ],
      answer: 0,
    },
  ],


  // =====================================================
  // BACKEND DEVELOPMENT
  // =====================================================

  backend: [
    {
      id: 1,
      question: "What is backend development?",
      options: [
        "Building server-side application logic",
        "Designing only website colors",
        "Creating images",
        "Editing videos",
      ],
      answer: 0,
    },

    {
      id: 2,
      question:
        "Which runtime is commonly used to run JavaScript on the server?",
      options: [
        "Node.js",
        "HTML",
        "CSS",
        "MySQL",
      ],
      answer: 0,
    },

    {
      id: 3,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Internet",
        "Application Processing Input",
        "Automated Program Integration",
      ],
      answer: 0,
    },

    {
      id: 4,
      question:
        "Which HTTP method is commonly used to create new data?",
      options: [
        "GET",
        "POST",
        "DELETE",
        "HEAD",
      ],
      answer: 1,
    },

    {
      id: 5,
      question: "What is authentication used for?",
      options: [
        "Verifying a user's identity",
        "Deleting a database",
        "Changing CSS",
        "Compressing images",
      ],
      answer: 0,
    },
  ],
};

export default quizzes;