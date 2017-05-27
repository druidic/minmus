describe('Minmus', function() {
  it('inserts text', function() {
    var m = Minmus()

    var output = m.main({type: 'keyDown', key: 65})

    expect(output).toEqual({
      screen: [' │ a█']
    })

    output = m.main({type: 'keyDown', key: 66})

    expect(output).toEqual({
      screen: [' │ ab█']
    })
  })

  it('does not update on clock events when no key is held', function() {
    var m = Minmus()

    var output = m.main({type: 'clock'})

    expect(output).toBe(null)
  })
})
