function Buffer() {
  var lines = []

  return {
    getLines: getLines,
    addLine:  addLine,
    replaceLine: replaceLine,
    deleteLine:  deleteLine
  }

  function getLines() {
    return lines
  }

  function addLine(beforeIndex) {
    if (beforeIndex < 0 || beforeIndex > lines.length) {
      throw 'Cannot add line before index ' + beforeIndex
    }

    lines = lines.slice(0, beforeIndex)
      .concat([''])
      .concat(lines.slice(beforeIndex))
  }

  function replaceLine(index, text) {
    if (index < 0 || index >= lines.length) {
      throw 'Cannot replace line at index ' + index
    }
    lines[index] = text
  }

  function deleteLine(index) {
    if (index < 0 || index >= lines.length) {
      throw 'Cannot delete line at index ' + index
    }
    lines = lines.slice(0, index)
      .concat(lines.slice(index + 1))
  }
}
