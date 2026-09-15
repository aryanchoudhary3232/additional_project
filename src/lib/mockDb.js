// In-memory mock database for Next.js Backend API routes

export const USERS = [
  {
    id: "u1",
    name: "Dr. Ananya Sharma",
    email: "teacher@iiits.ac.in",
    password: "teacher123",
    role: "teacher",
    department: "Computer Science & Engineering",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    subject: "DBMS & Systems"
  },
  {
    id: "u2",
    name: "Rahul Verma",
    email: "rahul@iiits.ac.in",
    password: "student123",
    role: "student",
    rollNo: "UG2026-CSE-042",
    batch: "UG 2 (Batch G04)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "u3",
    name: "Priya Patel",
    email: "priya@iiits.ac.in",
    password: "student123",
    role: "student",
    rollNo: "UG2026-ECE-018",
    batch: "UG 2 (Batch G05)",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "u4",
    name: "Amit Kumar",
    email: "amit@iiits.ac.in",
    password: "student123",
    role: "student",
    rollNo: "UG2026-CSE-089",
    batch: "UG 2 (Batch G06)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
];

export let SLIDES = [
  {
    id: "slide-1",
    title: "DBMS Lecture 04 - Relational Algebra & SQL Joins",
    subject: "DBMS",
    uploadedBy: "Dr. Ananya Sharma",
    uploadDate: "2026-08-20",
    fileSize: "4.2 MB",
    fileType: "pdf",
    description: "Covers Inner Join, Outer Join, Cross Join, and Relational Algebra operators with IIIT Sri City DB examples.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloads: 48
  },
  {
    id: "slide-2",
    title: "OOP Lecture 06 - Polymorphism and Abstraction in C++",
    subject: "OOP",
    uploadedBy: "Dr. Ananya Sharma",
    uploadDate: "2026-08-18",
    fileSize: "6.8 MB",
    fileType: "pptx",
    description: "Virtual functions, pure virtual methods, abstract base classes, and dynamic binding examples.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloads: 62
  },
  {
    id: "slide-3",
    title: "ADSA Unit 2 - Graph Algorithms & Dijkstra Shortest Path",
    subject: "ADSA",
    uploadedBy: "Dr. Ananya Sharma",
    uploadDate: "2026-08-15",
    fileSize: "3.5 MB",
    fileType: "pdf",
    description: "Detailed analysis of Dijkstra, Bellman-Ford, and Minimum Spanning Trees with time complexity bounds.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloads: 79
  },
  {
    id: "slide-4",
    title: "OS Lecture 08 - Process Synchronization & Semaphores",
    subject: "OS",
    uploadedBy: "Dr. Ananya Sharma",
    uploadDate: "2026-08-12",
    fileSize: "5.1 MB",
    fileType: "pdf",
    description: "Critical section problem, Peterson's algorithm, Counting & Binary Semaphores, Producer-Consumer problem.",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    downloads: 54
  }
];

export let DOUBTS = [
  {
    id: "doubt-1",
    studentId: "u2",
    studentName: "Rahul Verma",
    studentRoll: "UG2026-CSE-042",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    subject: "DBMS",
    title: "Query regarding 3NF vs BCNF decomposition",
    status: "Pending",
    createdAt: "2026-08-23T14:30:00Z",
    messages: [
      {
        senderId: "u2",
        senderName: "Rahul Verma",
        role: "student",
        text: "Ma'am, in DBMS Lecture 4, Slide 18, why is a relation with 2 functional dependencies (A -> B, B -> C) considered to violate 3NF if A is a candidate key but B is not?",
        timestamp: "02:30 PM"
      }
    ]
  },
  {
    id: "doubt-2",
    studentId: "u3",
    studentName: "Priya Patel",
    studentRoll: "UG2026-ECE-018",
    studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    subject: "OOP",
    title: "Virtual destructor requirement in C++ base class",
    status: "Resolved",
    createdAt: "2026-08-22T10:15:00Z",
    messages: [
      {
        senderId: "u3",
        senderName: "Priya Patel",
        role: "student",
        text: "Hello Ma'am, if I delete a derived class object using a base class pointer, why does memory leak happen without a virtual destructor?",
        timestamp: "10:15 AM"
      },
      {
        senderId: "u1",
        senderName: "Dr. Ananya Sharma",
        role: "teacher",
        text: "Great question Priya! Without `virtual ~Base()`, the C++ compiler performs static binding and calls only the base class destructor. The derived class destructor never runs, causing derived members to leak memory. Always declare your base class destructor `virtual`!",
        timestamp: "10:45 AM"
      }
    ]
  },
  {
    id: "doubt-3",
    studentId: "u4",
    studentName: "Amit Kumar",
    studentRoll: "UG2026-CSE-089",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subject: "ADSA",
    title: "Dijkstra algorithm for negative edge weights",
    status: "In Progress",
    createdAt: "2026-08-23T18:00:00Z",
    messages: [
      {
        senderId: "u4",
        senderName: "Amit Kumar",
        role: "student",
        text: "Ma'am, does Dijkstra work if graph has negative edges but no negative cycle? Or should we strictly use Bellman-Ford?",
        timestamp: "06:00 PM"
      }
    ]
  }
];

export function addSlide(newSlide) {
  SLIDES = [newSlide, ...SLIDES];
  return newSlide;
}

export function deleteSlide(id) {
  SLIDES = SLIDES.filter(s => s.id !== id);
  return true;
}

export function addDoubtMessage(doubtId, message, newStatus = null) {
  const doubt = DOUBTS.find(d => d.id === doubtId);
  if (doubt) {
    doubt.messages.push(message);
    if (newStatus) {
      doubt.status = newStatus;
    }
    return doubt;
  }
  return null;
}

export function createDoubt(newDoubt) {
  DOUBTS = [newDoubt, ...DOUBTS];
  return newDoubt;
}
