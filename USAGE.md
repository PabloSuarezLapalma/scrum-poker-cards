# 🎮 How to Use Scrum Poker

## Quick Start

### 1. Start the Application
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

### 2. Create a New Room
1. Enter your name in the "Your Name" field
2. Click "Create Room" (default option)
3. Click "Create & Join"
4. You'll get a unique 6-character room code (e.g., "A3F7K2")

### 3. Share the Room Code
- Click on the room code button in the top-right to copy it
- Share the code with your team via Slack, Teams, etc.

### 4. Team Members Join
1. Other users open the app
2. Enter their name
3. Click "Join Room"
4. Enter the room code
5. Click "Join Room"

### 5. Start Estimating
1. Each person selects a card from their deck
2. Cards appear face-down on the planning table
3. Wait for everyone to vote (progress shown: "3 / 5 voted")
4. Click "Reveal Cards" when all have voted
5. Discuss the estimates
6. Click "New Round" to start again

## 🎴 Card Scales

### Fibonacci (Default)
Best for standard story point estimation
- Values: 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕

### Powers of 2
Best for technical complexity estimation
- Values: 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕

### T-Shirt Sizes
Best for high-level roadmap planning
- Values: XS, S, M, L, XL, XXL, ?, ☕

### Custom Scale
Create your own scale:
1. Click "Settings" (mobile) or see left sidebar
2. Expand "Card Scale"
3. Click "Custom Scale"
4. Add your values one by one
5. Remove values by clicking the X

## 📱 Mobile Usage

### Collapsible Settings
On mobile, settings are hidden by default:
1. Tap "Settings" button at top
2. Settings panel slides down
3. Change scale or access actions
4. Tap anywhere else to close

### Card Selection
- Swipe through cards horizontally
- Tap to select
- Selected card shows with yellow checkmark
- Appears large at the top

## 🎯 Planning Table

### Understanding the Table
- **Circular Layout**: Participants arranged around virtual table
- **Face-Down Cards**: Shows "?" when voted but not revealed
- **Empty Slot**: Dashed border means user hasn't voted yet
- **Your Avatar**: Has white ring border
- **Colors**: Each user gets random color (Red/Blue/Yellow/Green)

### Real-Time Updates
- New users appear instantly when they join
- Cards flip instantly when selected
- Inactive users (10s) disappear automatically
- "Reveal Cards" button becomes active when all have voted

## ⚙️ Settings & Actions

### Reveal Cards Button
- **Disabled** (gray): Not all users have voted yet
- **Enabled** (green): All users have voted - click to reveal
- **After Reveal**: Shows checkmark, can't reveal again

### New Round Button
- Clears all votes
- Resets all cards to unselected
- Hides revealed cards
- Keeps same participants and settings

### Leave Room Button
- Exits current room
- Returns to join/create screen
- Other users remain in the room

## 🔧 Troubleshooting

### User Not Appearing?
- Check they entered the correct room code
- Make sure they clicked "Join Room"
- Try refreshing both browsers

### Cards Not Syncing?
- Check localStorage is enabled
- Try hard refresh (Ctrl+F5 / Cmd+Shift+R)
- Check console for errors

### Room Code Not Working?
- Codes are case-sensitive (auto-uppercased)
- Codes are 6 characters exactly
- Room creator must be active

### Mobile Layout Issues?
- App requires JavaScript enabled
- Works best on modern browsers (Chrome, Safari, Edge, Firefox)
- Portrait orientation recommended

## 💡 Tips & Best Practices

### Facilitator Role
1. Create the room first
2. Share code before meeting starts
3. Change scale if needed before estimation
4. Wait for all votes before revealing
5. Use "New Round" between stories

### For Estimators
1. Join room as soon as you get the code
2. Keep your tab/window active
3. Vote honestly and independently
4. Don't discuss estimates until revealed
5. Re-vote if you change your mind (just click another card)

### Remote Teams
- Share screen to show the table
- Use ? card if you need to ask questions
- Use ☕ card if you need a break
- Discuss outliers (highest/lowest) first

## 🌟 Advanced Features

### Multi-Tab Testing
1. Open app in 2 browser tabs
2. Join same room with different names
3. See real-time sync in action

### Custom Scale Examples
- **Hour Estimation**: 1, 2, 4, 8, 16, 24, 40
- **Risk Level**: Low, Medium, High, Critical
- **Confidence**: 0%, 25%, 50%, 75%, 100%
- **Priority**: Must Have, Should Have, Could Have, Won't Have

### Keyboard Shortcuts
- Numbers 0-9: Select corresponding card (if available)
- R: New Round
- Esc: Deselect card

## 📊 Session Management

### Room Persistence
- Rooms persist in localStorage
- Survive browser refresh
- Last 10 seconds after last active user leaves
- Then auto-cleanup

### User Activity
- Heartbeat every 3 seconds
- Timeout after 10 seconds inactive
- Closing tab = immediate leave
- Keeps session across page refresh
