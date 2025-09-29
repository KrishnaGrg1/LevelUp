// === Enums ===
export enum MemberStatus {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum QuestType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  OneTime = 'OneTime',
}

export enum QuestSource {
  AI = 'AI',
  TEMPLATE = 'TEMPLATE',
  MANUAL = 'MANUAL',
}

// === Interfaces ===
export interface User {
  id: string;
  UserName: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
  isVerified: boolean;

  Clan?: Clan[];
  Community?: Community[];
  CommunityMember?: CommunityMember[];
  otps?: Otp[];
  Quest?: Quest[];
  category?: Category;
  sessions?: Session[];
  keys?: Key[];
}

export interface Session {
  id: string;
  userId: string;
  user?: User;
  expiresAt: Date;
}

export interface Key {
  id: string;
  userId: string;
  user?: User;
  hashedPassword?: string;
  expiresAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  communities?: Community[];
  users?: User[];
}

export interface Otp {
  id: string;
  otp_code: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  user?: User;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  ownerId: string;
  categoryId?: string;
  updatedAt: Date;

  clans?: Clan[];
  category?: Category;
  owner?: User;
  members?: CommunityMember[];
}

export interface Clan {
  id: string;
  name: string;
  isPrivate: boolean;
  xp: number;
  description?: string;
  ownerId: string;
  communityId: string;
  limit: number;
  createdAt: Date;
  updatedAt: Date;

  community?: Community;
  owner?: User;
  members?: CommunityMember[];
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  joinedAt: Date;
  totalXP: number;
  clanId?: string;
  level: number;
  status: MemberStatus;

  clan?: Clan;
  community?: Community;
  user?: User;
  quest?: Quest[];
}

export interface Quest {
  id: string;
  userId: string;
  xpValue: number;
  isCompleted: boolean;
  date: Date;
  createdAt: Date;
  type: QuestType;
  communityMemberId?: string;
  description: string;
  source: QuestSource;

  CommunityMember?: CommunityMember;
  user?: User;
}

//Auth//
export interface UserLoginResponse {
  statusCode: number;
  body: {
    data: {
      isadmin: boolean;
      expiredAt: string;
    };
    message: string;
  };
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserRegisterInput {
  username: string;
  email: string;
  password: string;
}
export interface UserRegisterResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: {
    message: string;
    data: {
      isadmin: boolean;
      expiredAt: string;
    };
  };
}

export interface UserVerifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: {
    message: string;
    data: {
      isadmin: boolean;
      expiredAt: string;
    };
  };
}

export interface UserVerifyInput {
  email: string;
  otp: string;
}

export interface OAuthRequest {
  provider: 'google' | 'github';
  code: string; // Authorization code from OAuth callback
  redirectUri?: string; // Optional, default handled in env
}
export interface LogoutRequest {
  auth_session: string;
}
export interface LogoutResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: {
    message: string;
    data: User;
  };
}
