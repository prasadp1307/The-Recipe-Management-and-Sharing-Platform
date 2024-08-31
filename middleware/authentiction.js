// const authenticate = async (req, res, next) => {
//   try {
//       const authHeader = req.header('Authorization');
//       if (!authHeader) {
//           return res.status(401).json({ message: 'Authentication token missing' });
//       }
      
//       const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
//       const userDetails = jwt.verify(token, process.env.JSW_TOKEN_SECRETKEY);
//       const user = await User.findByPk(userDetails.userId);

//       if (!user) {
//           return res.status(401).json({ message: 'User not found' });
//       }

//       req.user = user;
//       console.log("Authenticated User:", req.user.id); 
//       next();
//   } catch (err) {
//       console.log(err);
//       res.status(401).json({ message: 'Authentication failed: Invalid token' });
//   }
// };

// module.exports = authenticate;
const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    // Extract token from the 'Authorization' header
    const authHeader = req.headers['authorization']; // Use lowercase for header name

    // Check if the 'Authorization' header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token missing or malformed' });
    }

    // Extract token from the header (after 'Bearer ')
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.JSW_TOKEN_SECRETKEY, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err); // Log error for debugging
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Set decoded token data to req.user
        req.user = decoded;

        console.log('User authenticated:', req.user); // Debugging output

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = authentication;
