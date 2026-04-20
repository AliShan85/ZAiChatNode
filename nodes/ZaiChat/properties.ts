import type {INodeProperties} from 'n8n-workflow';

export const zaiChatProperties: INodeProperties[] = [
    {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        description: 'The Z.AI (GLM) model to use for chat completions',
        options: [
            {
                name: 'CodeGeeX (Coding)',
                value: 'codegeex',
                description: 'Optimized for code generation, debugging, and technical tasks',
            },
            {
                name: 'GLM-4-32B-0414-128K',
                value: 'glm-4-32b-0414-128k',
                description: 'Large context model for long documents and conversations',
            },
            // GLM-4.5 Series (MoE)
            {
                name: 'GLM-4.5 (AI Agents)',
                value: 'glm-4.5',
                description: 'Mixture-of-Experts model designed for complex agent workflows',
            },
            {
                name: 'GLM-4.5-Air (Lightweight)',
                value: 'glm-4.5-air',
                description: 'Lightweight and efficient model for general-purpose tasks',
            },
            {
                name: 'GLM-4.5-Flash (Free)',
                value: 'glm-4.5-flash',
                description: 'Fast and cost-efficient model for simple or high-volume tasks',
            },
            // GLM-4.6 Series
            {
                name: 'GLM-4.6 (200K Context)',
                value: 'glm-4.6',
                description: 'Extended context model for large-scale inputs and memory-heavy tasks',
            },
            // GLM-4.7 Series (Flagship)
            {
                name: 'GLM-4.7 (Advanced Coding)',
                value: 'glm-4.7',
                description: 'High-performance model specialized in complex coding tasks',
            },
            {
                name: 'GLM-4.7-Flash (Free)',
                value: 'glm-4.7-flash',
                description: 'Fast and lightweight model for quick responses',
            },
            {
                name: 'GLM-4.7-FlashX',
                value: 'glm-4.7-flashx',
                description: 'Ultra-fast model optimized for low-latency applications',
            },
            // GLM-5 Series (Latest Generation)
            {
                name: 'GLM-5 (Flagship)',
                value: 'glm-5',
                description: 'Top-tier model for complex reasoning and system-level tasks',
            },
            {
                name: 'GLM-5-Code',
                value: 'glm-5-code',
                description: 'Specialized flagship model for advanced software development',
            },
            {
                name: 'GLM-5-Turbo',
                value: 'glm-5-turbo',
                description: 'High-performance model balancing speed and reasoning capability',
            },
        ],
        default: 'glm-4.7',
        required: true,
    },
    {
        displayName: 'Built-in Tools',
        name: 'builtInTools',
        placeholder: 'Add Built-in Tool',
        type: 'collection',
        default: {},
        options: [
            {
                displayName: 'Web Search',
                name: 'webSearch',
                type: 'collection',
                default: {searchContextSize: 'medium'},
                options: [
                    {
                        displayName: 'Search Context Size',
                        name: 'searchContextSize',
                        type: 'options',
                        default: 'medium',
                        description: 'Amount of context window space for search',
                        options: [
                            {name: 'Low', value: 'low'},
                            {name: 'Medium', value: 'medium'},
                            {name: 'High', value: 'high'},
                        ],
                    },
                    {
                        displayName: 'Allowed Domains',
                        name: 'allowedDomains',
                        type: 'string',
                        default: '',
                        description: 'Comma-separated domains to search',
                        placeholder: 'e.g. google.com, wikipedia.org',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Options',
        name: 'options',
        placeholder: 'Add Option',
        description: 'Additional configuration options',
        type: 'collection',
        default: {},
        options: [
            {
                displayName: 'Maximum Number of Tokens',
                name: 'maxTokens',
                type: 'number',
                typeOptions: {minValue: 1, maxValue: 128000},
                default: 4096,
                description: 'The maximum number of tokens to generate in the completion',
            },
            {
                displayName: 'Request Timeout (Ms)',
                name: 'timeout',
                type: 'number',
                typeOptions: {minValue: 0, maxValue: 700000},
                default: 0,
                description: 'Time in milliseconds to wait for the request to complete. Set to 0 for no timeout.',
            },
            {
                displayName: 'Safety Settings',
                name: 'safetySettings',
                placeholder: 'Add Safety Setting',
                type: 'collection',
                default: {},
                description: 'Configure safety filters for content moderation',
                options: [
                    {
                        displayName: 'Safety Category',
                        name: 'safetyCategory',
                        type: 'options',
                        default: 'HARM_CATEGORY_HARASSMENT',
                        description: 'Harassment content',
                        options: [
                            {
                                name: 'HARM_CATEGORY_HARASSMENT',
                                value: 'HARM_CATEGORY_HARASSMENT',
                                description: 'Harassment content',
                            },
                            {
                                name: 'HARM_CATEGORY_HATE_SPEECH',
                                value: 'HARM_CATEGORY_HATE_SPEECH',
                                description: 'Hate speech and content',
                            },
                            {
                                name: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                                value: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                                description: 'Sexually explicit content',
                            },
                            {
                                name: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                                value: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                                description: 'Dangerous content',
                            },
                        ],
                    },
                    {
                        displayName: 'Safety Threshold',
                        name: 'safetyThreshold',
                        type: 'options',
                        default: 'BLOCK_MEDIUM_AND_ABOVE',
                        description: 'Content with NEGLIGIBLE and LOW will be allowed',
                        options: [
                            {
                                name: 'BLOCK_LOW_AND_ABOVE',
                                value: 'BLOCK_LOW_AND_ABOVE',
                                description: 'Content with NEGLIGIBLE will be allowed',
                            },
                            {
                                name: 'BLOCK_MEDIUM_AND_ABOVE',
                                value: 'BLOCK_MEDIUM_AND_ABOVE',
                                description: 'Block medium and above',
                            },
                            {
                                name: 'BLOCK_ONLY_HIGH',
                                value: 'BLOCK_ONLY_HIGH',
                                description: 'Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed',
                            },
                            {
                                name: 'BLOCK_NONE',
                                value: 'BLOCK_NONE',
                                description: 'All content will be allowed',
                            },
                        ],
                    },
                ],
            },
            {
                displayName: 'Sampling Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: {maxValue: 2, minValue: 0, numberPrecision: 1},
                default: 0.7,
                description: 'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
            },
            {
                displayName: 'Top K',
                name: 'topK',
                type: 'number',
                typeOptions: {maxValue: 32, minValue: 0, numberPrecision: 2},
                default: 32.0,
                description: 'Used to remove "long tail" low probability responses. Defaults to -1, which disables it.',
            },
            {
                displayName: 'Top P',
                name: 'topP',
                type: 'number',
                typeOptions: {maxValue: 1, minValue: 0, numberPrecision: 2},
                default: 1.0,
                description: 'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
            },
        ],
    },
];
