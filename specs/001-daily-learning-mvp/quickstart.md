# Quickstart: Daily Learning MVP

**Feature**: 001-daily-learning-mvp
**Date**: 2026-01-01

## Prerequisites

- Rust toolchain installed (for mdbook)
- mdbook installed: `cargo install mdbook`
- mdbook-katex installed: `cargo install mdbook-katex`

## Setup (First Time)

```bash
# Clone the repository (if not already done)
git clone https://github.com/scttpr/licence-radio.git
cd licence-radio

# Switch to feature branch
git checkout 001-daily-learning-mvp

# Build the book
mdbook build

# The output is in the 'book/' directory
```

## Development

```bash
# Start local development server with live reload
mdbook serve --open

# This opens http://localhost:3000 in your browser
```

## Testing the Feature

### 1. Progress Tracking

1. Open the course in your browser
2. Navigate to any lesson
3. Scroll to the bottom of the lesson
4. Check the sidebar - a checkmark (✓) should appear next to the lesson
5. Refresh the page - the checkmark should persist

### 2. Continue Learning

1. Complete a few lessons (scroll to bottom)
2. Go back to the introduction/home page
3. Click the "Continue Learning" button
4. You should be taken to the first incomplete lesson

### 3. Offline Mode

1. Load the course once with internet connection
2. Disconnect from internet
3. Navigate between lessons - should work normally
4. Progress should still be saved and persist

### 4. Clear Progress (Testing)

Open browser DevTools (F12) and run:
```javascript
localStorage.removeItem('radioLicenceProgress');
location.reload();
```

## File Structure After Implementation

```
cours/
├── book.toml                 # Updated with additional-css/js
├── src/
│   ├── SUMMARY.md            # Course structure (unchanged)
│   ├── introduction.md       # Lesson files (unchanged)
│   └── ...
├── theme/
│   ├── css/
│   │   └── progress.css      # Progress indicator styles
│   └── js/
│       └── progress.js       # Progress tracking logic
└── book/                     # Generated output (git-ignored)
```

## Validation Checklist

- [ ] Checkmarks appear in sidebar for completed lessons
- [ ] Progress persists after browser refresh
- [ ] Progress persists after browser restart
- [ ] "Continue Learning" button shows on home page
- [ ] "Continue Learning" navigates to correct lesson
- [ ] Math formulas render correctly (existing functionality)
- [ ] Works offline after first load
- [ ] 2-click access to next lesson from home

## Troubleshooting

### Progress not saving
- Check if localStorage is enabled (not in private browsing)
- Check browser DevTools Console for errors
- Verify `radioLicenceProgress` key exists in Application > Local Storage

### Checkmarks not appearing
- Ensure JavaScript is enabled
- Check DevTools Console for script loading errors
- Verify `progress.js` is in correct location

### Math formulas not rendering
- Ensure mdbook-katex is installed
- Check `book.toml` has katex preprocessor configured
- Clear browser cache and rebuild: `mdbook clean && mdbook build`
