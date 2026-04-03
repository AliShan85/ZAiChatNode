# n8n-nodes-zai

This is an n8n community node that integrates [Z.ai](https://open.bigmodel.cn/) (GLM) language models into your n8n workflows. It provides access to Zhipu AI's powerful GLM series models including GLM-4.5, GLM-4.6, GLM-4.7, and CodeGeeX for chat completions, AI agents, coding tasks, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Supported Models

Access to Zhipu AI's latest GLM models including:
  - **GLM-4.5** - Mixture-of-Experts model for AI agents
  - **GLM-4.5-Flash** - Free tier for agentic tasks
  - **GLM-4.5-Air** - Lightweight model
  - **GLM-4.6** - 200K context window for long conversations
  - **GLM-4.7** - Flagship model with strong coding capabilities (default)
  - **GLM-4.7-Flash** - Free tier with latest features
  - **GLM-4.7-FlashX** - Ultra-fast model for low-latency applications
  - **GLM-4-32B-0414-128K** - 128K context for long documents
  - **GLM-5** - Latest generation flagship for complex reasoning
  - **GLM-5-Code** - Specialized for advanced software development
  - **GLM-5-Turbo** - High-performance with speed and reasoning balance
  - **CodeGeeX** - Specialized model for coding tasks

## Installation

### Using npm

```bash
npm install n8n-nodes-zai
```

### In n8n

1. Go to **Settings** > **Community Nodes**
2. Click **Add** and search for `n8n-nodes-zai`
3. Click **Install**

Or follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n documentation.

## Credentials

To use this node, you need a Z.ai API key:

1. Visit [Z.ai Open Platform](https://open.bigmodel.cn/)
2. Sign up for an account
3. Navigate to **API Keys** section
4. Create a new API key
5. In n8n, create a new **Zai API** credential and paste your API key

**Note**: The Z.ai API provides free tiers for Flash models, making it easy to get started without costs.

## Operations

### Chat

Generate chat completions using Z.ai's GLM models.

**Inputs:**
- **Model**: Select which GLM model to use (see Supported Models section for options, default: GLM-4.7)
- **Messages**: Array of chat messages with roles (system, user, assistant)
- **Temperature**: Control randomness (0.0 - 2.0, default: 0.7)
- **Max Tokens**: Maximum tokens in the response (default: 4096)
- **Top P**: Nucleus sampling parameter (0.0 - 1.0, default: 1.0)
- **Top K**: Remove "long tail" low probability responses (0 - 32, default: 32.0)
- **Timeout**: Request timeout in milliseconds (default: 0, no timeout)

**Built-in Tools:**
- **Web Search**: Enable the model to search the web for current information
  - **Search Context Size**: Amount of context for search (low/medium/high)
  - **Allowed Domains**: Restrict search to specific domains (comma-separated)

**Safety Settings:**
- **Harassment**: Filter harassment content
- **Hate Speech**: Filter hate speech and content
- **Sexually Explicit**: Filter sexually explicit content
- **Dangerous Content**: Filter dangerous content
- **Block Threshold**: Set sensitivity level (LOW/MEDIUM/HIGH/NONE)

**Outputs:**
- **Response**: The model's text response
- **Usage**: Token usage statistics (prompt tokens, completion tokens, total)
- **Model**: Which model was used
- **Finish Reason**: Why the generation stopped (length, stop, etc.)

## Usage Examples

### Basic Chat Completion

```json
{
  "model": "glm-4.5-flash",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Explain quantum computing in simple terms."
    }
  ]
}
```

### Using the Free Tier

Use **GLM-4.5-Flash** or **GLM-4.7-Flash** for free AI-powered text generation.

### Long Context Conversations

Use **GLM-4.6** with its 200K token context window for maintaining long conversation history.

### Coding Tasks

Use **CodeGeeX**, **GLM-4.7** (strong coding model), or **GLM-5-Code** for advanced software development tasks including code generation, debugging, and explanation.

### Web Search Integration

Enable the **Web Search** built-in tool to give the model access to current information from the web. Configure search context size and restrict to specific domains if needed.

### Latest Generation Models

Use **GLM-5** for complex reasoning tasks or **GLM-5-Turbo** for a balance of speed and capability.

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with**: n8n 1.60.0+

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Z.ai API Documentation](https://open.bigmodel.cn/dev/api)
* [Z.ai Platform](https://open.bigmodel.cn/)
* [n8n Community Forum](https://community.n8n.io/)

## License

[MIT](LICENSE.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/AliShan85/ZAiChatNode/issues)
- Visit the [n8n Community Forum](https://community.n8n.io/)

## Author

Ali Shan (aliishann806@gmail.com)