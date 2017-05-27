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
  var shift = false
  var mode = 'edit'
  var backspaceHeldFrames = 0

  return {
    main: main
  }

  function main(event) {
    if (event.type === 'startup') {
      return {
        screen: [' │ █']
      }
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
                if (lines.length === 0) lines = ['']
                if (cursor < 0) cursor = 0
              }

              backspaceHeldFrames = 1

              break
            case 'enter':
              lines = insert('', ++cursor, lines)
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
            if (cursor < 0) cursor = 0
            if (lines.length === 0) lines = ['']
        }
      }

      if (mode === 'edit') {
        return {
          screen: lines
            .map(truncate(60))
            .map(prefix(' │ '))
            .map(at(cursor, suffix('█')))
        }
      } else if (mode === 'semicolon') {
        return {
          screen: lines
            .map(truncate(60))
            .map(at(cursor, prefix('▒│ '), prefix(' │ ')))
            .map(at(cursor, suffix('▒')))
        }
      } else if (mode === 'command') {
        return {
          screen: lines
            .map(truncate(60))
            .map(at(cursor, prefix('█│ '), prefix(' │ ')))
        }
      }
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
          if (lines.length === 0) lines = ['']
          if (cursor < 0) cursor = 0
        }
      }

      return {
        screen: lines
          .map(truncate(60))
          .map(prefix(' │ '))
          .map(at(cursor, suffix('█')))
      }
    }

    return null
  }
}
