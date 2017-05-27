var minmus

function main(event) {
  if (!minmus) minmus = Minmus()
  return minmus.main(event)
}
