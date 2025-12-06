export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
}

export interface Module {
    id: string;
    title: string;
    duration: string; // e.g. "15 min"
    content: string; // Markdown-like or text
    type: 'video' | 'reading' | 'lab';
    videoUrl?: string;
    quiz?: QuizQuestion[];
    toolId?: 'campaign' | 'image' | 'seo' | 'brand-voice' | 'analytics';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
    thumbnail: string;
    modules: Module[];
}

export interface GeneratedCampaign {
    script: string;
    socialPosts: {
        platform: string;
        content: string;
    }[];
    seoKeywords: string[];
}

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
}

export interface UserProgress {
    user_id: string;
    course_id: string;
    module_id: string;
    completed: boolean;
    score?: number; // For quizzes
    completed_at: string;
}

export interface UserArtifact {
    id: string;
    user_id: string;
    course_id?: string;
    module_id?: string;
    type: 'campaign' | 'image' | 'seo_analysis' | 'brand_voice' | 'analytics_report';
    title: string;
    content: any; // JSON data
    created_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    condition: (progress: UserProgress[], artifacts: UserArtifact[]) => boolean;
}
