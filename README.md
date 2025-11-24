# Ink language support for CodeMirror

- [CodeMirror](https://codemirror.net/)
- [Ink](https://www.inklestudios.com/ink/)

This package implements Ink language support for the
[CodeMirror](https://codemirror.net/) code editor.

This code is released under an
[MIT license](https://github.com/mavnn/codemirror-lang-ink/tree/main/LICENSE).

## Usage

```javascript
import {EditorView, basicSetup} from "codemirror"
import {InkLanguageSupport} from "@codemirror/lang-markdown"

const view = new EditorView({
  parent: document.body,
  doc: `Once upon a time...`,
  extensions: [basicSetup, InkSupport]
})
```

