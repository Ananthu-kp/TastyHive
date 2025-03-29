import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const protect = async (req, res, next) => {
  let token;

  // Check both cookie and Authorization header
  token = req.cookies.jwt || 
         (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
           ? req.headers.authorization.split(' ')[1] 
           : null);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists
    req.user = await User.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;