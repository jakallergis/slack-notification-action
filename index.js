const core = require("@actions/core")
const github = require("@actions/github")

try {
  const token = core.getInput("slack-token")
  const channel = core.getInput("slack-channel")
  const title = core.getInput("slack-title")
  const message = core.getInput("slack-message")
  const messageFields = core.getInput("slack-message-fields")
  const footerFields = core.getInput("slack-footer-fields")
  const username = core.getInput("slack-username")
  const actor = core.getInput("slack-actor")
  const icon = core.getInput("slack-icon")
  const messageColor = core.getInput("slack-message-color")
  const payload = JSON.stringify(github.context.payload, null, 2)
  console.log({
    token,
    channel,
    title,
    message,
    messageFields,
    footerFields,
    username,
    actor,
    icon,
    messageColor,
    payload,
  })
  core.setOutput("yo", 2)
} catch (e) {
  core.setFailed(e.message)
}
