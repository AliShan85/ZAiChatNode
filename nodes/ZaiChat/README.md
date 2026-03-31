# n8n-nodes-zai

> n8n community node for Z.ai API - Connect to GLM-4.5-Flash and other Z.ai language models for chat completions, streaming responses, and AI-powered automation workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/n8n-nodes-zai.svg)](https://www.npmjs.com/package/n8n-nodes-zai)

## 📖 Overview

This n8n community node enables you to integrate **Z.ai's powerful GLM language models** (including GLM-4.5-Flash) into your n8n workflows. Build AI-powered automations with chat completions, streaming responses, and seamless integration with n8n's AI Language Model chains.

### ✨ Features

- 🚀 **Multiple GLM Models** - Support for GLM-4.5-Flash, GLM-5, and custom models
- 💬 **Chat Completions** - Full conversation context support
- 📡 **Streaming Responses** - Real-time streaming for faster feedback
- ⚙️ **Customizable Parameters** - Temperature, max tokens, top-k, top-p control
- 🔐 **Secure Credential Management** - Safe API key storage through n8n credentials
- 🤖 **Built-in Tool Support** - Web search integration with domain filtering
- ⛓️ **Chain Compatible** - Works seamlessly with n8n's Basic LLM Chain and AI Agent nodes
- 🎯 **Safety Settings** - Configurable safety thresholds for content filtering

## 📦 Installation

### Method 1: Install via npm (Recommended)

```bash
npm install n8n-nodes-zai
```

Then restart your n8n instance.

### Method 2: Install via n8n UI

1. Go to **Settings** → **Community Nodes**
2. Click **Add Community Node**
3. Search for `n8n-nodes-zai`
4. Click **Install**

### Method 3: Install from Source

```bash
git clone https://github.com/AliShan85/ZAiChatNode.git
cd ZAiChatNode
npm install
npm run build
```

Then in n8n: **Settings** → **Community Nodes** → Add the local path.

## 🔑 Credentials Setup

Before using the Z.ai Chat node, you need to configure your Z.ai API credentials:

### Step 1: Get Your API Key

1. Visit [Z.ai](https://zai.ai) and sign up for an account
2. Navigate to your account settings or API section
3. Generate an API key
4. Copy your API key

### Step 2: Create Credentials in n8n

1. In n8n, create a new **Z.ai Chat Modal** node
2. Click on **Credential** dropdown
3. Select **Create New Credential**
4. Enter the following:
   - **API Key**: Your Z.ai API key (required)
   - **Host**: `https://api.z.ai` (default, already filled)
   - **Allowed HTTP Request Domains**: Optional, for CORS/security

5. Click **Save**

> 💡 **Tip**: Keep your API key secure and never share it publicly!

## 🚀 Usage

### Basic Chat Completion

1. Add a **Z.ai Chat Modal** node to your workflow
2. Configure the node:
   - Select your **Model** (e.g., GLM-4.5-Flash)
   - Enter your **System Message** (optional, defines AI behavior)
   - Add your **User Message** (the prompt/query)
3. Connect to an n8n AI node (like **AI Agent** or **Basic LLM Chain**)
4. Execute the workflow

### Using with Basic LLM Chain

The Z.ai Chat node is designed to work seamlessly with n8n's **Basic LLM Chain**:

```
Manual Trigger → Z.ai Chat Modal → Basic LLM Chain → Output
```

**Example Workflow:**

1. **Manual Trigger** - Start the workflow
2. **Z.ai Chat Modal** - Select model and configure
3. **Basic LLM Chain** - Add your prompt template
4. **Output** - View the AI response

### Streaming Responses

For faster feedback, enable streaming:

1. In the **Basic LLM Chain** node, enable **Stream** option
2. The response will be delivered in chunks as it's generated

### Advanced Configuration

#### Model Parameters

- **Temperature** (0.0 - 2.0): Controls randomness
  - Lower = more focused/deterministic
  - Higher = more creative/diverse

- **Max Tokens**: Maximum length of response
  - Useful for controlling response size

- **Top K** (1 - 100): Limits token selection to top K options
- **Top P** (0.0 - 1.0): Nucleus sampling threshold

#### Built-in Tools

Enable **Web Search** to allow the model to search the internet:

1. In node options, expand **Built-in Tools**
2. Enable **Web Search**
3. Configure:
   - **Search Context Size**: Amount of context to include
   - **Allowed Domains**: Restrict search to specific domains (optional)

#### Custom Models

Use a custom GLM model:

1. In **Model** dropdown, select **Custom Model**
2. Enter your model name (e.g., `glm-custom-v1`)

## 📚 Example Workflows

### Example 1: Simple Chat Bot

```
Webhook → Z.ai Chat Modal → AI Agent → Response
```

- Triggered via webhook with user message
- Returns AI response

### Example 2: Document Analysis

```
File Read → Z.ai Chat Modal → AI Agent → Extract Data → Save to Database
```

- Analyzes uploaded documents
- Extracts structured data using AI

### Example 3: Customer Support Automation

```
Email Trigger → Z.ai Chat Modal → AI Agent → Check Knowledge Base → Send Response
```

- Automatically responds to customer emails
- Uses AI to generate personalized responses

## 🎯 Capabilities

### Supported Models

- ✅ GLM-4.5-Flash (Free tier available)
- ✅ GLM-5
- ✅ Custom GLM models

### Node Features

| Feature | Status |
|---------|--------|
| Chat Completions | ✅ Supported |
| Streaming | ✅ Supported |
| System Messages | ✅ Supported |
| Multi-turn Conversations | ✅ Supported |
| Web Search Tool | ✅ Supported |
| Custom Parameters | ✅ Supported |
| Safety Settings | ✅ Supported |

### Integration Compatibility

- ✅ n8n AI Agent
- ✅ Basic LLM Chain
- ✅ LangChain Classifier
- ✅ OpenAI Model compatible (via adapter)

## 🐛 Troubleshooting

### "Connection was aborted" Error

**Cause**: Server connection issue or incorrect host URL.

**Solution**:
1. Verify your API key is valid
2. Check that Host is set to `https://api.z.ai`
3. Ensure your internet connection is stable

### "Rate limit reached" Error

**Cause**: Too many requests to Z.ai API in a short period.

**Solution**:
1. Wait 60-120 seconds for rate limit to reset
2. Add a **Wait node** between requests to space them out
3. Consider upgrading to a paid Z.ai plan for higher limits

### Slow Response Times

**Cause**: Free tier models may have queue times or cold starts.

**Solution**:
1. First request may be slower (cold start)
2. Subsequent requests are usually faster
3. Consider using paid tier for consistent performance
4. Timeout is set to 30 seconds to prevent hanging

### Authentication Failed

**Cause**: Invalid or expired API key.

**Solution**:
1. Regenerate your API key from Z.ai dashboard
2. Update credentials in n8n
3. Ensure no extra spaces in API key field

## 📖 API Reference

### Z.ai API Documentation

For more details on available models and parameters, visit:
- [Z.ai Official Documentation](https://docs.zai.ai)
- [Z.ai API Reference](https://api.z.ai/docs)

### Node Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| Model | String | Yes | GLM-4.5-Flash | Model to use for generation |
| Temperature | Number | No | 1.0 | Randomness control (0.0-2.0) |
| Max Tokens | Number | No | - | Maximum tokens in response |
| Top K | Number | No | - | Top-K sampling parameter |
| Top P | Number | No | - | Nucleus sampling threshold |
| Stream | Boolean | No | false | Enable streaming responses |

## 🔒 Security

- API keys are securely stored in n8n's credential manager
- No API keys are logged or exposed in workflow executions
- All requests are made over HTTPS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ali Shan**

- GitHub: [@AliShan85](https://github.com/AliShan85)
- Email: aliishann806@gmail.com

## 🙏 Acknowledgments

- [n8n](https://n8n.io) - Workflow automation platform
- [Z.ai](https://zai.ai) - AI model provider
- All contributors to this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/AliShan85/ZAiChatNode/issues)
3. Create a new issue with details about your problem
4. Visit [n8n Community](https://community.n8n.io) for general n8n help

---

**Made with ❤️ for the n8n community**
