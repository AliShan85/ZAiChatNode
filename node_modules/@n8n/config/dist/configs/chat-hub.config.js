"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHubConfig = void 0;
const decorators_1 = require("../decorators");
let ChatHubConfig = class ChatHubConfig {
    constructor() {
        this.executionContextTtl = 3600;
        this.streamStateTtl = 300;
        this.maxBufferedChunks = 1000;
    }
};
exports.ChatHubConfig = ChatHubConfig;
__decorate([
    (0, decorators_1.Env)('N8N_CHAT_HUB_EXECUTION_CONTEXT_TTL'),
    __metadata("design:type", Number)
], ChatHubConfig.prototype, "executionContextTtl", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_CHAT_HUB_STREAM_STATE_TTL'),
    __metadata("design:type", Number)
], ChatHubConfig.prototype, "streamStateTtl", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_CHAT_HUB_MAX_BUFFERED_CHUNKS'),
    __metadata("design:type", Number)
], ChatHubConfig.prototype, "maxBufferedChunks", void 0);
exports.ChatHubConfig = ChatHubConfig = __decorate([
    decorators_1.Config
], ChatHubConfig);
//# sourceMappingURL=chat-hub.config.js.map