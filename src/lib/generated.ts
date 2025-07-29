// ----------------------------
// Enums
// ----------------------------
export enum MemberStatus {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export enum QuestType {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  OneTime = "OneTime"
}

export enum QuestSource {
  AI = "AI",
  TEMPLATE = "TEMPLATE",
  MANUAL = "MANUAL"
}

// ----------------------------
// Base Interfaces (without relations)
// ----------------------------
export interface User {
  id: number;
  UserName: string;
  email: string;
  password: string;
  isVerified: boolean;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Otp {
  id: number;
  otp_code: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface Community {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  categoryId?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface Clan {
  id: number;
  name: string;
  isPrivate: boolean;
  xp: number;
  description?: string;
  ownerId: number;
  communityId: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  id: number;
  userId: number;
  communityId: number;
  status: MemberStatus;
  level: number;
  totalXP: number;
  clanId?: number;
  joinedAt: Date;
}

export interface Quest {
  id: number;
  userId: number;
  description: string;
  xpValue: number;
  isCompleted: boolean;
  date: Date;
  createdAt: Date;
  type: QuestType;
  source: QuestSource;
  communityMemberId?: number;
}

// ----------------------------
// Interfaces with Relations
// ----------------------------
export interface UserWithRelations extends User {
  category?: Category;
  otps: Otp[];
  Community: Community[];
  CommunityMember: CommunityMember[];
  Clan: Clan[];
  Quest: Quest[];
}

export interface CategoryWithRelations extends Category {
  users: User[];
  communities: Community[];
}

export interface OtpWithRelations extends Otp {
  user: User;
}

export interface CommunityWithRelations extends Community {
  owner: User;
  category?: Category;
  members: CommunityMember[];
  clans: Clan[];
}

export interface ClanWithRelations extends Clan {
  owner: User;
  community: Community;
  members: CommunityMember[];
}

export interface CommunityMemberWithRelations extends CommunityMember {
  quest: Quest[];
  community: Community;
  user: User;
  clan?: Clan;
}

export interface QuestWithRelations extends Quest {
  user: User;
  CommunityMember?: CommunityMember;
}

// ----------------------------
// Data Transfer Objects (DTOs)
// ----------------------------
export interface CreateUserDto {
  UserName: string;
  email: string;
  password: string;
  categoryId?: number;
}

export interface UpdateUserDto {
  UserName?: string;
  email?: string;
  password?: string;
  isVerified?: boolean;
  xp?: number;
  level?: number;
  categoryId?: number;
}

export interface CreateCommunityDto {
  name: string;
  description?: string;
  ownerId: number;
  categoryId?: number;
}

export interface CreateClanDto {
  name: string;
  isPrivate?: boolean;
  description?: string;
  ownerId: number;
  communityId: number;
  limit?: number;
}

export interface CreateQuestDto {
  userId: number;
  description: string;
  xpValue: number;
  date: Date;
  type?: QuestType;
  source?: QuestSource;
  communityMemberId?: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  UserName: string;
  email: string;
  password: string;
  categoryId?: number;
}

export interface VerifyOtpDto {
  email: string;
  otp_code: string;
}

// ----------------------------
// Response Types
// ----------------------------
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ----------------------------
// Utility Types
// ----------------------------
export type UserPublic = Omit<User, 'password'>;
export type UserProfile = UserPublic & {
  category?: Category;
  totalQuests?: number;
  completedQuests?: number;
  communities?: Community[];
  clans?: Clan[];
};

export type QuestSummary = {
  total: number;
  completed: number;
  pending: number;
  dailyStreak: number;
};

// ----------------------------
// Authentication Types
// ----------------------------
export interface UserLoginResponse {
  statusCode: number;
  body: LoginResponse;
}

export interface LoginResponse {
  data: string;
  message: string; // localized message
}
export interface UserLoginInput {
  email: string;
  password: string;
}
export interface UserData{
  id: string;
  UserName: string;
  email: string;
}
export interface UserRegisterInput {
  UserName: string;
  email: string;
}
export interface UserRegisterInput {
  UserName: string;
  email: string;
}
export interface UserRegisterInput {
  UserName: string;
  email: string;
}
export interface UserRegisterResponse {
  statusCode: number;
  headers: Record<string, string>;
 body:{
  message: string;
  data: UserData
 }
}

// ----------------------------
// Translation Types
// ----------------------------
export type Language = 'eng' | 'arab' | 'chin' | 'nep' | 'span' | 'jap' | 'hind' | 'fr';

export interface TranslationRequest extends Request {
  language: Language;
  body: any;
}

// ----------------------------
// Utility Types for Error Handling
// ----------------------------
export type Async<T, E = Error> = Promise<[T, null] | [null, E]>;

export interface Err {
  message: string;
  code?: string | number;
}

// ----------------------------
// Request Event Interface
// ----------------------------
export interface RequestEvent {
  cookies: {
    get(name: string): { value: string } | undefined;
    set(name: string, value: string, options?: any): void;
    delete(name: string): void;
  };
}

// ----------------------------
// Registration Types
// ----------------------------
export interface RegisterInput {
  UserName: string;
  email: string;
  password: string;
  categoryId?: number;
}

export interface RegisterResponse {
  message: string;
  data: {
    user: UserPublic;
    requiresVerification: boolean;
  };
}

// ----------------------------
// OTP Verification Types
// ----------------------------
export interface VerifyOtpInput {
  email: string;
  otp_code: string;
}

export interface VerifyOtpResponse {
  message: string;
  data: {
    user: UserPublic;
    token: string;
  };
}