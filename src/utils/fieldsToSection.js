module.exports = function fieldsToSection(fields, type) {
  if (!fields) return;

  const fieldsArray = [];
  const keys = Object.keys(fields);
  keys.forEach(k => fields[k] != null && fieldsArray.push(`*${ k }:* ${ fields[k] }`));

  if (fieldsArray.length) {
    const fieldsKey = type === 'section' ? 'fields' : 'elements';
    const fieldsValue = fieldsArray.map(text => ({ type: 'mrkdwn', text }));
    return { type, [fieldsKey]: fieldsValue };
  }
}
