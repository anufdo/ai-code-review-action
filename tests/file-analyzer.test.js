const { FileAnalyzer } = require('../src/file-analyzer');

describe('FileAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    const config = {
      maxFiles: 20,
      excludePatterns: ['*-lock.json', 'node_modules/**', '*.min.js']
    };
    analyzer = new FileAnalyzer(config);
  });

  describe('detectLanguage', () => {
    it('should detect JavaScript files', () => {
      expect(analyzer.detectLanguage('app.js')).toBe('javascript');
      expect(analyzer.detectLanguage('component.jsx')).toBe('javascript');
    });

    it('should detect TypeScript files', () => {
      expect(analyzer.detectLanguage('app.ts')).toBe('typescript');
      expect(analyzer.detectLanguage('component.tsx')).toBe('typescript');
    });

    it('should detect Python files', () => {
      expect(analyzer.detectLanguage('script.py')).toBe('python');
    });

    it('should detect special files', () => {
      expect(analyzer.detectLanguage('Dockerfile')).toBe('dockerfile');
      expect(analyzer.detectLanguage('dockerfile')).toBe('dockerfile');
      expect(analyzer.detectLanguage('Makefile')).toBe('makefile');
    });

    it('should return text for unknown extensions', () => {
      expect(analyzer.detectLanguage('unknown.xyz')).toBe('text');
    });
  });

  describe('isCodeFile', () => {
    it('should identify code files', () => {
      expect(analyzer.isCodeFile('app.js')).toBe(true);
      expect(analyzer.isCodeFile('style.css')).toBe(true);
      expect(analyzer.isCodeFile('package.json')).toBe(true);
      expect(analyzer.isCodeFile('Dockerfile')).toBe(true);
    });

    it('should reject non-code files', () => {
      expect(analyzer.isCodeFile('image.png')).toBe(false);
      expect(analyzer.isCodeFile('document.pdf')).toBe(false);
      expect(analyzer.isCodeFile('random.txt')).toBe(false);
    });
  });

  describe('isBinaryFile', () => {
    it('should identify binary files', () => {
      expect(analyzer.isBinaryFile('image.png')).toBe(true);
      expect(analyzer.isBinaryFile('video.mp4')).toBe(true);
      expect(analyzer.isBinaryFile('font.ttf')).toBe(true);
      expect(analyzer.isBinaryFile('archive.zip')).toBe(true);
    });

    it('should not identify text files as binary', () => {
      expect(analyzer.isBinaryFile('script.js')).toBe(false);
      expect(analyzer.isBinaryFile('style.css')).toBe(false);
      expect(analyzer.isBinaryFile('README.md')).toBe(false);
    });
  });

  describe('shouldReviewFile', () => {
    it('should review valid code files', () => {
      const file = {
        filename: 'src/app.js',
        status: 'modified',
        changes: 50
      };
      expect(analyzer.shouldReviewFile(file)).toBe(true);
    });

    it('should skip deleted files', () => {
      const file = {
        filename: 'src/app.js',
        status: 'removed',
        changes: 50
      };
      expect(analyzer.shouldReviewFile(file)).toBe(false);
    });

    it('should skip binary files', () => {
      const file = {
        filename: 'image.png',
        status: 'added',
        changes: 10
      };
      expect(analyzer.shouldReviewFile(file)).toBe(false);
    });

    it('should skip excluded patterns', () => {
      const file = {
        filename: 'package-lock.json',
        status: 'modified',
        changes: 100
      };
      expect(analyzer.shouldReviewFile(file)).toBe(false);
    });

    it('should skip very large files', () => {
      const file = {
        filename: 'src/app.js',
        status: 'modified',
        changes: 2000
      };
      expect(analyzer.shouldReviewFile(file)).toBe(false);
    });
  });

  describe('filterFiles', () => {
    it('should filter and prioritize files correctly', () => {
      const files = [
        { filename: 'package-lock.json', status: 'modified', changes: 100 },
        { filename: 'src/app.js', status: 'modified', changes: 50 },
        { filename: 'tests/app.test.js', status: 'added', changes: 30 },
        { filename: 'image.png', status: 'added', changes: 10 },
        { filename: 'src/security/auth.js', status: 'modified', changes: 20 }
      ];

      const filtered = analyzer.filterFiles(files);

      expect(filtered.length).toBe(3); // Excludes package-lock.json and image.png
      expect(filtered[0].filename).toBe('src/security/auth.js'); // Security files have highest priority
      expect(filtered.every(f => f.language)).toBe(true); // All should have language detected
      expect(filtered.every(f => f.reviewPriority >= 0)).toBe(true); // All should have priority
    });

    it('should respect maxFiles limit', () => {
      const config = { maxFiles: 2, excludePatterns: [] };
      const localAnalyzer = new FileAnalyzer(config);

      const files = [
        { filename: 'app1.js', status: 'modified', changes: 50 },
        { filename: 'app2.js', status: 'modified', changes: 50 },
        { filename: 'app3.js', status: 'modified', changes: 50 }
      ];

      const filtered = localAnalyzer.filterFiles(files);
      expect(filtered.length).toBe(2);
    });
  });

  describe('parseDiff', () => {
    it('should parse diff patch correctly', () => {
      const patch = `@@ -1,3 +1,4 @@
 function hello() {
+  console.log('Hello World');
-  return 'hello';
+  return 'Hello, World!';
 }`;

      const result = analyzer.parseDiff(patch);

      expect(result.added).toHaveLength(2);
      expect(result.removed).toHaveLength(1);
      expect(result.context).toHaveLength(2);

      expect(result.added[0].content).toBe('  console.log(\'Hello World\');');
      expect(result.removed[0].content).toBe('  return \'hello\';');
    });

    it('should handle empty patch', () => {
      const result = analyzer.parseDiff('');
      expect(result.added).toEqual([]);
      expect(result.removed).toEqual([]);
      expect(result.context).toEqual([]);
    });
  });
});
