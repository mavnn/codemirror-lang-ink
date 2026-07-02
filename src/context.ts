import { ContextTracker } from "@lezer/lr"

// @ts-ignore-next "The terms file is generated during the grammar build process"
import { KnotName, StitchName, endOfKnotMarker, endOfStitchMarker } from "./generated/parser.terms"

export class KnotContext {
  constructor(public inKnot: boolean, public inStitch: boolean) {
  }
}

export const trackKnotName = new ContextTracker({
  start: new KnotContext(false, false),
  reduce(context, term) {
    if(term == KnotName) {
      return new KnotContext(true, false)
    } else if (term == StitchName) {
      return new KnotContext(true, true)
    } else {
      return context
    }
  },
  shift(context, term) {
    if (term == endOfStitchMarker) {
      return new KnotContext(true, false)
    } else if (term == endOfKnotMarker) {
      return new KnotContext(false, false)
    } else {
      return context
    }
  }
})
