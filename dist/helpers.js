"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFactory = exports.debugFactory = exports.TypeNameToErrorCategory = void 0;
exports.extractResolvedString = extractResolvedString;
exports.isValidTypeName = isValidTypeName;
const typescript_1 = __importDefault(require("typescript"));
exports.TypeNameToErrorCategory = {
    RaiseCustomError: typescript_1.default.DiagnosticCategory.Error,
    RaiseCustomWarning: typescript_1.default.DiagnosticCategory.Warning,
};
function extractResolvedString({ type, checker }) {
    if (type.isStringLiteral()) {
        return type.value;
    }
    return checker.typeToString(type);
}
function isValidTypeName(typeName) {
    return typeName in exports.TypeNameToErrorCategory;
}
const debug = false;
exports.debugFactory = debug
    ? (sourceFile, customDiags) => (node, debugMessage) => {
        customDiags.push({
            file: sourceFile,
            category: typescript_1.default.DiagnosticCategory.Warning,
            code: 9999,
            messageText: "[Raise-Custoxm-Error]: " + (typeof debugMessage === "string" ? debugMessage : `\n${JSON.stringify(debugMessage(), undefined, 2)}`),
            start: node.getStart(),
            length: node.getWidth(),
        });
    }
    : (sourceFile, customDiags) => (node, debugMessage) => undefined;
const errorFactory = (sourceFile, customDiags) => {
    return (node, message, category = typescript_1.default.DiagnosticCategory.Error) => customDiags.push({
        file: sourceFile,
        category,
        code: 9999,
        messageText: "[Raise-Custom-Error]: " + message,
        start: node.getStart(),
        length: node.getWidth(),
    });
};
exports.errorFactory = errorFactory;
// export function dumpObject(
//     obj: unknown,
//     depth = 0,
//     visited = new WeakSet<object>()
// ): string {
//     let i = 0;
//     try {
//         return _dumpObject(obj, depth, visited);
//     }
//     catch (error) {
//         const fs = require("fs");
//         fs.writeFileSync(`dump-error-${i}.txt`, `{\n${error}\n}`, { flag: "a" });
//         i++;
//     }
// }
// function _dumpObject(
//     obj: unknown,
//     depth = 0,
//     visited = new WeakSet<object>(),
//     preservePath = false
// ): string {
//     const indent = (n: number) => "  ".repeat(n);
//     if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
//         return JSON.stringify(obj);
//     }
//     if (visited.has(obj)) {
//         return "[Circular]";
//     }
//     visited.add(obj);
//     if (Array.isArray(obj)) {
//         const items = obj.map(item => _dumpObject(item, depth + 1, visited));
//         return `[\n${indent(depth + 1)}${items.join(`,\n${indent(depth + 1)}`)}\n${indent(depth)}]`;
//     }
//     if (obj instanceof Map) {
//         const entries = Array.from(obj.entries()).map(
//             ([key, value]) =>
//                 `${indent(depth + 1)}${JSON.stringify(key)} => ${_dumpObject(value, depth + 1, visited)}`
//         );
//         return `Map {\n${entries.join(`,\n`)}\n${indent(depth)}}`;
//     }
//     if (obj instanceof Set) {
//         const entries = Array.from(obj.values()).map(
//             value => `${indent(depth + 1)}${_dumpObject(value, depth + 1, visited)}`
//         );
//         return `Set {\n${entries.join(`,\n`)}\n${indent(depth)}}`;
//     }
//     const entries = Object.entries(obj)
//     .map(([key, value]) => {
//         // Evaluate function once, safely
//         if (typeof value === "function") {
//             try {
//                 value = value();
//             } catch (e) {
//                 value = `[Function threw: ${(e as Error).message}]`;
//             }
//         }
//         if (key)
//         // If value is an object, scan its immediate children
//         if (typeof value === "object" && value !== null) {
//             const children = Array.isArray(value)
//                 ? value
//                 : Object.values(value);
//             for (const child of children) {
//                 if (typeof child === "object" && child !== null && visited.has(child)) {
//                     return undefined;
//                 }
//             }
//         }
//         return `${indent(depth + 1)}${key}: ${_dumpObject(value, depth + 1, visited)}`;
//     })
//     .filter((line): line is string => !!line);
//     if (depth === 0) {
//         i++;
//         const fs = require("fs");
//         fs.writeFileSync(`dump-${i}.txt`, `{\n${entries.join(`,\n`)}\n${indent(depth)}}`, { flag: "a" });
//     }
//     return `{\n${entries.join(`,\n`)}\n${indent(depth)}}`;
// }
