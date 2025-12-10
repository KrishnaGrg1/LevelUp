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
  // Current token balance for AI interactions (optional until /auth/me fetched)
  tokens?: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
  isVerified: boolean;
  isAdmin: boolean;
  profilePicture?: string;
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
  isPrivate: boolean;
  memberLimit: number;
  clans?: Clan[];

  category?: Category;
  owner?: User;
  members?: CommunityMember[];
  _count?: {
    members: number;
  };
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
      hasOnboarded: boolean;
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
  userId: string;
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

export interface GetMeResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: {
    data: User;
    message: string;
  };
}
export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  // optionally, if you add more fields later
  first_page?: number;
  last_page?: number;
  previous_page?: number;
  next_page?: number;
}
export interface GetAllUsersData {
  users: User[];
  pagination: PaginationMetadata;
}

export interface GetAllUsersResponse {
  statusCode: number;
  body: {
    message: string;
    data: GetAllUsersData;
  };
}

export interface changePasswordResponse {
  statusCode: number;
  body: {
    message: string;
    data: null;
  };
}

export interface adminOverviewResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      totalUsers: number;
      verifiedUsers: number;
      adminUsers: number;
    };
  };
}

export interface GrowthData {
  period: string;
  count: number;
}

export interface UserGrowthResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      range: string;
      totalNewUsers: number;
      growth: GrowthData[];
    };
  };
}
export interface CommunityDTO {
  id: string;
  name: string;
  description?: string;
  currentMembers: number; // number of members
  maxMembers: number; // member limit
  visibility: 'private' | 'public';
  userRole: 'ADMIN' | 'MEMBER';
  isPinned?: boolean;
  totalXP?: number;
  level?: number;
}

export interface GetMyCommunities {
  statusCode: number;
  body: {
    message: string;
    data: CommunityDTO[];
  };
}

export interface CreateCommunityInput {
  name: string;
  description?: string;
  memberLimit?: number;
  isPrivate?: boolean;
  photo?: string;
  image?: File; // Add this
}

// ✅ Updated CreateCommunityResponse
export interface CreateCommunityResponse {
  statusCode: number;
  body: {
    message: string;
    data: CommunityDTO; // changed from 'any' to CommunityDTO
  };
}
export interface TogglePinDTO {
  communityId: string;
  isPinned: boolean;
}
export interface TogglePinResponse {
  statusCode: number;
  body: {
    message: string;
    data: TogglePinDTO[];
  };
}

export interface searchCommunitiesResponse {
  statusCode: number;
  body: {
    message: string;
    data: Community[];
  };
}

export type UpdateUserPayload = Partial<Pick<User, 'UserName' | 'email' | 'level' | 'isVerified'>>;

export interface fullUserObjectResponse {
  statusCode: number;
  body: {
    message: string;
    data: User;
  };
}

interface communityDetailById {
  id: string;
  name: string;
  description: string;
  memberLimit: number;
  photo?: string;
  _count: {
    members: number;
    clans: number;
  };
}
export interface communityDetailByIdResponse {
  statusCode: number;
  body: {
    message: string;
    data: communityDetailById;
  };
}

export interface CommunityMemberProfile {
  totalXP: number;
  level: number;
  userRole: 'ADMIN' | 'MEMBER';
  communityId: string;
  communityName: string;
}

export interface CommunityMemberProfileResponse {
  statusCode: number;
  body: {
    message: string;
    data: CommunityMemberProfile;
  };
}

export interface Sender {
  id: string;
  UserName: string;
  profilePicture: string | null;
  level: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  UserName: string;
  sender: Sender;
  communityId?: string;
  clanId?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface SendMessagePayload {
  content: string;
  type?: 'text' | 'image' | 'file';
  attachments?: File[];
}

export interface MessageResponse {
  success: boolean;
  data: Message;
  error?: string;
}

export interface GetCommunityMessagesResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      messages: Message[];
      pagination: Pagination;
    };
  };
}

export interface OnboardingResponse {
  body: {
    message: string;
    data?: {
      success: boolean;
    };
  };
}

export interface getCategoriesResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      count: number;
      categories: string[];
    };
  };
}
