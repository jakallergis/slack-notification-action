const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');
const invariant = require('./utils/invariant');
const fieldsToSection = require('./utils/fieldsToSection');

async function main() {
  const postMessage = 'https://slack.com/api/chat.postMessage';
  const updateMessage = 'https://slack.com/api/chat.update';
  const method = 'POST';
  const headers = new fetch.Headers();

  const message_id = core.getInput('slack-message-id');
  const url = message_id ? updateMessage : postMessage;

  headers.set('Content-Type', 'application/json');
  const token = core.getInput('slack-token');
  invariant(token, 'Slack token not found');
  headers.set('Authorization', `Bearer ${ token }`);

  const channel = core.getInput('slack-channel');
  invariant(token, 'Slack channel not found');

  const title = core.getInput('slack-title');
  const message = core.getInput('slack-message');
  invariant(message, 'Slack message not found');

  let fieldsSection;
  const messageFields = core.getInput('slack-message-fields');
  if (messageFields) {
    try {
      const parsedFields = JSON.parse(messageFields);
      fieldsSection = fieldsToSection(parsedFields, 'section');
    } catch (e) {
      console.log(`[ERROR] Failed to construct message fields: ${ e.message }`);
    }
  }

  const footerMessage = core.getInput('slack-footer');
  const footer = footerMessage
    ? { type: 'context', elements: [{ type: 'mrkdwn', text: footerMessage }] }
    : undefined;

  const color = core.getInput('slack-message-color');
  const attachments = footer
    ? [{ color, blocks: [{ type: 'divider' }, footer] }]
    : undefined;

  const payload = {
    channel,
    text: message,
    attachments,
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
      fieldsSection
    ]
  };

  if (message_id) payload.ts = message_id

  const body = JSON.stringify(payload);
  const result = await fetch(url, { method, headers, body });
  const json = await result.json();
  const success = json.ok === true;
  const messageID = json.ts;

  core.setOutput('success', success);
  core.setOutput('message_id', messageID);

  console.log({
    url,
    message_id,
    messageID,
    result: json
  })
}

main().catch(e => core.setFailed(e.message));
