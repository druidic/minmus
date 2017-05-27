describe('a text buffer', function() {
  it('has an array of lines that is initially empty', function() {
    expect(Buffer().getLines()).toEqual([])
  })

  it('adds an empty line', function() {
    var b = Buffer()
    b.addLine(0)
    expect(b.getLines()).toEqual([''])
  })

  it('replaces a line with different text', function() {
    var b = Buffer()
    b.addLine(0)
    b.replaceLine(0, 'hello')
    expect(b.getLines()).toEqual(['hello'])
  })

  it('adds a line in the middle of the document', function() {
    var b = Buffer()
    b.addLine(0)
    b.addLine(0)
    b.addLine(0)
    b.replaceLine(0, 'first')
    b.replaceLine(1, 'second')
    b.replaceLine(2, 'third')
    expect(b.getLines()).toEqual(['first', 'second', 'third'])

    b.addLine(2)

    expect(b.getLines()).toEqual(['first', 'second', '', 'third'])
  })

  it('blows up if you try to add a line out of bounds', function() {
    var b = Buffer()
    expect(function() { b.addLine(-1) }).toThrow('Cannot add line before index -1')
    expect(function() { b.addLine(1) }).toThrow('Cannot add line before index 1')
  })

  it('blows up if you try to replace a nonexistent line', function() {
    var b = Buffer()
    expect(function() { b.replaceLine(0) }).toThrow('Cannot replace line at index 0')
    expect(function() { b.replaceLine(-1) }).toThrow('Cannot replace line at index -1')
  })

  it('deletes a line', function() {
    var b = Buffer()
    b.addLine(0)
    b.addLine(1)
    b.replaceLine(0, 'first')
    b.replaceLine(1, 'second')

    b.deleteLine(1)

    expect(b.getLines()).toEqual(['first'])

    b.deleteLine(0)

    expect(b.getLines()).toEqual([])
  })

  it('blows up if you try to delete a nonexistent line', function() {
    var b = Buffer()
    expect(function() { b.deleteLine(0) }).toThrow('Cannot delete line at index 0')
    expect(function() { b.deleteLine(-1) }).toThrow('Cannot delete line at index -1')
  })
})
