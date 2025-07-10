const { minimatch } = require('minimatch');
const path = require('path');

/**
 * Analyzes files for code review eligibility and language detection
 */
class FileAnalyzer {
  constructor(config) {
    this.config = config;
    this.languageMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cs': 'csharp',
      '.cpp': 'cpp',
      '.c': 'c',
      '.h': 'c',
      '.hpp': 'cpp',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.scala': 'scala',
      '.sh': 'bash',
      '.bash': 'bash',
      '.zsh': 'bash',
      '.ps1': 'powershell',
      '.sql': 'sql',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.vue': 'vue',
      '.svelte': 'svelte',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.json': 'json',
      '.xml': 'xml',
      '.md': 'markdown',
      '.dockerfile': 'dockerfile',
      '.r': 'r',
      '.m': 'matlab',
      '.pl': 'perl',
      '.lua': 'lua',
      '.dart': 'dart',
      '.elm': 'elm',
      '.ex': 'elixir',
      '.exs': 'elixir',
      '.clj': 'clojure',
      '.fs': 'fsharp',
      '.vb': 'vbnet',
      '.nim': 'nim',
      '.zig': 'zig'
    };
  }

  /**
   * Filter files based on exclude patterns and review criteria
   */
  filterFiles(files) {
    return files
      .filter(file => this.shouldReviewFile(file))
      .slice(0, this.config.maxFiles)
      .map(file => ({
        ...file,
        language: this.detectLanguage(file.filename),
        reviewPriority: this.calculateReviewPriority(file)
      }))
      .sort((a, b) => b.reviewPriority - a.reviewPriority);
  }

  /**
   * Determine if a file should be reviewed
   */
  shouldReviewFile(file) {
    const filename = file.filename;

    // Skip deleted files
    if (file.status === 'removed') {
      return false;
    }

    // Skip binary files
    if (this.isBinaryFile(filename)) {
      return false;
    }

    // Skip files that match exclude patterns
    for (const pattern of this.config.excludePatterns) {
      if (minimatch(filename, pattern, { matchBase: true })) {
        return false;
      }
    }

    // Skip very large files (> 10KB changes)
    if (file.changes > 1000) {
      return false;
    }

    // Only review code files
    return this.isCodeFile(filename);
  }

  /**
   * Detect programming language from file extension
   */
  detectLanguage(filename) {
    const ext = path.extname(filename).toLowerCase();

    // Special cases
    if (filename.toLowerCase() === 'dockerfile') {
      return 'dockerfile';
    }

    if (filename.toLowerCase() === 'makefile') {
      return 'makefile';
    }

    return this.languageMap[ext] || 'text';
  }

  /**
   * Check if file is a code file that should be reviewed
   */
  isCodeFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    const basename = path.basename(filename).toLowerCase();

    // Known code file extensions
    const codeExtensions = Object.keys(this.languageMap);
    if (codeExtensions.includes(ext)) {
      return true;
    }

    // Special filenames
    const specialFiles = [
      'dockerfile',
      'makefile',
      'rakefile',
      'gemfile',
      'podfile',
      'package.json',
      'composer.json',
      'pom.xml',
      'build.gradle',
      'cargo.toml',
      'requirements.txt',
      'setup.py',
      'tsconfig.json',
      'eslintrc',
      'prettierrc',
      'gitignore',
      'gitattributes',
      'editorconfig'
    ];

    return specialFiles.some(special => basename.includes(special));
  }

  /**
   * Check if file is binary
   */
  isBinaryFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    const binaryExtensions = [
      '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.zip', '.tar', '.gz', '.rar', '.7z',
      '.exe', '.dll', '.so', '.dylib',
      '.bin', '.dat', '.db', '.sqlite',
      '.mp3', '.mp4', '.avi', '.mov', '.mkv',
      '.ttf', '.otf', '.woff', '.woff2',
      '.jar', '.war', '.ear',
      '.min.js', '.bundle.js'
    ];

    return binaryExtensions.includes(ext);
  }

  /**
   * Calculate review priority for file ordering
   */
  calculateReviewPriority(file) {
    let priority = 0;
    const filename = file.filename.toLowerCase();

    // Higher priority for main application files
    if (filename.includes('src/') || filename.includes('lib/')) {
      priority += 20;
    }

    // Higher priority for test files
    if (filename.includes('test') || filename.includes('spec')) {
      priority += 15;
    }

    // Higher priority for configuration files
    if (filename.includes('config') || filename.includes('package.json')) {
      priority += 10;
    }

    // Higher priority for security-sensitive files
    if (filename.includes('auth') || filename.includes('security') || filename.includes('login')) {
      priority += 25;
    }

    // Priority based on language
    const languagePriorities = {
      'javascript': 15,
      'typescript': 15,
      'python': 12,
      'java': 12,
      'csharp': 12,
      'go': 10,
      'rust': 10,
      'php': 8,
      'ruby': 8
    };

    const language = this.detectLanguage(file.filename);
    priority += languagePriorities[language] || 5;

    // Priority based on file size (more changes = higher priority)
    if (file.changes > 100) {
      priority += 10;
    } else if (file.changes > 50) {
      priority += 5;
    }

    return priority;
  }

  /**
   * Get file statistics for reporting
   */
  getFileStats(files) {
    const stats = {
      total: files.length,
      byLanguage: {},
      byStatus: {},
      totalChanges: 0
    };

    files.forEach(file => {
      const language = this.detectLanguage(file.filename);
      stats.byLanguage[language] = (stats.byLanguage[language] || 0) + 1;
      stats.byStatus[file.status] = (stats.byStatus[file.status] || 0) + 1;
      stats.totalChanges += file.changes || 0;
    });

    return stats;
  }

  /**
   * Extract diff context for better analysis
   */
  parseDiff(patch) {
    if (!patch) return { added: [], removed: [], context: [] };

    const lines = patch.split('\n');
    const added = [];
    const removed = [];
    const context = [];

    let currentLine = 0;

    for (const line of lines) {
      if (line.startsWith('@@')) {
        const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
        if (match) {
          currentLine = parseInt(match[2]);
        }
        continue;
      }

      if (line.startsWith('+') && !line.startsWith('+++')) {
        added.push({ line: currentLine, content: line.substring(1) });
        currentLine++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        removed.push({ content: line.substring(1) });
      } else if (line.startsWith(' ')) {
        context.push({ line: currentLine, content: line.substring(1) });
        currentLine++;
      }
    }

    return { added, removed, context };
  }
}

module.exports = { FileAnalyzer };
