# AI Quest System - Frontend Implementation

## Overview

Complete implementation of AI-powered quest system with user and admin features.

## 📦 Service Layer (`src/lib/services/ai.ts`)

### User Features

#### Quest Management

- `fetchDailyQuests(lang)` - Get today's, yesterday's, and day before yesterday's daily quests
- `fetchWeeklyQuests(lang)` - Get this week's, last week's, and two weeks ago's weekly quests
- `completeQuest(questId, lang)` - Mark a quest as completed and earn XP
- `fetchCompletedQuests(lang, page, limit, type?)` - Get paginated history of completed quests
- `fetchSingleQuest(questId, lang)` - Get detailed info about a specific quest

#### AI Chat

- `sendAIChat(prompt, lang)` - Send a message to AI assistant (costs 1 token)
- `fetchAIConfig(lang)` - Get AI configuration and user stats (tokens, quest counts, etc.)
- `fetchAIHealth(lang)` - Get system health status

### Admin Features

- `forceGenerateDailyQuests(lang)` - Manually trigger daily quest generation for current user
- `forceGenerateWeeklyQuests(lang)` - Manually trigger weekly quest generation for current user
- `deleteQuest(questId, lang)` - Delete a specific quest (admin only)

---

## 🧩 Components

### User Components

#### 1. Quest Display Components

**Location:** `src/components/landing/`

- **`todaysQuests.tsx`** - Shows today's daily quests
  - Displays only TODAY's quests
  - Mark complete button with emerald-teal gradient
  - XP badges, completion status
  - Community filtering

- **`weeklyQuests.tsx`** - Shows this week's weekly quests
  - Displays only THIS_WEEK's quests
  - Same styling as daily quests with blue theme
  - Community filtering

**Usage:**

```tsx
<TodaysQuests communityId={communityId} />
<WeeklyQuests communityId={communityId} />
```

#### 2. AI Chat Component

**Location:** `src/components/ai/AIChat.tsx`

**Features:**

- Real-time AI chat interface
- Token-based system (1 token per message)
- 4000 character limit
- Chat history display
- User/AI message differentiation

**Usage:**

```tsx
<AIChat />
```

**Route:** Create at `/[lang]/(home)/ai/chat/page.tsx`

#### 3. Completed Quests History

**Location:** `src/components/ai/CompletedQuestsHistory.tsx`

**Features:**

- Paginated quest history (20 per page)
- Filter by type (All, Daily, Weekly)
- Shows XP earned, completion date
- Quest details with community info

**Usage:**

```tsx
<CompletedQuestsHistory />
```

**Route:** Create at `/[lang]/(home)/quests/history/page.tsx`

### Admin Components

#### AI Quest Management Dashboard

**Location:** `src/components/admin/AIQuestManagement.tsx`

**Features:**

- **Overview Tab:**
  - System health monitoring (AI service, database, uptime, memory)
  - Quest statistics (total, completed, active, completion rate)
  - Real-time status updates (auto-refresh every 30s)

- **Actions Tab:**
  - Force generate daily quests for current user
  - Force generate weekly quests for current user
  - Manual quest generation controls

- **Configuration Tab:**
  - AI settings (model, token costs, prompt limits)
  - Quest settings (counts, schedules, per-community limits)
  - Feature flags (chat, generation, completion, XP, timezone)

**Usage:**

```tsx
<AIQuestManagement />
```

**Route:** Create at `/[lang]/(home)/admin/ai-quests/page.tsx`

---

## 🔐 Access Control

### User Features (Authenticated Users)

- ✅ View today's daily quests
- ✅ View this week's weekly quests
- ✅ Complete quests and earn XP
- ✅ View completed quest history
- ✅ Use AI chat (requires tokens)
- ✅ View AI config (personal stats)
- ✅ Force generate own quests

### Admin Features (Admin Role Required)

- ✅ Access AI Quest Management dashboard
- ✅ Monitor system health
- ✅ View quest statistics
- ✅ Delete quests
- ✅ View all configuration details

---

## 🚀 Implementation Steps

### 1. Create User Pages

**AI Chat Page:**

```typescript
// src/app/[lang]/(home)/ai/chat/page.tsx
'use client';

import AIChat from '@/components/ai/AIChat';

export default function AIChatPage() {
  return <AIChat />;
}
```

**Quest History Page:**

```typescript
// src/app/[lang]/(home)/quests/history/page.tsx
'use client';

import CompletedQuestsHistory from '@/components/ai/CompletedQuestsHistory';

export default function QuestHistoryPage() {
  return <CompletedQuestsHistory />;
}
```

### 2. Create Admin Page

**AI Quest Management Page:**

```typescript
// src/app/[lang]/(home)/admin/ai-quests/page.tsx
'use client';

import AIQuestManagement from '@/components/admin/AIQuestManagement';
import { RoleGuard } from '@/components/providers/RoleGuard';

export default function AIQuestManagementPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <AIQuestManagement />
    </RoleGuard>
  );
}
```

### 3. Add Navigation Links

**User Navigation:**

```tsx
// Add to user navigation menu
<NavItem href="/[lang]/ai/chat" icon={MessageSquare}>
  AI Chat
</NavItem>
<NavItem href="/[lang]/quests/history" icon={History}>
  Quest History
</NavItem>
```

**Admin Navigation:**

```tsx
// Add to admin navigation menu
<NavItem href="/[lang]/admin/ai-quests" icon={Bot}>
  AI Quest Management
</NavItem>
```

---

## 📊 API Endpoints Used

### User Endpoints

- `GET /ai/quests/daily` - Fetch daily quests
- `GET /ai/quests/weekly` - Fetch weekly quests
- `PATCH /ai/quests/complete` - Complete a quest
- `GET /ai/quests/completed` - Get completed quests history (with pagination)
- `GET /ai/quests/:questId` - Get single quest details
- `POST /ai/chat` - Send AI chat message (costs 1 token)
- `GET /ai/config` - Get AI configuration and user stats
- `GET /ai/health` - Get system health status
- `POST /ai/generate/daily` - Generate daily quests (regular)
- `POST /ai/generate/weekly` - Generate weekly quests (regular)
- `POST /ai/generate/daily/force` - Force generate daily quests (bypass checks)
- `POST /ai/generate/weekly/force` - Force generate weekly quests (bypass checks)

### Admin Endpoints

- `DELETE /ai/quests/:questId` - Delete a quest (requires admin middleware)

---

## 🎨 Design System

### Color Themes

- **Daily Quests:** Purple gradient (500→400→300)
- **Weekly Quests:** Blue gradient (500→400→300)
- **Complete Button:** Emerald-to-Teal gradient (`from-emerald-600 to-teal-600`)
- **Completed State:** Green (`bg-green-50 dark:bg-green-900/20`)
- **XP Badges:** Yellow for daily, Blue for weekly

### Typography

- **Headings:** `font-heading` (Space Grotesk)
- **Numbers:** `font-numeric` (tabular nums)
- **Body:** Inter font family

### Theme Support

- Full light/dark mode support
- Zinc color palette for neutrals
- Proper contrast ratios

---

## ⚡ Features Summary

### ✅ Implemented

1. **Quest Display** - Today's and This Week's quests only
2. **Quest Completion** - Mark complete with XP rewards
3. **AI Chat** - Token-based AI assistant
4. **Quest History** - Paginated completed quests
5. **Admin Dashboard** - Full system monitoring and management
6. **Force Generation** - Manual quest generation for testing
7. **Health Monitoring** - Real-time system status
8. **Configuration View** - AI and quest settings

### 🔄 Auto-Features (Backend)

- Automatic daily quest generation (hourly cron)
- Automatic weekly quest generation (Monday midnight)
- Quest rotation (TODAY → YESTERDAY → DAY_BEFORE_YESTERDAY)
- XP calculation and level progression

---

## 🎯 User Flows

### Quest Completion Flow

1. User views quests in community page
2. Clicks "Mark Complete" button
3. Backend validates and awards XP
4. Toast notification shows XP earned and current level
5. Quest list refreshes automatically
6. Completed quest shows green checkmark

### AI Chat Flow

1. User navigates to AI Chat page
2. Checks token balance in header
3. Types message (max 4000 chars)
4. Sends message (costs 1 token)
5. AI responds with generated text
6. Chat history preserved in session
7. User earns tokens by completing quests

### Admin Management Flow

1. Admin accesses AI Quest Management dashboard
2. Views system health and statistics
3. Can force generate quests for testing
4. Monitors quest completion rates
5. Reviews configuration settings
6. (Future) Delete problematic quests

---

## 📝 Notes

- All components use TanStack Query for data fetching and caching
- Toast notifications use Sonner library
- Forms use React Hook Form with Zod validation
- All API calls include language header for i18n
- Proper loading and error states implemented
- Responsive design for mobile/tablet/desktop
