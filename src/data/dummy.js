export const projectList = [
  {
    id: 1,
    title: "AI Learning Assistant",
    description: "Build an AI-powered assistant to guide learners.",
    category: "AI",
    status: "open",

    location: {
      id: 1,
      description: "Remote",
    },

    requiredSkills: [
      { id: 1, name: "JavaScript" },
      { id: 3, name: "Node.js" },
    ],

    teamMembersCount: 2,
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: 2,
    title: "Collaborative Task Manager",
    description: "A platform for teams to manage tasks effectively.",
    category: "Web App",
    status: "in_progress",

    location: {
      id: 2,
      description: "Bangalore, India",
    },

    requiredSkills: [
      { id: 2, name: "React" },
      { id: 4, name: "UI/UX Design" },
    ],

    teamMembersCount: 1,
    createdAt: "2025-01-25T11:00:00Z",
  },
];

export const projectDashboard = {
  id: 1,
  title: "AI Learning Assistant",
  description: "Build an AI-powered assistant to guide learners.",
  category: "AI",
  status: "open",

  location: {
    id: 1,
    description: "Remote",
  },

  requiredSkills: [
    { id: 1, name: "JavaScript" },
    { id: 3, name: "Node.js" },
  ],

  team: [
    {
      id: 1,
      user: {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav@example.com",
      },
      role: {
        id: 2,
        name: "Project Admin",
      },
    },
    {
      id: 2,
      user: {
        id: 3,
        name: "Rohan Malik",
        email: "rohan@example.com",
      },
      role: {
        id: 1,
        name: "Contributor",
      },
    },
  ],

  applications: [
    {
      id: 1,
      status: "pending",
      message: "I would like to contribute to UI/UX and frontend!",
      user: {
        id: 2,
        name: "Sara Verma",
        email: "sara@example.com",
      },
    },
    {
      id: 2,
      status: "approved",
      message: "Experienced in backend systems. Happy to join!",
      user: {
        id: 3,
        name: "Rohan Malik",
        email: "rohan@example.com",
      },
    },
  ],
};
export const userProfile = {
  id: 1,
  name: "Aarav Sharma",
  email: "aarav@example.com",
  bio: "Full-stack developer passionate about collaboration.",

  skills: [
    { id: 1, name: "JavaScript" },
    { id: 3, name: "Node.js" },
  ],
};
export const applicationList = [
  {
    id: 1,
    status: "pending",
    message: "I would like to contribute to UI/UX and frontend!",

    applicant: {
      id: 2,
      name: "Sara Verma",
      email: "sara@example.com",
    },

    project: {
      id: 1,
      title: "AI Learning Assistant",
    },
  },
  {
    id: 2,
    status: "approved",
    message: "Experienced in backend systems. Happy to join!",

    applicant: {
      id: 3,
      name: "Rohan Malik",
      email: "rohan@example.com",
    },

    project: {
      id: 1,
      title: "AI Learning Assistant",
    },
  },
];
