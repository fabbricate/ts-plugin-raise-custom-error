"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = __importDefault(require("typescript"));
const helpers_1 = require("./helpers");
module.exports = function init() {
    function create(info) {
        const proxy = Object.create(null);
        const oldLS = info.languageService;
        for (const k in oldLS) {
            const x = oldLS[k];
            proxy[k] = typeof x === 'function' ? (...args) => x.apply(oldLS, args) : x;
        }
        const oldGetSemanticDiagnostics = oldLS.getSemanticDiagnostics;
        proxy.getSemanticDiagnostics = (fileName) => {
            const prior = oldGetSemanticDiagnostics.call(oldLS, fileName);
            const sourceFile = info.languageService.getProgram()?.getSourceFile(fileName);
            if (!sourceFile)
                return prior;
            const checker = info.languageService.getProgram().getTypeChecker();
            const customDiags = [];
            const ERROR = (0, helpers_1.errorFactory)(sourceFile, customDiags);
            const DEBUG = (0, helpers_1.debugFactory)(sourceFile, customDiags);
            function visit(node) {
                if (typescript_1.default.isCallExpression(node)) {
                    const sig = checker.getResolvedSignature(node);
                    const retType = sig?.getReturnType();
                    const decl = sig?.declaration;
                    if (decl && typescript_1.default.isFunctionLike(decl) && decl.type && typescript_1.default.isTypeReferenceNode(decl.type)) {
                        const { typeName } = decl.type;
                        const typeParameters = decl.type.typeArguments;
                        if (typescript_1.default.isIdentifier(typeName) &&
                            (0, helpers_1.isValidTypeName)(typeName.text) &&
                            typeParameters.length === 3) {
                            const [_t, boolArg, msgArg] = typeParameters;
                            let isFailure = typescript_1.default.isLiteralTypeNode(boolArg) &&
                                boolArg.literal.kind === typescript_1.default.SyntaxKind.FalseKeyword;
                            if (_t.kind === typescript_1.default.SyntaxKind.TypeAliasDeclaration) {
                                const x2 = checker.getTypeFromTypeNode(_t).symbol;
                                DEBUG(_t, () => ({
                                    x2: x2.name ?? "",
                                    x3: x2.getName()
                                }));
                            }
                            if (!isFailure) {
                                try {
                                    isFailure = returnTypeFails(retType, checker);
                                }
                                catch (e) {
                                    // nothing
                                }
                            }
                            const message = typescript_1.default.isLiteralTypeNode(msgArg) &&
                                typescript_1.default.isStringLiteral(msgArg.literal)
                                ? msgArg.literal.text
                                : "Missing message";
                            if (isFailure) {
                                ERROR(node, message, helpers_1.TypeNameToErrorCategory[typeName.text]);
                            }
                            DEBUG(node, () => ({
                                x2: node.kind,
                                x3a: _t.kind
                            }));
                            // if (2 > 1) {
                            //   const x2 = checker.getTypeFromTypeNode(_t);
                            //   const x3 = checker.getSymbolAtLocation(node)
                            //   dumpObject(x2)
                            //   dumpObject(x3)
                            //   dumpObject(typeParameters)
                            //   dumpObject(typeName)
                            //   dumpObject(_t)
                            //   dumpObject(node)
                            // }
                            DEBUG(node, () => ({
                                isFailure,
                                message,
                                isBooleanLiteral: typescript_1.default.isLiteralTypeNode(boolArg) && boolArg.literal.kind === typescript_1.default.SyntaxKind.FalseKeyword,
                                isTypeReferenceNode: typescript_1.default.isTypeReferenceNode(node),
                                isCallExpression: typescript_1.default.isCallExpression(node),
                                isIdentifier: typescript_1.default.isIdentifier(typeName),
                                typeName: typeName.text,
                                typeParameters: typeParameters.map((param) => checker.typeToString(checker.getTypeFromTypeNode(param))).join("\n"),
                            }));
                            return;
                        }
                    }
                }
                if (typescript_1.default.isTypeReferenceNode(node) &&
                    typescript_1.default.isIdentifier(node.typeName) &&
                    (0, helpers_1.isValidTypeName)(node.typeName.text)) {
                    let [_t, boolArg, messageArg] = node.typeArguments ?? [];
                    const isBooleanLiteral = typescript_1.default.isLiteralTypeNode(boolArg) &&
                        (boolArg.literal.kind === typescript_1.default.SyntaxKind.FalseKeyword ||
                            boolArg.literal.kind === typescript_1.default.SyntaxKind.TrueKeyword);
                    if (isBooleanLiteral && boolArg.literal.kind === typescript_1.default.SyntaxKind.TrueKeyword) {
                        return;
                    }
                    const message = typescript_1.default.isLiteralTypeNode(messageArg) && typescript_1.default.isStringLiteral(messageArg.literal)
                        ? messageArg.literal.text
                        : "Unable to resolve message";
                    if (isBooleanLiteral) {
                        ERROR(node, message, helpers_1.TypeNameToErrorCategory[node.typeName.text]);
                        DEBUG(node, () => ({
                            isBooleanLiteral,
                            message,
                            isTypeReferenceNode: typescript_1.default.isTypeReferenceNode(node),
                            isIdentifier: typescript_1.default.isIdentifier(node.typeName),
                            typeName: node.typeName.getText(),
                            typeArguments: node.typeArguments?.map((param) => checker.typeToString(checker.getTypeFromTypeNode(param))).join("\n"),
                        }));
                        return;
                    }
                    try {
                        const resolved = checker.getTypeFromTypeNode(boolArg);
                        const boolString = checker.typeToString(resolved);
                        const isFalse = boolString === "false";
                        if (isFalse) {
                            ERROR(node, message, helpers_1.TypeNameToErrorCategory[node.typeName.text]);
                            DEBUG(node, () => ({
                                isFalse,
                                message,
                                isTypeReferenceNode: typescript_1.default.isTypeReferenceNode(node),
                                isIdentifier: typescript_1.default.isIdentifier(node.typeName),
                                typeName: node.typeName.getText(),
                                typeArguments: node.typeArguments?.map((param) => checker.typeToString(checker.getTypeFromTypeNode(param))).join("\n"),
                            }));
                            return;
                        }
                        else {
                            DEBUG(node, () => ({
                                isFalse,
                                message,
                                isTypeReferenceNode: typescript_1.default.isTypeReferenceNode(node),
                                isIdentifier: typescript_1.default.isIdentifier(node.typeName),
                                typeName: node.typeName.getText(),
                                typeArguments: node.typeArguments?.map((param) => checker.typeToString(checker.getTypeFromTypeNode(param))).join("\n"),
                            }));
                            return;
                        }
                    }
                    catch (error) {
                        ERROR(node, "Unable to evaluate RaiseCustomError condition", typescript_1.default.DiagnosticCategory.Message);
                        DEBUG(node, error.stack());
                    }
                }
                ``;
                typescript_1.default.forEachChild(node, visit);
            }
            typescript_1.default.forEachChild(sourceFile, visit);
            return prior.concat(customDiags);
        };
        return proxy;
    }
    return { create };
};
function returnTypeFails(type, checker) {
    console.log("type", getBaseTypeName(type, checker));
    return (getBaseTypeName(type, checker) === "__RaiseCustomFailure");
}
function getBaseTypeName(type, checker) {
    const symbol = type.aliasSymbol ?? type.symbol;
    return symbol?.getName();
}
