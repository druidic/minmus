describe('Minmus', function() {
  it('inserts text', function() {
    var app = AppController(Minmus())
    app.input('a')
    expect(app.getScreen()[0]).toBe(' │ a█')
  })

  it('does not update on clock events when no key is held', function() {
    var m = Minmus()

    var output = m.main({type: 'clock'})

    expect(output).toBe(null)
  })

  it('scrolls down so the cursor remains on the screen', function() {
    var app = AppController(Minmus())
    // fill the current screen with blank lines
    app.input(repeat(40, 'nope\n'))
    app.input('foo')
    expect(app.getScreen()).toContain(' │ foo█')
  })
})

function repeat(times, string) {
  return new Array(times + 1).join(string)
}
