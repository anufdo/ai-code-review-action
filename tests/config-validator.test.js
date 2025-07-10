const { ConfigValidator } = require('../src/config-validator');

// Mock @actions/core
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  getBooleanInput: jest.fn()
}));

const core = require('@actions/core');

describe('ConfigValidator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate basic configuration with OpenAI', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'openai-api-key': 'fake-openai-key',
          'ai-provider': 'openai',
          'model': 'gpt-4',
          'max-files': '20',
          'review-level': 'standard'
        };
        return inputs[name] || '';
      });

      core.getBooleanInput.mockReturnValue(true);

      const config = ConfigValidator.validate();

      expect(config.githubToken).toBe('fake-token');
      expect(config.openaiApiKey).toBe('fake-openai-key');
      expect(config.aiProvider).toBe('openai');
      expect(config.model).toBe('gpt-4');
      expect(config.maxFiles).toBe(20);
    });

    it('should validate configuration with Anthropic', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'anthropic-api-key': 'fake-anthropic-key',
          'ai-provider': 'anthropic',
          'model': 'claude-3-sonnet-20240229'
        };
        return inputs[name] || '';
      });

      core.getBooleanInput.mockReturnValue(true);

      const config = ConfigValidator.validate();

      expect(config.anthropicApiKey).toBe('fake-anthropic-key');
      expect(config.aiProvider).toBe('anthropic');
    });

    it('should validate configuration with OpenRouter', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'openrouter-api-key': 'fake-openrouter-key',
          'ai-provider': 'openrouter',
          'model': 'anthropic/claude-3-sonnet',
          'openrouter-base-url': 'https://openrouter.ai/api/v1'
        };
        return inputs[name] || '';
      });

      core.getBooleanInput.mockReturnValue(true);

      const config = ConfigValidator.validate();

      expect(config.openrouterApiKey).toBe('fake-openrouter-key');
      expect(config.aiProvider).toBe('openrouter');
      expect(config.model).toBe('anthropic/claude-3-sonnet');
      expect(config.openrouterBaseUrl).toBe('https://openrouter.ai/api/v1');
    });

    it('should throw error when OpenAI API key is missing', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'ai-provider': 'openai'
        };
        return inputs[name] || '';
      });

      expect(() => ConfigValidator.validate()).toThrow('OpenAI API key is required');
    });

    it('should throw error when Anthropic API key is missing', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'ai-provider': 'anthropic'
        };
        return inputs[name] || '';
      });

      expect(() => ConfigValidator.validate()).toThrow('Anthropic API key is required');
    });

    it('should throw error when OpenRouter API key is missing', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'ai-provider': 'openrouter'
        };
        return inputs[name] || '';
      });

      expect(() => ConfigValidator.validate()).toThrow('OpenRouter API key is required');
    });

    it('should throw error for invalid AI provider', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'ai-provider': 'invalid-provider'
        };
        return inputs[name] || '';
      });

      expect(() => ConfigValidator.validate()).toThrow('AI provider must be one of: "openai", "anthropic", "openrouter"');
    });

    it('should parse custom prompts JSON', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'openai-api-key': 'fake-key',
          'custom-prompts': '{"security": "Focus on security issues"}'
        };
        return inputs[name] || '';
      });

      core.getBooleanInput.mockReturnValue(true);

      const config = ConfigValidator.validate();

      expect(config.customPrompts).toEqual({ security: 'Focus on security issues' });
    });

    it('should throw error for invalid JSON in custom prompts', () => {
      core.getInput.mockImplementation((name) => {
        const inputs = {
          'github-token': 'fake-token',
          'openai-api-key': 'fake-key',
          'custom-prompts': 'invalid json'
        };
        return inputs[name] || '';
      });

      expect(() => ConfigValidator.validate()).toThrow('Custom prompts must be valid JSON');
    });
  });
});
