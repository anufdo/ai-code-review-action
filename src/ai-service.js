const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const core = require('@actions/core');

/**
 * Service for AI-powered code analysis
 */
class AIService {
  constructor(config) {
    this.config = config;
    this.provider = config.aiProvider;

    if (this.provider === 'openai') {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey
      });
    } else if (this.provider === 'anthropic') {
      this.anthropic = new Anthropic({
        apiKey: config.anthropicApiKey
      });
    } else if (this.provider === 'openrouter') {
      this.openrouter = new OpenAI({
        apiKey: config.openrouterApiKey,
        baseURL: config.openrouterBaseUrl,
        defaultHeaders: {
          'HTTP-Referer': 'https://github.com/ai-code-review-action',
          'X-Title': 'AI Code Review Action'
        }
      });
    }
  }

  /**
   * Analyze code changes and provide review feedback
   */
  async analyzeCode(filename, oldContent, newContent, language, context = {}) {
    const prompt = this.buildReviewPrompt(filename, oldContent, newContent, language, context);

    try {
      let response;

      if (this.provider === 'openai') {
        response = await this.callOpenAI(prompt);
      } else if (this.provider === 'anthropic') {
        response = await this.callAnthropic(prompt);
      } else if (this.provider === 'openrouter') {
        response = await this.callOpenRouter(prompt);
      }

      return this.parseResponse(response);
    } catch (error) {
      core.error(`AI analysis failed for ${filename}: ${error.message}`);
      return {
        summary: `Analysis failed for ${filename}: ${error.message}`,
        issues: [],
        suggestions: [],
        score: 0
      };
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt) {
    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  }

  /**
   * Call Anthropic API
   */
  async callAnthropic(prompt) {
    const response = await this.anthropic.messages.create({
      model: this.config.model === 'gpt-4' ? 'claude-3-sonnet-20240229' : this.config.model,
      max_tokens: 2000,
      temperature: 0.1,
      system: this.getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].text;
  }

  /**
   * Call OpenRouter API
   */
  async callOpenRouter(prompt) {
    const response = await this.openrouter.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  }

  /**
   * Build the review prompt for AI analysis
   */
  buildReviewPrompt(filename, oldContent, newContent, language, context) {
    const reviewFocus = this.getReviewFocus();

    return `
Please review the following code changes in ${filename} (${language}):

## File Context
- File: ${filename}
- Language: ${language}
- Review Level: ${this.config.reviewLevel}

## Review Focus
${reviewFocus}

## Old Content:
\`\`\`${language}
${oldContent || '(new file)'}
\`\`\`

## New Content:
\`\`\`${language}
${newContent}
\`\`\`

## Additional Context:
${context.pullRequestTitle ? `PR Title: ${context.pullRequestTitle}` : ''}
${context.pullRequestDescription ? `PR Description: ${context.pullRequestDescription}` : ''}

Please provide your analysis in the following JSON format:
{
  "summary": "Brief overview of the changes and overall assessment",
  "issues": [
    {
      "type": "error|warning|suggestion",
      "line": 0,
      "message": "Description of the issue",
      "suggestion": "How to fix or improve",
      "category": "security|performance|maintainability|style|logic|best-practices"
    }
  ],
  "suggestions": [
    {
      "type": "improvement|optimization|alternative",
      "message": "Suggestion description",
      "example": "Code example if applicable"
    }
  ],
  "score": 85,
  "strengths": ["What was done well"],
  "concerns": ["Areas that need attention"]
}`;
  }

  /**
   * Get system prompt based on configuration
   */
  getSystemPrompt() {
    return `You are an expert code reviewer with deep knowledge of software engineering best practices, security, performance optimization, and clean code principles.

Your role is to provide constructive, actionable feedback on code changes. Focus on:
- Code quality and maintainability
- Security vulnerabilities and best practices
- Performance implications
- Logic errors and potential bugs
- Code style and conventions
- Architecture and design patterns

Provide specific, actionable feedback with clear explanations. Be encouraging while highlighting areas for improvement. Always suggest concrete solutions or alternatives.

Return your analysis in valid JSON format only, without any additional text or markdown formatting.`;
  }

  /**
   * Get review focus based on configuration
   */
  getReviewFocus() {
    const focuses = [];

    if (this.config.enableSecurityReview) {
      focuses.push('- Security vulnerabilities and best practices');
    }

    if (this.config.enablePerformanceReview) {
      focuses.push('- Performance implications and optimizations');
    }

    if (this.config.enableBestPractices) {
      focuses.push('- Code quality and best practices');
    }

    switch (this.config.reviewLevel) {
    case 'basic':
      focuses.push('- Basic syntax and obvious errors');
      break;
    case 'detailed':
      focuses.push('- Deep architectural analysis');
      focuses.push('- Advanced optimization opportunities');
      focuses.push('- Comprehensive security analysis');
      break;
    default: // standard
      focuses.push('- Code quality and maintainability');
      focuses.push('- Common bugs and issues');
      focuses.push('- Standard best practices');
    }

    return focuses.join('\n');
  }

  /**
   * Parse AI response into structured format
   */
  parseResponse(response) {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.summary || !Array.isArray(parsed.issues)) {
        throw new Error('Invalid response format');
      }

      return {
        summary: parsed.summary,
        issues: parsed.issues || [],
        suggestions: parsed.suggestions || [],
        score: parsed.score || 0,
        strengths: parsed.strengths || [],
        concerns: parsed.concerns || []
      };
    } catch (error) {
      core.warning(`Failed to parse AI response: ${error.message}`);
      return {
        summary: 'Analysis completed but response format was invalid',
        issues: [],
        suggestions: [],
        score: 0,
        strengths: [],
        concerns: [`Failed to parse AI response: ${error.message}`]
      };
    }
  }

  /**
   * Generate summary for multiple file reviews
   */
  async generateSummary(reviews, context = {}) {
    const totalIssues = reviews.reduce((sum, review) => sum + review.issues.length, 0);
    const averageScore = reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;

    const summaryPrompt = `
Please provide a comprehensive summary of this pull request code review:

## Review Statistics
- Files reviewed: ${reviews.length}
- Total issues found: ${totalIssues}
- Average code quality score: ${averageScore.toFixed(1)}/100

## Individual File Reviews:
${reviews.map((review, index) => `
### File ${index + 1}
Score: ${review.score}/100
Issues: ${review.issues.length}
Summary: ${review.summary}
`).join('\n')}

## Context
${context.pullRequestTitle ? `PR Title: ${context.pullRequestTitle}` : ''}
${context.pullRequestDescription ? `PR Description: ${context.pullRequestDescription}` : ''}

Please provide a concise summary focusing on:
1. Overall assessment of the changes
2. Key strengths of the implementation
3. Main areas requiring attention
4. Recommendations for the pull request

Keep it under 500 words and make it actionable for the development team.`;

    try {
      let response;

      if (this.provider === 'openai') {
        response = await this.callOpenAI(summaryPrompt);
      } else if (this.provider === 'anthropic') {
        response = await this.callAnthropic(summaryPrompt);
      } else if (this.provider === 'openrouter') {
        response = await this.callOpenRouter(summaryPrompt);
      }

      return response;
    } catch (error) {
      core.warning(`Failed to generate summary: ${error.message}`);
      return `## Code Review Summary

**Files Reviewed:** ${reviews.length}
**Issues Found:** ${totalIssues}
**Average Score:** ${averageScore.toFixed(1)}/100

The code review has been completed. Please check individual file reviews for detailed feedback.`;
    }
  }
}

module.exports = { AIService };
