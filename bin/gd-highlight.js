import { NodeProp, TreeFragment } from "@lezer/common"
import { InkLanguage } from "../dist/index.js"
import * as fs from "node:fs"
import * as timers from "node:timers"

let cachedFragments = []
let previousLineLengths = []
let lineLengths = []
const language = InkLanguage.configure({dialect: "visualink"})

async function sendInt32(i) {
    var payloadBuffer = Buffer.from(new Uint32Array(4))
    payloadBuffer.writeInt32LE(i)
    return await new Promise((resolve) => fs.write(process.stderr.fd, payloadBuffer, {length: 4 }, (_, bytes) => resolve(bytes)))
}

async function sendInt8(i) {
    var payloadBuffer = Buffer.from(new Uint32Array(1))
    payloadBuffer.writeInt8(i)
    return await new Promise((resolve) => fs.write(process.stderr.fd, payloadBuffer, {length: payloadBuffer.byteLength }, (_, bytes) => resolve(bytes)))
}

async function readInt32() {
    var int32Buffer
    var no_data = true

    while(no_data) {
        await new Promise((resolve) =>
            {
                process.stdin.once('readable', () => {
                    let chunk = process.stdin.read(4)
                    if(chunk && chunk.length == 4) {
                        no_data = false
                        int32Buffer = Buffer.from(chunk)
                        resolve()
                    } else {
                        timers.setImmediate(resolve)
                    }
                })
            })
    }

    return int32Buffer.readInt32LE()
}

(async function calculate_highlights() {
    var heartbeat = true
    timers.setInterval(
        () => {
            if(heartbeat) {
                heartbeat = false
            } else {
                throw "Done"
            }
        },
        10000
    )

    while(true) {
        var read_length = await readInt32()
        heartbeat = true
        var line_from = await readInt32()
        var line_to = await readInt32()
        var remaining_length = read_length
        var amount_read = 0
        const contentBuffer = Buffer.from(new ArrayBuffer(read_length), "utf8")
        await new Promise((resolve) => process.stdin.once('readable', resolve))
        while(remaining_length > 0) {
            let chunk = process.stdin.read(Math.min(1024 * 64, remaining_length))
            if(chunk) {
                contentBuffer.write(chunk.toString('utf8'), amount_read)
                remaining_length -= chunk.length
                amount_read += chunk.length
            } else {
                await new Promise((resolve) => timers.setImmediate(resolve))
                await new Promise((resolve) => process.stdin.once('readable', resolve))
            }
        }
        var ink = contentBuffer.toString()
        lineLengths = ink.split('\n').map((l) => l.length)
        if(cachedFragments.length > 0 && line_from == line_to) {
            var fromA = getPos(previousLineLengths, line_from, 0)
            var toA = getPos(previousLineLengths, line_from, -1)
            var fromB = getPos(lineLengths, line_to, 0)
            var toB = getPos(lineLengths, line_to, -1)
            console.log(fromA, toA, fromB, toB)
            cachedFragments = TreeFragment.applyChanges(cachedFragments, [{fromA, toA, fromB, toB}])
        } else {
            cachedFragments = []
        }
        const parsed = language.parser.parse(ink, cachedFragments)
        cachedFragments = TreeFragment.addTree(parsed)
        const cursor = parsed.cursor()
        var stack = []
        var colors = []
        while(cursor.next()) {
            if (cursor.from == cursor.to) {
                // Zero length elements will never be highlighted, ignore
                continue
            }
            if(stack.length > 0) {
                checkStack()
            }
            var groups = cursor.type.prop(NodeProp.group)
            var name = { group: groups ? groups[0] : cursor.name, name: cursor.name }
            stack.push({ from: cursor.from, to: cursor.to, name })
        }
        while(stack.length != 0) {
            var next = stack.pop()
            colors.push(next)
        }
        var highlighting = {}
        for(let i = 0; i < lineLengths.length; i++) {
            highlighting[i] = {}
        }
        colors.reduce(reduceColors, highlighting)

        process.stderr.write("Data incoming\n")
        let numberOfLines = Object.keys(highlighting).length
        await sendInt32(numberOfLines)

        for(let [key, cols] of Object.entries(highlighting)) {
            // line number
            await sendInt32(parseInt(key))
            // number of sections
            await sendInt32(Object.keys(cols).length)

            // each section
            for(let [start, data] of Object.entries(cols)) {
                // column number
                await sendInt32(parseInt(start))
                // highlight type
                let highlight_type = 0
                switch(data.group) {
                case "Text":
                    highlight_type = 0
                    break
                case "Comment":
                    highlight_type = 1
                    break
                case "Keyword":
                    highlight_type = 2
                    break
                case "Literal":
                    highlight_type = 3
                    break
                case "Expression":
                    highlight_type = 4
                    break
                case "Tags":
                    highlight_type = 5
                    break
                case "Path":
                    highlight_type = 6
                    break
                case "Divert":
                    highlight_type = 7
                    break
                case "Names":
                    highlight_type = 8
                    break
                case "Operator":
                    highlight_type = 9
                    break
                }
                await sendInt8(highlight_type)
            }
        }
        previousLineLengths = lineLengths
        // throw "done"

        function checkStack() {
                var prev = stack.pop()
                if(prev.to <= cursor.from) {
                    // Next element is outside previous stack, so that stack is done
                    pushColor(prev)
                    if(stack.length > 0) {
                        checkStack()
                    }
                } else if (prev.to <= cursor.to) {
                    // Child completely fills remaining context, so push the parent prefix 
                    // if there is one
                    if(prev.from < cursor.from) {
                        pushColor({ from: prev.from, to: cursor.from, name: prev.name })
                    }
                    if(stack.length > 0) {
                        checkStack()
                    }
                } else {
                    // To get here, the next element is a child that does not fill the remaining
                    // parent context - so split the parent context to leave the child in the middle
                    pushColor({ from: prev.from, to: cursor.from, name: prev.name })
                    stack.push({from: cursor.to, to: prev.to, name: prev.name})
                }
        }

        function pushColor(color) {
            if(color.from == color.to) {
                return
            }
            if(colors.length > 0 && color.from != colors[colors.length - 1].to) {
                colors.push({ from: colors[colors.length - 1].to, to: color.from, name: { group: "Text", name: "Skipped" } })
            }
            colors.push(color)
        }

        function reduceColors(acc, next) {
            var start = getLineAndCol(lineLengths, next.from)
            var end = getLineAndCol(lineLengths, next.to)
            var data = { ...next.name, end }
            if(start.line == end.line) {
                if(start.col < lineLengths[start.line]) {
                    acc[start.line.toString()][start.col.toString()] = data
                }
            } else {
                if(start.col < lineLengths[start.line]) {
                    acc[start.line.toString()][start.col.toString()] = data
                }
                for(var i = start.line + 1; i <= end.line; i++) {
                    if(end.col != 0) {
                        acc[end.line.toString()]['0'] = data
                    }
                }
            }
            return acc
        }

    }
})()


function getLineAndCol(lineLengths, pos) {
    var line = 0
    while(line <= lineLengths.length) {
        if(pos <= lineLengths[line]) {
            return { line: line, col: pos }
        } else {
            pos = pos - (lineLengths[line] + 1)
            line += 1
        }
    }
}

function getPos(lineLengths, line, col) {
    var pos = 0
    for(let i = 0; i < line; i++) {
        pos += lineLengths[i]
    }
    if(col >= 0) {
        return pos + col
    } else {
        return pos + (lineLengths[line] + col)
    }
}
