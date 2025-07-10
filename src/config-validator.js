const core = require('@actions/core');

/**
 * Validates and processes configuration inputs
 */
class ConfigValidator {
  static validate() {
    const config = {
      githubToken: core.getInput('github-token', { required: true }),
      openaiApiKey: core.getInput('openai-api-key'),
      anthropicApiKey: core.getInput('anthropic-api-key'),
      openrouterApiKey: core.getInput('openrouter-api-key'),
      aiProvider: core.getInput('ai-provider') || 'openai',
      model: core.getInput('model') || 'gpt-4',
      openrouterBaseUrl: core.getInput('openrouter-base-url') || 'https://openrouter.ai/api/v1',
      maxFiles: parseInt(core.getInput('max-files') || '20'),
      excludePatterns: (core.getInput('exclude-patterns') || '').split(',').map(p => p.trim()).filter(Boolean),
      reviewLevel: core.getInput('review-level') || 'standard',
      languageHints: core.getInput('language-hints'),
      customPrompts: core.getInput('custom-prompts'),
      enableSecurityReview: core.getBooleanInput('enable-security-review'),
      enablePerformanceReview: core.getBooleanInput('enable-performance-review'),
      enableBestPractices: core.getBooleanInput('enable-best-practices')
    };    // Validate AI provider and API keys
    if (config.aiProvider === 'openai' && !config.openaiApiKey) {
      throw new Error('OpenAI API key is required when using OpenAI provider');
    }

    if (config.aiProvider === 'anthropic' && !config.anthropicApiKey) {
      throw new Error('Anthropic API key is required when using Anthropic provider');
    }

    if (config.aiProvider === 'openrouter' && !config.openrouterApiKey) {
      throw new Error('OpenRouter API key is required when using OpenRouter provider');
    }

    if (!['openai', 'anthropic', 'openrouter'].includes(config.aiProvider)) {
      throw new Error('AI provider must be one of: "openai", "anthropic", "openrouter"');
    }

    // Validate review level
    if (!['basic', 'standard', 'detailed'].includes(config.reviewLevel)) {
      throw new Error('Review level must be one of: basic, standard, detailed');
    }

    // Validate max files
    if (config.maxFiles < 1 || config.maxFiles > 100) {
      throw new Error('Max files must be between 1 and 100');
    }

    // Parse custom prompts if provided
    if (config.customPrompts) {
      try {
        config.customPrompts = JSON.parse(config.customPrompts);
      } catch (error) {
        throw new Error('Custom prompts must be valid JSON');
      }
    }

    // Default exclude patterns
    if (config.excludePatterns.length === 0) {
      config.excludePatterns = [
        '*.lock',
        '*.min.js',
        '*.map',
        'node_modules/**',
        'dist/**',
        'build/**',
        '*.svg',
        '*.png',
        '*.jpg',
        '*.jpeg',
        '*.gif',
        '*.ico'
      ];
    }

    return config;
  }
}

module.exports = { ConfigValidator };
