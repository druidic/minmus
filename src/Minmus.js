function special(keyCode) {
  return {
    8: 'backspace',
    13: 'enter',
    16: 'shift'
  }[keyCode]
}

function truncate(length) {
  return function(string) {
    return string.slice(0, length)
  }
}

function prefix(head) {
  return function(body) {
    return head + body
  }
}

function suffix(tail) {
  return function(body) {
    return body + tail
  }
}

function identity(x) {
  return x
}

function insert(item, beforeIndex, array) {
  return array.slice(0, beforeIndex)
    .concat([item])
    .concat(array.slice(beforeIndex))
}

function remove(index, array) {
  return array.slice(0, index).concat(array.slice(index + 1))
}

function at(indexToTransform, transformation, _default) {
  _default = _default || identity
  return function(item, index) {
    return index === indexToTransform
      ? transformation(item)
      : _default(item)
  }
}

function Minmus() {
  var lines = ['']
  var cursor = 0
  var scrollPos = 0
  var shift = false
  var mode = 'edit'
  var backspaceHeldFrames = 0

  return {
    main: main
  }

  function render(updatedRecords, toPrint) {
    var screenLineWithCursor = cursor - scrollPos
    if (mode === 'edit') {
      return {
        screen: lines
          .slice(scrollPos)
          .map(truncate(60))
          .map(prefix(' │ '))
          .map(at(screenLineWithCursor, suffix('█')))
      }
    } else if (mode === 'semicolon') {
      return {
        screen: lines
          .slice(scrollPos)
          .map(truncate(60))
          .map(at(screenLineWithCursor, prefix('▒│ '), prefix(' │ ')))
          .map(at(screenLineWithCursor, suffix('▒')))
      }
    } else if (mode === 'command') {
      return {
        screen: lines
          .slice(scrollPos)
          .map(truncate(60))
          .map(at(screenLineWithCursor, prefix('█│ '), prefix(' │ '))),
        records: updatedRecords,
        print: toPrint
      }
    }
  }

  function main(event, records) {
    var updatedRecords = {}
    var toPrint = null

    if (event.type === 'startup') {
      if (records.read('myfile')) {
        lines = records.read('myfile').split('\n')
      }
      return render()
    }

    if (event.type === 'keyDown') {
      if (mode === 'edit') {
        if (special(event.key)) {
          switch (special(event.key)) {
            case 'shift':
              shift = true
              break
            case 'backspace':
              if (lines[cursor].length > 0) {
                lines[cursor] = lines[cursor].slice(0, lines[cursor].length - 1)
              } else {
                lines = remove(cursor--, lines)
                fixCursor()
              }

              backspaceHeldFrames = 1

              break
            case 'enter':
              lines = insert('', ++cursor, lines)
              keepCursorOnScreen()
              break
          }
        } else {
          if (char(event.key, shift) === ';') {
            mode = 'semicolon'
          } else {
            lines[cursor] += char(event.key, shift) || ''
          }
        }
      } else if (mode === 'semicolon') {
        var c = char(event.key, shift)
        if (c === ';' || c === ' ' || c === '\n') {
          mode = 'edit'
          lines[cursor] += ';'
          if (c === '\n') lines = insert('', ++cursor, lines)
          if (c === ' ') lines[cursor] += ' '
        } else {
          mode = 'command'
        }
      }

      if (mode === 'command') {
        switch (char(event.key, shift)) {
          case 'l':
            mode = 'edit'
            break
          case 'j':
            cursor++
            if (cursor >= lines.length) {
              cursor = lines.length - 1
            }
            break
          case 'k':
            cursor--
            if (cursor < 0) {
              cursor = 0
            }
            break
          case 'i':
            lines = insert('', cursor++, lines)
            break
          case 'd':
            lines = remove(cursor--, lines)
            fixCursor()
            break
          case 's':
            updatedRecords['myfile'] = lines.join('\n')
            break
          case 'p':
            toPrint = '<code><pre>'
              + lines.join('\n')
              + '</pre></code>'
            break
        }
      }

      keepCursorOnScreen()
      return render(updatedRecords, toPrint)
    }

    if (event.type === 'keyUp') {
      if (special(event.key)) {
        switch (special(event.key)) {
          case 'shift':
            shift = false
            break
          case 'backspace':
            backspaceHeldFrames = 0
            break
        }
      }
    }

    if (event.type === 'clock' && mode === 'edit' && backspaceHeldFrames) {
      if (backspaceHeldFrames++ > 3) {
        if (lines[cursor].length > 0) {
          lines[cursor] = lines[cursor].slice(0, lines[cursor].length - 1)
        } else {
          lines = remove(cursor--, lines)
          fixCursor()
        }
      }

      keepCursorOnScreen()
      return render()
    }

    return null
  }

  function fixCursor() {
    if (lines.length === 0) lines = ['']
    if (cursor < 0) cursor = 0
  }

  function keepCursorOnScreen() {
    if (scrollPos < cursor - 32 + 5) {
      scrollPos = cursor - 32 + 5
    }
    if (scrollPos > cursor - 5) {
      scrollPos = cursor - 5
    }
    if (scrollPos < 0) {
      scrollPos = 0
    }
  }
}
