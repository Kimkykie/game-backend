const jwt_decode = require('jwt-decode');

const userId = async(req, res) => {
  const decodedToken = await jwt_decode(req.header('x-access-token'))
  const userId = decodedToken.id
  return userId
}

const getUser = {
  userId
};

module.exports = getUser