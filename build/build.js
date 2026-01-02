#!/usr/bin/env node
/**
 * Build Script - Content Processor
 * HAM Radio Learning Platform
 *
 * Transforms markdown course content into JSON segments for the learning app.
 * Parses SUMMARY.md to determine course structure.
 *
 * Usage: node build/build.js
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  // Source markdown files location
  sourceDir: path.join(__dirname, '..', 'src'),
  summaryFile: path.join(__dirname, '..', 'src', 'SUMMARY.md'),

  // Output directories
  outputDir: path.join(__dirname, '..', 'app', 'content'),
  segmentsDir: path.join(__dirname, '..', 'app', 'content', 'segments'),
  questionsDir: path.join(__dirname, '..', 'app', 'content', 'questions'),

  // Sections to skip (by title keyword)
  skipSections: ['ressources', 'annexes']
};

// ============================================================================
// Utilities
// ============================================================================

/**
 * Ensure a directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate a URL-safe slug from a string
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract title from markdown content
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Sans titre';
}

// ============================================================================
// SUMMARY.md Parsing
// ============================================================================

/**
 * Parse SUMMARY.md to extract course structure
 * Format:
 *   # Section Title
 *   - [Lesson Title](./file.md)
 */
function parseSummary(summaryPath) {
  const content = fs.readFileSync(summaryPath, 'utf-8');
  const lines = content.split('\n');

  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    // Check for section header (# Title)
    const sectionMatch = line.match(/^#\s+(.+)$/);
    if (sectionMatch) {
      const title = sectionMatch[1].trim();

      // Skip "Summary" header and excluded sections
      if (title.toLowerCase() === 'summary') continue;
      if (CONFIG.skipSections.some(s => title.toLowerCase().includes(s))) {
        currentSection = null;
        continue;
      }

      currentSection = {
        title,
        id: slugify(title),
        lessons: []
      };
      sections.push(currentSection);
      continue;
    }

    // Check for lesson link (- [Title](./file.md))
    const lessonMatch = line.match(/^-\s+\[(.+)\]\(\.\/(.+\.md)\)/);
    if (lessonMatch && currentSection) {
      currentSection.lessons.push({
        title: lessonMatch[1].trim(),
        file: lessonMatch[2]
      });
    }

    // Also handle standalone links like [Introduction](./introduction.md)
    const standaloneMatch = line.match(/^\[(.+)\]\(\.\/(.+\.md)\)$/);
    if (standaloneMatch && !currentSection) {
      // Introduction or other standalone files - create implicit section
      if (!sections.find(s => s.id === 'introduction')) {
        currentSection = {
          title: 'Introduction',
          id: 'introduction',
          lessons: []
        };
        sections.unshift(currentSection);
      }
      currentSection.lessons.push({
        title: standaloneMatch[1].trim(),
        file: standaloneMatch[2]
      });
    }
  }

  return sections;
}

// ============================================================================
// Content Processing
// ============================================================================

/**
 * Split content into segments based on headers
 */
function splitIntoSegments(content, baseId, lessonTitle) {
  const segments = [];

  // Split by ## headers (keeping the header with the content)
  const parts = content.split(/(?=^##\s)/m);

  let segmentIndex = 0;
  let hasIntroContent = false;

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Check if this is the intro section (starts with # not ##)
    const isIntro = trimmed.startsWith('# ') && !trimmed.startsWith('## ');

    if (isIntro) {
      // Get content after the title line
      const lines = trimmed.split('\n');
      const afterTitle = lines.slice(1).join('\n').trim();

      if (afterTitle.length > 100) {
        // There's substantial intro content, create a segment for it
        hasIntroContent = true;
        const htmlContent = marked.parse(trimmed);

        segments.push({
          id: `${baseId}-${segmentIndex}`,
          title: lessonTitle,
          content: htmlContent,
          order: segmentIndex
        });
        segmentIndex++;
      }
      continue;
    }

    // Regular ## section
    let segmentTitle = 'Section';
    const headerMatch = trimmed.match(/^##\s+(.+)$/m);
    if (headerMatch) {
      segmentTitle = headerMatch[1].trim();
    }

    const htmlContent = marked.parse(trimmed);

    segments.push({
      id: `${baseId}-${segmentIndex}`,
      title: segmentTitle,
      content: htmlContent,
      order: segmentIndex
    });

    segmentIndex++;
  }

  // If no segments created but there's content, treat whole file as one segment
  if (segments.length === 0 && content.trim().length > 0) {
    segments.push({
      id: `${baseId}-0`,
      title: lessonTitle,
      content: marked.parse(content),
      order: 0
    });
  }

  return segments;
}

/**
 * Process a single markdown file
 */
function processMarkdownFile(filePath, sectionId, lessonIndex, lessonTitle) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  Warning: File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');

  // Generate base ID for this lesson
  const lessonId = `${sectionId}-${slugify(fileName)}`;

  // Extract actual title from file (might differ from SUMMARY.md)
  const fileTitle = extractTitle(content);
  const title = fileTitle !== 'Sans titre' ? fileTitle : lessonTitle;

  // Split into segments
  const segments = splitIntoSegments(content, lessonId, title);

  return {
    id: lessonId,
    title,
    order: lessonIndex,
    segments: segments.map(s => ({
      id: s.id,
      title: s.title,
      order: s.order
    })),
    fullSegments: segments
  };
}

/**
 * Generate placeholder questions for a segment
 * (In production, these would be manually authored)
 */
function generatePlaceholderQuestions(segment) {
  return {
    segmentId: segment.id,
    questions: [
      {
        id: `q-${segment.id}-001`,
        type: 'multiple_choice',
        prompt: `Question sur "${segment.title}" - À compléter manuellement`,
        options: [
          'Option A',
          'Option B',
          'Option C',
          'Option D'
        ],
        correct: 0,
        explanation: 'Explication à ajouter.'
      }
    ]
  };
}

// ============================================================================
// Main Build Process
// ============================================================================

/**
 * Main build function
 */
function build() {
  console.log('=== HAM Radio Learning Platform - Build ===\n');

  // Ensure output directories exist
  ensureDir(CONFIG.outputDir);
  ensureDir(CONFIG.segmentsDir);
  ensureDir(CONFIG.questionsDir);

  // Check for SUMMARY.md
  if (!fs.existsSync(CONFIG.summaryFile)) {
    console.error(`Error: SUMMARY.md not found at ${CONFIG.summaryFile}`);
    return;
  }

  // Parse course structure from SUMMARY.md
  console.log('Parsing SUMMARY.md...');
  const parsedSections = parseSummary(CONFIG.summaryFile);
  console.log(`Found ${parsedSections.length} sections\n`);

  const sections = [];
  let totalSegments = 0;

  // Process each section
  parsedSections.forEach((parsedSection, sectionIndex) => {
    console.log(`Processing section: ${parsedSection.title}`);

    const lessons = [];
    const allSegments = [];

    // Process each lesson in the section
    parsedSection.lessons.forEach((lessonInfo, lessonIndex) => {
      const filePath = path.join(CONFIG.sourceDir, lessonInfo.file);

      const lesson = processMarkdownFile(
        filePath,
        parsedSection.id,
        lessonIndex,
        lessonInfo.title
      );

      if (lesson) {
        lessons.push({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          segments: lesson.segments
        });
        allSegments.push(...lesson.fullSegments);
      }
    });

    if (lessons.length > 0) {
      sections.push({
        id: parsedSection.id,
        title: parsedSection.title,
        order: sectionIndex,
        lessons
      });

      // Write segment and question files (only if they don't exist - preserve curated content)
      allSegments.forEach(segment => {
        const segmentFile = path.join(CONFIG.segmentsDir, `${segment.id}.json`);
        if (!fs.existsSync(segmentFile)) {
          fs.writeFileSync(segmentFile, JSON.stringify({
            id: segment.id,
            title: segment.title,
            content: segment.content,
            order: segment.order
          }, null, 2));
          console.log(`    Created: ${segment.id}.json`);
        }

        // Generate placeholder questions only if file doesn't exist
        const questionsFile = path.join(CONFIG.questionsDir, `${segment.id}.json`);
        if (!fs.existsSync(questionsFile)) {
          const questions = generatePlaceholderQuestions(segment);
          fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
        }

        totalSegments++;
      });

      console.log(`  → ${lessons.length} lessons, ${allSegments.length} segments`);
    }
  });

  // Generate manifest only if it doesn't exist (preserve curated manifest)
  const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    const manifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      totalSegments,
      sections
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\nGenerated new manifest.json');
  } else {
    console.log('\nManifest exists - preserving curated content');
  }

  console.log('\n=== Build Complete ===');
  console.log(`Total sections: ${sections.length}`);
  console.log(`Total segments: ${totalSegments}`);
  console.log(`Output: ${CONFIG.outputDir}`);
}

// Run build
build();
