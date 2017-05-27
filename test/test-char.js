describe('char', function() {
  it('converts a key code to a character', function() {
    expect(char(65)).toBe('a')
    expect(char(66)).toBe('b')
  })

  it('applies a shift modifier', function() {
    expect(char(65, true)).toBe('A')
  })

  it('returns null for a nonexistent key code', function() {
    expect(char(-1)).toBe(null)
  })
})
