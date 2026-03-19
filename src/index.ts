import { parser } from "./syntax.grammar"
import { LRLanguage, LanguageSupport, foldNodeProp } from "@codemirror/language"
import { styleTags, tags as t } from "@lezer/highlight"

export const InkLanguage = LRLanguage.define(
        {
                parser: parser.configure({
                        props: [
                                foldNodeProp.add({
                                        Knot: (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: state.doc.lineAt(tree.to - 1).to }),
                                        Function: (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: state.doc.lineAt(tree.to - 1).to }),
                                        Stitch: (tree, state) => ({ from: state.doc.lineAt(tree.from).to, to: state.doc.lineAt(tree.to - 1).to }),
                                }),
                                styleTags({
                                        BlockComment: t.blockComment,
                                        AuthorWarning: t.comment,
                                        LineComment: t.comment,
                                        ContentLine: t.content,
                                        Glue: t.controlOperator,
                                        DivertArrow: t.controlOperator,
                                        OnceOnlyChoice: t.controlOperator,
                                        RepeatingChoice: t.controlOperator,
                                        ChoiceCondition: t.controlOperator,
                                        BlockConditionCase: t.controlOperator,
                                        WeaveBracket: t.controlOperator,
                                        Pipe: t.controlKeyword,
                                        BlockConditional: t.controlKeyword,
                                        Conditional: t.controlKeyword,
                                        "InlineSequence BlockSequence": t.controlKeyword,
                                        Name: t.literal,
                                        StitchName: t.literal,
                                        KnotName: t.literal,
                                        ListMember: t.literal,
                                        Path: t.literal,
                                        Stack: t.literal,
                                        SelectedName: t.literal,
                                        BracketName: t.literal,
                                        Bool: t.bool,
                                        Int: t.number,
                                        Float: t.number,
                                        String: t.string,
                                        Tag: t.labelName,
                                        Include: t.keyword,
                                        END: t.keyword,
                                        DONE: t.keyword,
                                        VariableDeclaration: t.keyword,
                                        ConstDeclaration: t.keyword,
                                        ListDeclaration: t.keyword,
                                        ListDefinition: t.keyword,
                                        StackDeclaration: t.keyword,
                                        VariableAssignment: t.keyword,
                                        "{ } < > =": t.keyword,
                                        ref: t.keyword,
                                        _function: t.keyword,
                                        Stitch: t.keyword,
                                        Gather: t.keyword,
                                        Knot: t.keyword,
                                        Function: t.keyword,
                                        SequenceTypeMarker: t.operator,
                                        Adjust: t.operator,
                                        IncDec: t.operator,
                                        ExpressionAndOr: t.logicOperator,
                                        ExpressionComparison: t.operator,
                                        ExpressionPresence: t.operator,
                                        ExpressionMod: t.operator,
                                        ExpressionAdd: t.operator,
                                        ExpressionSubstract: t.operator,
                                        ExpressionMultiply: t.operator,
                                        ExpressionDivide: t.operator,
                                        ExpressionNot: t.logicOperator,
                                        ChoiceTag: t.labelName,
                                        KnotArguments: t.bracket,
                                        SequenceContent: t.content
                                })
                        ]
                }), languageData: { commentTokens: { line: "//", block: { open: "/*", close: "*/" } } }
        });

export const InkLanguageSupport = (config: { dialect?: "visualink" }) => {
        const configured = InkLanguage.configure(config)
        return new LanguageSupport(configured)
}
