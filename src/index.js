const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const invariant = require('./utils/invariant');
const fieldsToSection = require("./utils/fieldsToSection")

async function main() {
  const url = 'https://slack.com/api/chat.postMessage';
  const method = 'POST';
  const headers = new fetch.Headers();

  headers.set('Content-Type', 'application/json');
  const token = core.getInput('slack-token');
  invariant(token, 'Slack token not found');
  headers.set('Authorization', `Bearer ${ token }`);

  const channel = core.getInput('slack-channel');
  invariant(token, 'Slack channel not found');

  const title = core.getInput('slack-title');
  const message = core.getInput('slack-message');
  invariant(message, 'Slack message not found');

  let fieldsSection
  const messageFields = core.getInput('slack-message-fields');
  if (messageFields) {
    try {
      const parsedFields = JSON.parse(messageFields);
      fieldsSection = fieldsToSection(parsedFields, "section")
    } catch (e) {
      console.log(`[ERROR] Failed to construct message fields: ${ e.message }`);
    }
  }

  let fFieldsSection
  const footerFields = core.getInput('slack-footer-fields');
  if (footerFields) {
    try {
      const parsedFields = JSON.parse(footerFields);
      fFieldsSection = fieldsToSection(parsedFields, "context")
    } catch (e) {
      console.log(`[ERROR] Failed to construct footer fields: ${ e.message }`);
    }
  }

  const payload = {
    channel,
    text: message,
    blocks: [
      title && {
        type: 'header',
        text: {
          type: 'plain_text',
          text: title,
          emoji: true
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message
        }
      },
      fieldsSection,
      fieldsSection && fFieldsSection && { type: 'divider' },
      fFieldsSection
    ]
  };

  const body = JSON.stringify(payload)
  const result = await fetch(url, {method, headers, body})
  const json = await result.json()
  const success = json.ok === true

  console.log(`Success: ${success}`)

  // const username = core.getInput('slack-username');
  // const actor = core.getInput('slack-actor');
  // const icon = core.getInput('slack-icon');
  // const messageColor = core.getInput('slack-message-color');

  core.setOutput('success', success);
}

main().catch(e => core.setFailed(e.message))
