# n8n-nodes-zai

n8n community node for integrating [Z.ai](https://open.bigmodel.cn/) (GLM) models into your workflows. Provides AI chat completions with streaming support and image generation using GLM-Image and CogView-4 models.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Included Nodes

| Node | Description |
|------|-------------|
| **Z.ai Chat Model** | AI chat completions with GLM language models (streaming, web search, safety settings) |
| **Z.ai Image** | Generate images from text prompts using GLM-Image and CogView-4 models |

Both nodes share the same **Zai API** credential.

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

To use these nodes, you need a Z.ai API key:

1. Visit [Z.ai Open Platform](https://open.bigmodel.cn/)
2. Sign up for an account
3. Navigate to **API Keys** section
4. Create a new API key
5. In n8n, create a new **Zai API** credential and paste your API key

**Note**: The Z.ai API provides free tiers for Flash models, making it easy to get started without costs.

---

## Z.ai Chat Model

AI chat completions using Z.ai's GLM language models. Designed to work with n8n's AI Agent and Basic LLM Chain nodes.

### Supported Models

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

### Parameters

**Model**: Select which GLM model to use (default: GLM-4.7)

**Built-in Tools:**
- **Web Search**: Enable the model to search the web for current information
  - **Search Context Size**: Amount of context for search (low/medium/high)
  - **Allowed Domains**: Restrict search to specific domains (comma-separated)

**Options:**
- **Temperature**: Control randomness (0.0 - 2.0, default: 0.7)
- **Max Tokens**: Maximum tokens in the response (default: 4096)
- **Top P**: Nucleus sampling parameter (0.0 - 1.0, default: 1.0)
- **Top K**: Remove low probability responses (-1 to disable, 0-32, default: -1)
- **Safety Settings**: Configure content moderation filters
  - **Categories**: Harassment, Hate Speech, Sexually Explicit, Dangerous Content
  - **Thresholds**: Block Low and Above, Block Medium and Above, Block Only High, Block None
- **Timeout**: Request timeout in milliseconds (default: 0, no timeout)

---

## Z.ai Image

Generate images from text prompts using Z.ai's image generation models.

### Supported Models

- **GLM-Image** - High-quality image generation (default)
- **CogView-4** - Fast image generation

### Parameters

**Model**: Select which image model to use (default: GLM-Image)

**Prompt**: Text description of the image to generate (required)

**Size**: Resolution presets differ per model:

| GLM-Image | CogView-4 |
|-----------|-----------|
| 1280 x 1280 (default) | 1024 x 1024 (default) |
| 1568 x 1056 | 768 x 1344 |
| 1056 x 1568 | 864 x 1152 |
| 1472 x 1088 | 1344 x 768 |
| 1088 x 1472 | 1152 x 864 |
| 1728 x 960 | 1440 x 720 |
| 960 x 1728 | 720 x 1440 |
| Custom | Custom |

**Custom Dimensions:**
- GLM-Image: 1024-2048px, must be a multiple of 32
- CogView-4: 512-2048px, must be a multiple of 16

**Options:**
- **Quality**: HD (more detailed, ~20s) or Standard (faster, ~5-10s)
- **User ID**: End-user identifier for abuse prevention (6-128 characters)
- **File Name**: Custom file name for the output image
- **Timeout**: Request timeout in milliseconds (default: 0, no timeout)

### Output

Each generated image is returned as binary data (viewable in n8n) with the following metadata:

| Field | Description |
|-------|-------------|
| `model` | Model used for generation |
| `prompt` | Text prompt submitted |
| `size` | Image resolution |
| `created` | Unix timestamp of creation |
| `url` | Temporary image URL (expires after 30 days) |
| `contentFilter` | Content safety information |
| `fileName` | Output file name |

---

## Usage Examples

### AI Agent Chat

Connect the **Z.ai Chat Model** node to an AI Agent or Basic LLM Chain in n8n. Select a model, configure options, and let the agent handle conversations.

### Free Tier Usage

Use **GLM-4.5-Flash** or **GLM-4.7-Flash** for free AI-powered text generation.

### Coding Tasks

Use **CodeGeeX**, **GLM-4.7**, or **GLM-5-Code** for code generation, debugging, and explanation.

### Web Search Integration

Enable the **Web Search** built-in tool on the Chat Model node to give the model access to current information. Configure search context size and restrict to specific domains.

### Image Generation

Use the **Z.ai Image** node with a text prompt to generate images. Output is binary data that can be passed to downstream nodes for saving, emailing, or further processing.

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
