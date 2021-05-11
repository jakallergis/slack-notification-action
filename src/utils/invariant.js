module.exports = function invariant(condition, message, ...args) {
  if (!condition) {
    let error
    if (message === undefined) {
      error = new Error(
        "Minified exception occurred; use the non-minified dev environment " +
          "for the full error message and additional helpful warnings"
      )
    } else {
      let argIndex = 0
      error = new Error(message.replace(/%s/g, () => args[argIndex++]))
      error.name = "Internal App issue"
    }

    error.framesToPop = 1 // we don't care about invariant's own frame
    throw error
  }
}
