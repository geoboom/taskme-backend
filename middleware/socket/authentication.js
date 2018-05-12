const {
  validateToken,
  registerPresence,
} = require('../../services/connect');

exports.authenticationMiddleware = async (socket, next) => {
  const { tok } = socket.handshake.query;

  try {
    const payload = await validateToken(tok);
    if (!payload) {
      next(new Error('session.authenticationFailed'));
      return;
    }

    const { userId } = JSON.parse(payload);
    socket.userId = userId;
    if (!await registerPresence(socket)) {
      next(new Error('session.alreadyActive'));
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
};
