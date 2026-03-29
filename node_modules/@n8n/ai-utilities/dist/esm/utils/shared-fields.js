"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataFilterField = void 0;
exports.getTemplateNoticeField = getTemplateNoticeField;
exports.getBatchingOptionFields = getBatchingOptionFields;
exports.getConnectionHintNoticeField = getConnectionHintNoticeField;
const n8n_workflow_1 = require("n8n-workflow");
exports.metadataFilterField = {
    displayName: 'Metadata Filter',
    name: 'metadata',
    type: 'fixedCollection',
    description: 'Metadata to filter the document by',
    typeOptions: {
        multipleValues: true,
    },
    default: {},
    placeholder: 'Add filter field',
    options: [
        {
            name: 'metadataValues',
            displayName: 'Fields to Set',
            values: [
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    default: '',
                },
            ],
        },
    ],
};
function getTemplateNoticeField(templateId) {
    return {
        displayName: `Save time with an <a href="/templates/${templateId}" target="_blank">example</a> of how this node works`,
        name: 'notice',
        type: 'notice',
        default: '',
    };
}
function getBatchingOptionFields(displayOptions, defaultBatchSize = 5) {
    return {
        displayName: 'Batch Processing',
        name: 'batching',
        type: 'collection',
        placeholder: 'Add Batch Processing Option',
        description: 'Batch processing options for rate limiting',
        default: {},
        options: [
            {
                displayName: 'Batch Size',
                name: 'batchSize',
                default: defaultBatchSize,
                type: 'number',
                description: 'How many items to process in parallel. This is useful for rate limiting, but might impact the log output ordering.',
            },
            {
                displayName: 'Delay Between Batches',
                name: 'delayBetweenBatches',
                default: 0,
                type: 'number',
                description: 'Delay in milliseconds between batches. This is useful for rate limiting.',
            },
        ],
        displayOptions,
    };
}
const connectionsString = {
    [n8n_workflow_1.NodeConnectionTypes.AiAgent]: {
        connection: '',
        locale: 'AI Agent',
    },
    [n8n_workflow_1.NodeConnectionTypes.AiChain]: {
        connection: '',
        locale: 'AI Chain',
    },
    [n8n_workflow_1.NodeConnectionTypes.AiDocument]: {
        connection: n8n_workflow_1.NodeConnectionTypes.AiDocument,
        locale: 'Document Loader',
    },
    [n8n_workflow_1.NodeConnectionTypes.AiVectorStore]: {
        connection: n8n_workflow_1.NodeConnectionTypes.AiVectorStore,
        locale: 'Vector Store',
    },
    [n8n_workflow_1.NodeConnectionTypes.AiRetriever]: {
        connection: n8n_workflow_1.NodeConnectionTypes.AiRetriever,
        locale: 'Vector Store Retriever',
    },
};
function determineArticle(nextWord) {
    const vowels = /^[aeiouAEIOU]/;
    return vowels.test(nextWord) ? 'an' : 'a';
}
const getConnectionParameterString = (connectionType) => {
    if (connectionType === '')
        return "data-action-parameter-creatorview='AI'";
    return `data-action-parameter-connectiontype='${connectionType}'`;
};
const getAhref = (connectionType) => `<a class="test" data-action='openSelectiveNodeCreator'${getConnectionParameterString(connectionType.connection)}'>${connectionType.locale}</a>`;
function getConnectionHintNoticeField(connectionTypes) {
    const groupedConnections = new Map();
    connectionTypes.forEach((connectionType) => {
        const connectionString = connectionsString[connectionType].connection;
        const localeString = connectionsString[connectionType].locale;
        if (!groupedConnections.has(connectionString)) {
            groupedConnections.set(connectionString, [localeString]);
            return;
        }
        groupedConnections.get(connectionString)?.push(localeString);
    });
    let displayName;
    if (groupedConnections.size === 1) {
        const [[connection, locales]] = Array.from(groupedConnections);
        displayName = `This node must be connected to ${determineArticle(locales[0])} ${locales[0]
            .toLowerCase()
            .replace(/^ai /, 'AI ')}. <a data-action='openSelectiveNodeCreator' ${getConnectionParameterString(connection)}>Insert one</a>`;
    }
    else {
        const ahrefs = Array.from(groupedConnections, ([connection, locales]) => {
            const locale = locales.length > 1
                ? locales
                    .map((localeString, index, { length }) => {
                    return ((index === 0 ? `${determineArticle(localeString)} ` : '') +
                        (index < length - 1 ? `${localeString} or ` : localeString));
                })
                    .join('')
                : `${determineArticle(locales[0])} ${locales[0]}`;
            return getAhref({ connection, locale });
        });
        displayName = `This node needs to be connected to ${ahrefs.join(' or ')}.`;
    }
    return {
        displayName,
        name: 'notice',
        type: 'notice',
        default: '',
        typeOptions: {
            containerClass: 'ndv-connection-hint-notice',
        },
    };
}
//# sourceMappingURL=shared-fields.js.map