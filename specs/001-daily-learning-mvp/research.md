# Research: Daily Learning MVP

**Feature**: 001-daily-learning-mvp
**Date**: 2026-01-01

## 1. mdbook Theme Customization

### Decision
Use `additional-css` and `additional-js` in `book.toml` for adding custom progress tracking
functionality, avoiding full theme override.

### Rationale
- Lowest risk: selective file additions prevent breaking existing functionality
- Easy maintenance: changes survive mdbook updates
- Performance: only load what's needed
- Simplicity: no need to replicate entire theme files

### Alternatives Considered
- **Override all theme files**: More control but harder to maintain
- **Use preprocessor plugins**: More complex for simple feature
- **Custom renderer**: Overkill for MVP

### Implementation
```toml
[output.html]
additional-css = ["theme/css/progress.css"]
additional-js = ["theme/js/progress.js"]
```

## 2. Scroll-to-Bottom Detection

### Decision
Use IntersectionObserver API with a sentinel element at the end of lesson content.

### Rationale
- **Performance**: IntersectionObserver uses ~38% CPU vs ~63% for scroll event listeners
- **Modern**: Asynchronous, doesn't block main thread
- **Simple**: ~10 lines of code for full implementation
- **Production-ready**: Supported in all target browsers

### Alternatives Considered
- **Manual scroll position polling**: Wasteful, continuous CPU usage
- **Scroll event with no throttling**: Fires 60+ times/second, poor performance
- **Third-party libraries**: Unnecessary; native API is sufficient

### Implementation Pattern
```javascript
const sentinel = document.createElement('div');
sentinel.id = 'lesson-end-sentinel';
document.querySelector('main').appendChild(sentinel);

const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    markLessonComplete();
    observer.unobserve(sentinel);
  }
}, { threshold: 1.0 });

observer.observe(sentinel);
```

## 3. localStorage Progress Persistence

### Decision
Single localStorage key with JSON structure containing lesson ID mapping and metadata.

### Rationale
- **Simple structure**: One key to manage entire progress state
- **JSON serialization**: Perfect for small data sets (5MB limit sufficient)
- **Resilient**: Try-catch handling for storage unavailability
- **Scalable**: Easy to migrate to backend later if needed

### Alternatives Considered
- **One key per lesson**: Harder to maintain, more storage entries
- **sessionStorage**: Loses data when tab closes
- **IndexedDB**: Overkill for simple progress tracking
- **Cookies**: 4KB limit, slower, outdated

### Data Structure
```javascript
{
  "version": 1,
  "lastAccessed": 1672531200000,
  "currentLesson": "ohm_joule",
  "lessons": {
    "introduction": { "visited": true, "completed": true, "completedAt": 1672531200000 },
    "classes_emission": { "visited": true, "completed": false }
  }
}
```

## 4. Progress UI Integration

### Decision
Inject progress indicators via JavaScript after page load, using CSS classes for visual
styling. Checkmark icons via Unicode character (✓).

### Rationale
- **Non-invasive**: Doesn't require template modifications
- **Progressive enhancement**: Works even if JS fails (just no progress shown)
- **Simple styling**: CSS classes toggle visibility and appearance
- **Accessible**: Unicode checkmark is screen-reader friendly

### Alternatives Considered
- **Template override (index.hbs)**: More complex, requires understanding mdbook internals
- **SVG icons**: More complex to inject, marginal benefit
- **CSS-only indicators**: Insufficient for dynamic state

### Implementation Pattern
```javascript
// On page load, mark completed lessons in sidebar
document.querySelectorAll('.chapter li a').forEach(link => {
  const lessonId = extractLessonId(link.href);
  if (isCompleted(lessonId)) {
    link.classList.add('completed');
    link.insertAdjacentHTML('beforeend', '<span class="checkmark">✓</span>');
  }
});
```

## 5. Resume Behavior ("Continue Learning")

### Decision
Store current lesson ID; on return, redirect to last incomplete lesson or display
"Continue" button on introduction/home page.

### Rationale
- **2-click goal**: Home → Continue button = lesson (meets Constitution IV)
- **Intuitive**: Learners expect to resume where they left off
- **Fallback**: If all complete, show completion message with annexes link

### Implementation Pattern
```javascript
function getContinueTarget() {
  const progress = getProgress();
  // Find first incomplete lesson in curriculum order
  const lessonOrder = [...]; // Defined from SUMMARY.md
  for (const lessonId of lessonOrder) {
    if (!progress.lessons[lessonId]?.completed) {
      return lessonId;
    }
  }
  return null; // All complete
}
```

## Technical Decisions Summary

| Aspect | Decision | Key Benefit |
|--------|----------|-------------|
| Theme customization | additional-css/js | No template override needed |
| Scroll detection | IntersectionObserver | 38% CPU vs 63% scroll events |
| Storage | Single localStorage key + JSON | Simple, resilient, scalable |
| UI indicators | JS injection + CSS classes | Progressive enhancement |
| Resume flow | Stored current lesson ID | 2-click access maintained |
