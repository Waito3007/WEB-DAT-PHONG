// middlewares/checkRole.js
module.exports = function(requiredRoles) {
    return function(req, res, next) {
      const userRole = req.user.role; // Giả sử user đã được xác thực và role có trong req.user
  
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ msg: 'Bạn không có quyền thực hiện hành động này' });
      }
  
      next();
    };
  };
  