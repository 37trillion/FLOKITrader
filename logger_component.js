function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function error(message) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`);
}

module.exports = {
  log,
  error,
};
