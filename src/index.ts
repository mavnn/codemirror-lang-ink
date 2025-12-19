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
                                        ContentLine: t.content,
                                        Glue: t.controlOperator,
                                        not: t.logicOperator,
                                        Name: t.literal,
                                        StitchName: t.literal,
                                        KnotName: t.literal,
                                        ListMember: t.literal,
                                        DivertArrow: t.controlOperator,
                                        Path: t.literal,
                                        END: t.keyword,
                                        DONE: t.keyword,
                                        Bool: t.bool,
                                        Int: t.number,
                                        Float: t.number,
                                        String: t.string,
                                        SequenceTypeMarker: t.operator,
                                        Pipe: t.controlKeyword,
                                        Tag: t.labelName,
                                        LineComment: t.comment,
                                        Include: t.keyword,
                                        VariableDeclaration: t.keyword,
                                        ConstDeclaration: t.keyword,
                                        ListDeclaration: t.keyword,
                                        ListDefinition: t.keyword,
                                        StackDeclaration: t.keyword,
                                        SelectedName: t.literal,
                                        VariableAssignment: t.keyword,
                                        Adjust: t.operator,
                                        IncDec: t.operator,
                                        OnceOnlyChoice: t.controlOperator,
                                        BracketName: t.literal,
                                        ChoiceCondition: t.controlOperator,
                                        WeaveBracket: t.controlOperator,
                                        ChoiceTag: t.labelName,
                                        RepeatingChoice: t.controlOperator,
                                        Knot: t.keyword,
                                        Function: t.keyword,
                                        KnotArguments: t.bracket,
                                        ref: t.keyword,
                                        _function: t.keyword,
                                        Stitch: t.keyword,
                                        Gather: t.keyword,
                                        "InlineSequence BlockSequence": t.controlKeyword,
                                        SequenceContent: t.content,
                                        "{ } < > =": t.keyword
                                })
                        ]
                }), languageData: { commentTokens: { line: "//", block: { open: "/*", close: "*/" } } }
        });

export const InkLanguageSupport = (config: { dialect?: "visualink" }) => {
        const configured = InkLanguage.configure(config)
        return new LanguageSupport(configured)
}
