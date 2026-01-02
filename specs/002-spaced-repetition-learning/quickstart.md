# Quickstart: Spaced Repetition Learning Platform

**Feature**: 002-spaced-repetition-learning
**Date**: 2026-01-01

## Prerequisites

- Node.js 18+ (for build script)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Existing course content in `src/*.md`

## Development Setup

### 1. Install Dependencies

```bash
cd /home/scttpr/Documents/Radio/Licence_radio/cours
npm init -y
npm install --save-dev marked katex
```

### 2. Create Directory Structure

```bash
mkdir -p app/{css,js,assets}
mkdir -p content/{segments,questions}
mkdir -p build/output
```

### 3. Copy KaTeX Assets

```bash
cp -r node_modules/katex/dist/* app/assets/katex/
```

### 4. Build Content

```bash
node build/build.js
```

This transforms `src/*.md` into segment JSON files in `content/segments/`.

### 5. Create Initial Questions

For each segment, create a questions file:

```bash
# Example: content/questions/introduction-01.json
{
  "segmentId": "introduction-01",
  "questions": [
    {
      "id": "q-introduction-01-001",
      "type": "multiple_choice",
      "prompt": "What is the purpose of a HAM radio licence?",
      "options": [
        "To operate amateur radio stations legally",
        "To listen to commercial broadcasts",
        "To use mobile phones",
        "To install cable TV"
      ],
      "correct": 0,
      "explanation": "A HAM radio licence authorizes operation of amateur radio stations."
    }
  ]
}
```

### 6. Run Development Server

```bash
npx http-server build/output -p 8080
```

Open http://localhost:8080 in your browser.

## Validation Checklist

### Build Validation

- [ ] All markdown files parse without errors
- [ ] Each segment has 3-5 questions
- [ ] All LaTeX formulas render correctly
- [ ] manifest.json contains all segments
- [ ] Total bundle size < 1MB

### Runtime Validation

- [ ] App loads in < 3 seconds
- [ ] Daily session starts with 2 clicks
- [ ] Review questions appear before new content
- [ ] Answers show immediate feedback
- [ ] Progress persists after page refresh
- [ ] App works offline after first load

### Constitution Compliance

- [ ] **Dead Simple**: UI requires no instructions
- [ ] **Learner First**: Content flows logically
- [ ] **Math Formulas**: All formulas render correctly
- [ ] **Daily Practice**: Session limits to 1 new segment
- [ ] **Knowledge Validation**: SM-2 scheduling works
- [ ] **Local-First**: Works without internet
- [ ] **Open Source**: License visible, docs complete

## Common Issues

### KaTeX Not Rendering

Ensure KaTeX CSS is loaded in index.html:
```html
<link rel="stylesheet" href="assets/katex/katex.min.css">
```

### localStorage Quota Exceeded

Progress data is capped at ~5MB. This app uses ~50KB. If exceeded, check for
corrupted data and reset:
```javascript
localStorage.removeItem('hamRadioLearning');
```

### Service Worker Cache Stale

Force refresh with:
```javascript
navigator.serviceWorker.getRegistrations().then(r => r.forEach(sw => sw.unregister()));
```

Then hard refresh the page (Ctrl+Shift+R).

## Next Steps

After successful quickstart validation:

1. Run `/speckit.tasks` to generate implementation tasks
2. Implement core modules (storage, srs, session, renderer)
3. Build content transformation pipeline
4. Author questions for all segments
5. Deploy to GitHub Pages

## File References

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/README.md](./contracts/README.md)
