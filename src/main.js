var minmus

function main(event, records) {
  if (!minmus) minmus = Minmus()
  return minmus.main(event, records)
}
