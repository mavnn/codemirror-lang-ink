import { nodeResolve }  from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import {lezer} from "@lezer/generator/rollup"

export default {
  input: 'src/index.ts',
  output: { file: './dist/index.js', format: 'cjs' },
  plugins: [lezer(), nodeResolve(), typescript()],
  external: (id) => /node_modules\//.test(id)
}