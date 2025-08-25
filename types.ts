
export enum Category {
    Marketing = "Marketing",
    Educacion = "Educación",
    SocialMedia = "Social Media",
    Escritura = "Escritura",
    Creatividad = "Creatividad",
    AnalisisDeDatos = "Análisis de datos",
    Codificacion = "Codificación",
    Investigacion = "Investigación",
    Negocios = "Negocios",
    Tecnologia = "Tecnología",
    SaludYBienestar = "Salud y Bienestar",
    Finanzas = "Finanzas",
    Viajes = "Viajes",
    ArteYDiseno = "Arte y Diseño",
    Otras = "Otras",
}

export interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string;
    category: Category;
    createdAt: string;
    author?: string;
    rating?: number;
    downloads?: number;
    isFavorite?: boolean;
    isPublished?: boolean;
}

export interface CommunityPost {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    replies: number;
    likes: number;
}