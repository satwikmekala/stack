# Gym Tracker - Product Requirements Document

## Executive Summary

**Product Name**: stack
**Version**: 1.0 (MVP)  
**Target Launch**: Q1 2025  
**Platform**: Mobile-first Web App

stack is a utility-first strength training companion that solves the core problem of "what should I do in the gym today?" through smart defaults, progressive overload tracking, and a clean, distraction-free interface.

## Problem Statement

Target users currently solve their gym tracking needs through:

- WhatsApp notes or iPhone notes app
- Manual calculations for weight progression
- Googling "beginner workout routines" repeatedly
- Inconsistent training due to decision fatigue

**Core Problems:**

1. **Decision Fatigue**: Users waste mental energy deciding what exercises to do
2. **Progress Tracking**: Manual tracking leads to forgotten PRs and inconsistent progression
3. **Routine Confusion**: Beginners don't know if they're training efficiently
4. **App Bloat**: Existing fitness apps overwhelm users with features they don't need

## Target Audience

**Primary Users:**

- **Age**: 16-30 years old
- **Experience**: Beginner to intermediate gym-goers (0-3 years consistent training)
- **Motivation**: Want to build strength and muscle systematically
- **Behavior**: Prefer utility over entertainment, value simplicity over features
- **Current Pain**: Using notes apps or inconsistent tracking methods

**User Personas:**

### Alex (19, College Student)

- Started going to gym 6 months ago
- Currently uses iPhone notes to track workouts
- Wants to "get bigger" but doesn't know if he's progressing
- Values simple, fast tools (uses Apple Music, not Spotify)

### Sarah (26, Young Professional)

- Goes to gym 3-4x per week consistently
- Uses various apps but finds them overwhelming
- Wants to focus on strength, not cardio or nutrition
- Prefers one-time purchases over subscriptions

## Product Vision

**Mission**: Remove decision fatigue from strength training while enabling consistent progressive overload.

**Vision**: The simplest, most effective way to track strength training progress - replacing notes apps with intelligent defaults and automated progression.

**Positioning**: "Linear for gym tracking" - utility-first, distraction-free, exceptionally good at one core function.

## Core Principles

### 1. Utility Over Engagement

- No streaks, badges, or gamification
- No social features or leaderboards
- Focus on functional value, not time-on-app

### 2. Smart Defaults Over Customization

- Pre-built routines based on user goals
- Automated progression suggestions
- Minimal configuration required

### 3. Apple Fitness Aesthetic

- Clean, modern design with purposeful color
- Scandinavian-inspired minimalism with personality
- Large, readable typography
- Subtle animations, no distractions

### 4. Mobile-First Experience

- Thumb-friendly interface design
- Quick logging (< 30 seconds per exercise)
- Offline-first functionality
- Fast loading and smooth interactions

## Feature Specifications

### 1. Onboarding Flow

**Goal**: Generate personalized workout plan in under 2 minutes

**User Inputs:**

- Name/Nickname
- Age (16-50)
- Experience level: "Never been to gym" / "Been going for a few months" / "Going for over a year"
- Available days: 2-6 days per week
- Training intensity: "Take it easy" / "Moderate effort" / "Push hard"
- Primary goal: "Build muscle" / "Get stronger" / "General fitness"

**Smart Routine Generation:**

- **2-3 days**: Upper/Lower split
- **4 days**: Push/Pull/Legs + Upper
- **5-6 days**: Push/Pull/Legs/Arms/Upper/Lower

**Exercise Selection Logic:**

- Prioritize compound movements (squat, bench, deadlift, rows)
- Include 1-2 isolation exercises per session
- Adjust volume based on experience level
- Pre-populate starting weights based on beginner standards

### 2. Home Screen

**Primary View: Today's Workout**

- Workout name (e.g., "Push Day", "Upper Body")
- Exercise list with target sets/reps
- Previous performance shown as reference
- Estimated workout time
- Single CTA: "Start Workout"

**Secondary Actions:**

- "Can't train today" → reschedule without penalty
- Calendar view access
- Settings access

**Visual Design:**

- Hero section with today's focus
- Apple Fitness-style color gradients
- Large, readable exercise names
- Progress indicators (sets completed)

### 3. Workout Logging Interface

**Exercise View:**

- Exercise name and brief form cue
- Set logging interface:
  - Weight (kg/lbs toggle)
  - Reps completed
  - Optional RPE (1-10 scale)
- Previous performance reference
- Progression suggestion: "Try +2.5kg today" or "Aim for 2 more reps"

**Smart Suggestions:**

- Pre-fill last session's weight
- Suggest weight increase if previous reps exceeded target
- Suggest rep increase if weight stayed same
- Fallback to beginner standards if no history

**Set Logging:**

- Tap weight/reps to edit
- Swipe gesture to complete set
- Auto-advance to next set after logging
- Option to skip exercise entirely

**Session Completion:**

- Simple "Workout Complete" confirmation
- Optional session notes
- Automatic progression calculations for next session

### 4. Progressive Overload Logic

**Weight Progression:**

- If user hits upper rep range (e.g., 3x12), suggest +2.5kg next session
- If user fails to hit lower rep range (e.g., can't do 3x8), suggest -2.5kg
- Maintain weight if within target rep range

**Rep Progression:**

- If weight can't be increased, suggest adding 1-2 reps per set
- Maximum rep ranges: 15 for accessories, 12 for compounds
- Reset to lower rep range when weight increases

**Plateau Handling:**

- If same weight/reps for 3+ sessions, suggest deload week
- Offer alternative exercises for variety
- Reset progression scheme if needed

### 5. Calendar & History View

**Calendar Interface:**

- Monthly view with completion indicators
- Color coding: Green (completed), Gray (skipped), Blue (partial)
- GitHub-style activity heatmap
- Tap day to view workout details

**Workout History:**

- List view of past sessions
- Exercise progress over time
- Personal records highlighting
- Search/filter by exercise or muscle group

### 6. Weekly Summary

**Overview Metrics:**

- Sessions completed vs planned
- Total volume (sets × reps × weight)
- Muscle groups trained
- Exercises with progress made

**Insights:**

- "You're getting stronger at bench press (+5kg this week)"
- "Consider adding more back work next week"
- "You've been consistent - keep it up!"

**Next Week Planning:**

- Suggested adjustments based on performance
- Muscle group balance recommendations
- Recovery considerations

### 7. Settings & Profile

**Profile Management:**

- Edit onboarding preferences
- Adjust routine difficulty
- Change units (kg/lbs)
- Update training days

**Data Management:**

- Export workout data (JSON format)
- Import backup data
- Clear all data option
- Account deletion

**App Settings:**

- Notification preferences
- Rest timer settings
- Default RPE tracking on/off
- Colorblind-friendly mode

## Technical Requirements

### Frontend Stack

- **Framework**: React/Next.js or Vue/Nuxt
- **Styling**: Tailwind CSS
- **Icons**: Lucide React or Heroicons
- **Charts**: Recharts (for simple progress visualization)
- **PWA**: Service worker for offline functionality

### Data Storage

- **Primary**: Browser localStorage/IndexedDB
- **Backup**: JSON export/import functionality
- **Migration Path**: Prepared for future cloud sync

### Performance Requirements

- **Loading**: < 2 seconds initial load
- **Logging**: < 1 second per set entry
- **Offline**: Full functionality without internet
- **Battery**: Minimal background processing

### Device Compatibility

- **Mobile**: iOS Safari, Android Chrome
- **Desktop**: Chrome, Firefox, Safari (responsive)
- **PWA**: Installable on mobile devices
- **Accessibility**: WCAG 2.1 AA compliance

## Exercise Database

### Core Compound Movements

- **Chest**: Bench Press, Incline Bench Press, Dumbbell Press
- **Back**: Pull-ups, Lat Pulldown, Barbell Rows, Dumbbell Rows
- **Legs**: Squats, Deadlifts, Romanian Deadlifts, Leg Press
- **Shoulders**: Overhead Press, Dumbbell Shoulder Press
- **Arms**: Dips, Close-Grip Bench Press

### Isolation Exercises

- **Chest**: Chest Flyes, Cable Flyes
- **Back**: Face Pulls, Reverse Flyes
- **Legs**: Leg Curls, Calf Raises, Leg Extensions
- **Shoulders**: Lateral Raises, Rear Delt Flyes
- **Arms**: Bicep Curls, Tricep Extensions, Hammer Curls

### Exercise Metadata

- Primary muscle groups
- Secondary muscle groups
- Equipment needed
- Difficulty rating
- Form cues (1-2 sentences)

## User Experience Guidelines

### Interaction Design

- **Thumb-friendly**: All primary actions within thumb reach
- **Gesture-based**: Swipe to complete sets, pull to refresh
- **Haptic feedback**: Subtle vibration on key actions
- **Loading states**: Skeleton screens, not spinners

### Visual Design System

- **Colors**:
  - Primary: Apple Fitness-inspired blues and greens
  - Secondary: Warm grays and whites
  - Accent: Orange for progression indicators
- **Typography**:
  - Headings: Bold, large (24px+)
  - Body: Medium weight (16px)
  - Data: Monospace for numbers
- **Spacing**: 8px grid system
- **Animations**: 200ms ease-out transitions

### Content Strategy

- **Tone**: Encouraging but not cheesy
- **Language**: Simple, direct, action-oriented
- **Messaging**: Focus on progress, not perfection
- **Error States**: Helpful, not punitive

## Success Metrics

### Primary KPIs

- **Retention**: 70% of users return within 7 days
- **Consistency**: Users complete 80% of planned workouts
- **Progression**: 90% of users show strength gains within 4 weeks
- **Efficiency**: Average workout logging time < 5 minutes

### Secondary Metrics

- **Engagement**: Average session duration 15-30 minutes
- **Completion**: 95% of started workouts are finished
- **Satisfaction**: 4.5+ App Store rating
- **Technical**: 99.9% uptime, < 2s loading times

## Monetization Strategy

### Phase 1: Free MVP

- Complete core functionality
- No paywalls or feature restrictions
- Focus on product-market fit

### Phase 2: Premium Features

- **One-time purchase**: $9.99-19.99
- **Premium features**:
  - Advanced analytics and progress visualization
  - Custom routine creation
  - Cloud sync and backup
  - Exercise video library
  - Multiple program templates

### Phase 3: Ecosystem

- **Nutrition companion**: Simple macro tracking
- **Recovery tracking**: Sleep and soreness monitoring
- **Community features**: Anonymous progress sharing

## Risk Assessment

### Technical Risks

- **Data Loss**: Mitigated by export/import functionality
- **Performance**: Extensive testing on low-end devices
- **Offline Sync**: Robust conflict resolution for future cloud features

### Market Risks

- **Competition**: Differentiate through simplicity, not features
- **User Acquisition**: Focus on word-of-mouth and genuine utility
- **Retention**: Avoid feature creep that dilutes core value

### Product Risks

- **Oversimplification**: Regular user feedback to ensure adequate functionality
- **Scalability**: Architecture prepared for future feature additions
- **Monetization**: Validate willingness to pay early

## Development Phases

### Phase 1: MVP (8-10 weeks)

- **Week 1-2**: Core architecture and design system
- **Week 3-4**: Onboarding and routine generation
- **Week 5-6**: Workout logging and progression logic
- **Week 7-8**: Calendar view and history
- **Week 9-10**: Testing, refinement, and launch preparation

### Phase 2: Enhancement (4-6 weeks)

- Performance optimization
- Advanced analytics
- User feedback integration
- Monetization implementation

### Phase 3: Growth (Ongoing)

- User acquisition strategies
- Feature expansion based on usage data
- Platform expansion considerations

## Conclusion

Gym Tracker represents a focused solution to a real problem experienced by beginning and intermediate gym-goers. By prioritizing utility over engagement and simplicity over features, we can create a product that genuinely improves users' training consistency and progress.

The key to success will be exceptional execution of core features rather than breadth of functionality. This approach aligns with successful utility-first products and serves an underserved market segment that values effectiveness over entertainment.
