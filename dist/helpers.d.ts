import ts from "typescript";
export declare const TypeNameToErrorCategory: {
    readonly RaiseCustomError: ts.DiagnosticCategory.Error;
    readonly RaiseCustomWarning: ts.DiagnosticCategory.Warning;
};
export declare function extractResolvedString({ type, checker }: {
    type: ts.Type;
    checker: ts.TypeChecker;
}): string;
type TypeName = keyof typeof TypeNameToErrorCategory;
export declare function isValidTypeName(typeName: string): typeName is TypeName;
export declare const debugFactory: (sourceFile: ts.SourceFile, customDiags: ts.Diagnostic[]) => (node: ts.Node, debugMessage: (() => Record<string, string | number | boolean>) | string) => void;
export declare const errorFactory: (sourceFile: ts.SourceFile, customDiags: ts.Diagnostic[]) => (node: ts.Node, message: string, category?: ts.DiagnosticCategory) => number;
export {};
