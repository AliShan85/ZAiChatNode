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
exports.SsrfProtectionConfig = exports.SSRF_DEFAULT_BLOCKED_IP_RANGES = void 0;
const zod_1 = require("zod");
const custom_types_1 = require("../custom-types");
const decorators_1 = require("../decorators");
exports.SSRF_DEFAULT_BLOCKED_IP_RANGES = Object.freeze([
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    '127.0.0.0/8',
    '::1/128',
    '169.254.0.0/16',
    'fe80::/10',
    'fc00::/7',
    'fd00::/8',
    '0.0.0.0/8',
    '192.0.0.0/24',
    '192.0.2.0/24',
    '198.18.0.0/15',
    '198.51.100.0/24',
    '203.0.113.0/24',
]);
const parseBlockedIpRanges = (input) => {
    const values = input
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
    const expanded = values.flatMap((value) => value.toLowerCase() === 'default' ? exports.SSRF_DEFAULT_BLOCKED_IP_RANGES : value);
    return [...new Set(expanded)];
};
const blockedIpRangesSchema = zod_1.z.string().transform(parseBlockedIpRanges);
let SsrfProtectionConfig = class SsrfProtectionConfig {
    constructor() {
        this.enabled = false;
        this.blockedIpRanges = [...exports.SSRF_DEFAULT_BLOCKED_IP_RANGES];
        this.allowedIpRanges = [];
        this.allowedHostnames = [];
        this.dnsCacheMaxSize = 1024 * 1024;
    }
};
exports.SsrfProtectionConfig = SsrfProtectionConfig;
__decorate([
    (0, decorators_1.Env)('N8N_SSRF_PROTECTION_ENABLED'),
    __metadata("design:type", Boolean)
], SsrfProtectionConfig.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_SSRF_BLOCKED_IP_RANGES', blockedIpRangesSchema),
    __metadata("design:type", Array)
], SsrfProtectionConfig.prototype, "blockedIpRanges", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_SSRF_ALLOWED_IP_RANGES'),
    __metadata("design:type", custom_types_1.CommaSeparatedStringArray)
], SsrfProtectionConfig.prototype, "allowedIpRanges", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_SSRF_ALLOWED_HOSTNAMES'),
    __metadata("design:type", custom_types_1.CommaSeparatedStringArray)
], SsrfProtectionConfig.prototype, "allowedHostnames", void 0);
__decorate([
    (0, decorators_1.Env)('N8N_SSRF_DNS_CACHE_MAX_SIZE'),
    __metadata("design:type", Number)
], SsrfProtectionConfig.prototype, "dnsCacheMaxSize", void 0);
exports.SsrfProtectionConfig = SsrfProtectionConfig = __decorate([
    decorators_1.Config
], SsrfProtectionConfig);
//# sourceMappingURL=ssrf-protection.config.js.map