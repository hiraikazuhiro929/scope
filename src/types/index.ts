//カテゴリの型定義
export type Category = '勉強・資格' | 'プログラミング' | 'デザイン' | '読書'
    | 'イラスト・絵' | '音楽・作曲' | '執筆・ブログ' | '動画編集' | '写真・撮影' | '筋トレ・運動' |
    '料理・家事' | 'ビジネス' | 'ゲーム制作' | 'アプリ開発' | 'その他';

//カテゴリのアイコンマッピング
export const CATEGORY_ICONS: Record<Category, string> = {
    '勉強・資格': 'BookOpen',
    'プログラミング': 'Code',
    'デザイン': 'Palette',
    '読書': 'Book',
    'イラスト・絵': 'Pen',
    '音楽・作曲': 'Music',
    '執筆・ブログ': 'PenTool',
    '動画編集': 'Video',
    '写真・撮影': 'Camera',
    '料理・家事': 'ChefHat',
    '筋トレ・運動': 'Dumbbell',
    'ビジネス': 'Briefcase',
    'ゲーム制作': 'Gamepad2',
    'アプリ開発': 'Smartphone',
    'その他': 'MoreHorizontal',
};

//ユーザー情報の型定義
export interface User  {
    userId: string;
    nickname: string;
    icon: string;
    bio ?: string;
    primaryCategories: Category[];
    categoryInterests: Record<Category, number>;
    streak: number;
    createdAt: Date;
    lastLoginAt?: Date;
};

//投稿(作業記録)の型
export interface WorkLog{
    logId: string;
    userId: string;
    text: string;
    photoUrl?: string;
    category: Category;
    likes: number;
    createdAt: Date;
    isPublic: boolean;
}

//いいねの型
export interface Like{
    likeId: string;
    logId: string;
    fromUserId: string;
    createdAt: Date;
}

//閲覧記録の型
export interface View{
    viewId: string;
    logId: string;
    viewerId: string;
    viewedAt: Date;
}

//認証状態の型
export interface AuthState{
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}