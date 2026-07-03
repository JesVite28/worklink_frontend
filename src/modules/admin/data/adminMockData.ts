import type {
  AdminChatItem,
  AdminCompany,
  AdminFreelancer,
  AdminRequestItem,
  AdminReportItem,
  AdminReviewItem,
  AdminServiceItem,
  AdminSettingItem,
  AdminUser,
  AdminVacancy,
} from "../models/adminEntities";

export const adminUsers: AdminUser[] = [
  {
    id: "USR-1001",
    name: "María González",
    email: "maria@worklink.com",
    role: "Cliente",
    accountType: "Empresa",
    status: "active",
    createdAt: "2026-06-22",
  },
  {
    id: "USR-1002",
    name: "Carlos Ramírez",
    email: "carlos@worklink.com",
    role: "Freelancer",
    accountType: "Freelancer",
    status: "pending",
    createdAt: "2026-06-21",
  },
  {
    id: "USR-1003",
    name: "Laura Hernández",
    email: "laura@worklink.com",
    role: "Admin",
    accountType: "Empresa",
    status: "active",
    createdAt: "2026-06-20",
  },
];

export const adminCompanies: AdminCompany[] = [
  {
    id: "CMP-2001",
    name: "Tech Solutions",
    sector: "Software",
    location: "Monterrey",
    jobsOpen: 12,
    status: "active",
    createdAt: "2026-06-18",
  },
  {
    id: "CMP-2002",
    name: "Creative Studio",
    sector: "Diseño",
    location: "CDMX",
    jobsOpen: 8,
    status: "active",
    createdAt: "2026-06-17",
  },
  {
    id: "CMP-2003",
    name: "Market Pro",
    sector: "Marketing",
    location: "Guadalajara",
    jobsOpen: 5,
    status: "pending",
    createdAt: "2026-06-16",
  },
];

export const adminFreelancers: AdminFreelancer[] = [
  {
    id: "FRL-3001",
    name: "Ana López",
    specialty: "UI/UX Designer",
    rating: 4.9,
    completedJobs: 128,
    status: "active",
    createdAt: "2026-06-15",
  },
  {
    id: "FRL-3002",
    name: "Pedro Sánchez",
    specialty: "Frontend Developer",
    rating: 4.8,
    completedJobs: 94,
    status: "active",
    createdAt: "2026-06-14",
  },
  {
    id: "FRL-3003",
    name: "Lucía Torres",
    specialty: "Full Stack Developer",
    rating: 4.7,
    completedJobs: 76,
    status: "pending",
    createdAt: "2026-06-13",
  },
];

export const adminVacancies: AdminVacancy[] = [
  {
    id: "VAC-4001",
    title: "Frontend Senior React",
    company: "Tech Solutions",
    category: "Desarrollo Web",
    applications: 48,
    status: "active",
    postedAt: "2026-06-22",
  },
  {
    id: "VAC-4002",
    title: "Diseñador UI/UX",
    company: "Creative Studio",
    category: "Diseño",
    applications: 31,
    status: "active",
    postedAt: "2026-06-21",
  },
  {
    id: "VAC-4003",
    title: "Project Manager",
    company: "Market Pro",
    category: "Gestión",
    applications: 26,
    status: "draft",
    postedAt: "2026-06-20",
  },
];

export const adminServices: AdminServiceItem[] = [
  {
    id: "SRV-5001",
    title: "Brand Identity",
    category: "Diseño",
    provider: "Ana López",
    requests: 62,
    price: "$480",
    status: "active",
  },
  {
    id: "SRV-5002",
    title: "Landing Page",
    category: "Desarrollo",
    provider: "Pedro Sánchez",
    requests: 44,
    price: "$650",
    status: "active",
  },
  {
    id: "SRV-5003",
    title: "Marketing Campaign",
    category: "Marketing",
    provider: "Lucía Torres",
    requests: 28,
    price: "$900",
    status: "pending",
  },
];

export const adminRequests: AdminRequestItem[] = [
  {
    id: "REQ-6001",
    subject: "Validación de cuenta",
    requester: "Carlos Ramírez",
    type: "Moderación",
    priority: "high",
    status: "pending",
    createdAt: "Hace 12 min",
  },
  {
    id: "REQ-6002",
    subject: "Actualización de datos",
    requester: "Tech Solutions",
    type: "Soporte",
    priority: "medium",
    status: "active",
    createdAt: "Hace 40 min",
  },
  {
    id: "REQ-6003",
    subject: "Revisión de publicación",
    requester: "Ana López",
    type: "Aprobación",
    priority: "low",
    status: "draft",
    createdAt: "Hace 1 h",
  },
];

export const adminChats: AdminChatItem[] = [
  {
    id: "CHT-7001",
    participants: "María González · Soporte",
    preview: "Necesito ayuda con la verificación...",
    unreadMessages: 3,
    status: "active",
    updatedAt: "Hace 4 min",
  },
  {
    id: "CHT-7002",
    participants: "Tech Solutions · Ana López",
    preview: "Confirmamos la entrega para mañana.",
    unreadMessages: 0,
    status: "inactive",
    updatedAt: "Hace 22 min",
  },
  {
    id: "CHT-7003",
    participants: "Market Pro · Carlos Ramírez",
    preview: "Enviamos comentarios del proyecto.",
    unreadMessages: 1,
    status: "active",
    updatedAt: "Hace 1 h",
  },
];

export const adminReviews: AdminReviewItem[] = [
  {
    id: "REV-8001",
    author: "Tech Solutions",
    subject: "Ana López",
    rating: 5,
    comment: "Excelente comunicación y entrega puntual.",
    status: "active",
    createdAt: "Hace 2 días",
  },
  {
    id: "REV-8002",
    author: "Market Pro",
    subject: "Pedro Sánchez",
    rating: 4,
    comment: "Muy buen trabajo, solo faltó una revisión final.",
    status: "active",
    createdAt: "Hace 4 días",
  },
  {
    id: "REV-8003",
    author: "Creative Studio",
    subject: "Lucía Torres",
    rating: 5,
    comment: "Resultado impecable y gran atención al detalle.",
    status: "pending",
    createdAt: "Hace 6 días",
  },
];

export const adminReports: AdminReportItem[] = [
  {
    id: "RPT-9001",
    title: "Actividad mensual",
    category: "Usuarios",
    value: "12,480 registros",
    status: "active",
    updatedAt: "Hoy",
  },
  {
    id: "RPT-9002",
    title: "Vacantes publicadas",
    category: "Empleo",
    value: "2,315 publicaciones",
    status: "active",
    updatedAt: "Ayer",
  },
  {
    id: "RPT-9003",
    title: "Solicitudes pendientes",
    category: "Soporte",
    value: "48 tickets",
    status: "pending",
    updatedAt: "Hace 2 h",
  },
];

export const adminSettings: AdminSettingItem[] = [
  {
    id: "SET-1001",
    name: "Modo mantenimiento",
    description: "Activa o desactiva el acceso público al sistema.",
    value: "Desactivado",
    status: "active",
  },
  {
    id: "SET-1002",
    name: "Validación de cuentas",
    description: "Requiere revisión manual para nuevas empresas.",
    value: "Automática",
    status: "active",
  },
  {
    id: "SET-1003",
    name: "Notificaciones",
    description: "Envío de correos y alertas en el panel.",
    value: "Activas",
    status: "active",
  },
];