import { ExternalTokenizer } from "@lezer/lr"

// @ts-ignore-next "The terms file is generated during the grammar build process"
import { inlineConditionalOpen, inlineSequenceOpen, inlineDisplayVariableOpen, blockOpen, endOfKnotMarker, endOfStitchMarker, startOfChoiceMarker, notStartOfChoiceMarker } from "./generated/parser.terms"

const pipe = 124, colon = 58, braceL = 123, braceR = 125, newLine = 10, equal = 61, space = 32, tab = 9, asterix = 42, plus = 43

export const endOfKnot = new ExternalTokenizer((input, stack) => {
        let previous_index = -1
        let prev = input.peek(previous_index)
        // Knot markers must be the first non-whitespace token on a line
        while (prev == space || prev == tab) {
                previous_index -= 1
                prev = input.peek(previous_index)
        }
        if (prev != -1 && prev != newLine) { return }
        const doubleEquals = input.peek(0) == equal && input.peek(1) == equal
        const endOfFile = input.peek(0) == -1
        const isChoice = input.peek(0) == plus || input.peek(0) == asterix
        if (isChoice) {
                input.acceptToken(startOfChoiceMarker)
                return
        }
        if (stack.context.inStitch && (endOfFile || input.peek(0) == equal)) {
                input.acceptToken(endOfStitchMarker)
                return
        }
        if (!stack.context.inStitch && (doubleEquals || endOfFile)) {
                input.acceptToken(endOfKnotMarker)
                return
        }
}, { contextual: true })

export const checkBrace = new ExternalTokenizer((input) => {
        let ahead = 0
        let peeked = input.peek(0)
        let nestedOpeningCount = 0
        while (peeked !== -1) {
                if (peeked === braceL) {
                        nestedOpeningCount++
                        ahead++
                        peeked = input.peek(ahead)
                } else if (peeked === pipe) {
                        var count = 0
                        do {
                          ahead += 1
                          count++
                        } while (input.peek(ahead) === pipe)
                        if (count != 2) {
                                input.acceptToken(inlineSequenceOpen)
                                return
                        } else {
                          peeked = input.peek(ahead)
                        }
                } else if (peeked === braceR) {
                        if (nestedOpeningCount === 0) {
                                input.acceptToken(inlineDisplayVariableOpen)
                                return
                        } else {
                                nestedOpeningCount--
                                ahead++
                                peeked = input.peek(ahead)
                        }
                } else if (peeked === colon) {
                        ahead++
                        peeked = input.peek(ahead)
                        while (peeked !== -1) {
                                if (peeked === braceL) {
                                        nestedOpeningCount++
                                        ahead++
                                        peeked = input.peek(ahead)
                                } else if (peeked === newLine) {
                                        input.acceptToken(blockOpen)
                                        return
                                } else if (peeked === braceR) {
                                        if (nestedOpeningCount === 0) {
                                                input.acceptToken(inlineConditionalOpen)
                                                return
                                        } else {
                                                nestedOpeningCount--
                                        }
                                }
                                ahead++
                                peeked = input.peek(ahead)
                        }
                } else if (peeked === newLine) {
                        return
                } else {
                        ahead++
                        peeked = input.peek(ahead)
                }
        }
}, { fallback: true })
