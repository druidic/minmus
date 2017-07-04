function AppController(app) {
  var started = false
  var records = FakeRecords()
  var onScreen = ''

  return {
    start: start,
    input: input,
    pressKey: pressKey,
    // releaseKey: releaseKey,
    wait: wait,
    getScreen: getScreen
  }

  function start() {
    callMain({type: 'startup'}, records)
    started = true
  }

  function input(text) {
    if (!started) start()

    for (var i = 0; i < text.length; i++) {
      charToKeyEvents(text.charAt(i))
    }
  }

  function pressKey(code) {
    if (!started) start()

    callMain({type: 'keyDown', key: code})
  }

  function wait(frames) {
    if (!started) start()

    for (var i = 0; i < frames; i++) {
      callMain({type: 'clock'})
    }
  }

  function charToKeyEvents(c) {
    if (needsShift(c)) {
      callMain({type: 'keyDown', key: 16}, records)
      callMain({type: 'keyDown', key: keyCode(c)}, records)
      callMain({type: 'keyUp', key: keyCode(c)}, records)
      callMain({type: 'keyUp', key: 16}, records)
    } else {
      callMain({type: 'keyDown', key: keyCode(c)}, records)
      callMain({type: 'keyUp', key: keyCode(c)}, records)
    }
  }

  function callMain() {
    result = app.main.apply(null, arguments)
    if (result) {
      onScreen = (result.screen || result).slice(0, 32)
    }
  }

  function getScreen() {
    return onScreen
  }
}

function FakeRecords() {
  return {
    read: read
  }

  function read() {
    return ''
  }
}

function keyCode(c) {
  for (var code in CHARS_BY_CODE) {
    if (CHARS_BY_CODE.hasOwnProperty(code)) {
      if (   c === CHARS_BY_CODE[code][0]
          || c === CHARS_BY_CODE[code][1]) {

        return code
      }
    }
  }
}

function needsShift(c) {
  for (var code in CHARS_BY_CODE) {
    if (CHARS_BY_CODE.hasOwnProperty(code)) {
      if (c === CHARS_BY_CODE[code][0]) {
        return false
      }
      if (c === CHARS_BY_CODE[code][1]) {
        return true
      }
    }
  }
  return false
}
