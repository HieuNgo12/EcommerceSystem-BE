const productController = {
    getProduct: (req, res, next) => {
      const isAuthenticated = true; // Kiểm tra xem người dùng đã được xác thực hay chưa
      if (isAuthenticated) {
        // Người dùng đã được xác thực, cho phép truy cập
        next();
      } else {
        res.status(401).send("Unauthorized"); // Trả về lỗi 401 nếu không được xác thực
      }
    },
    postProduct: (req, res, next) => {
      const userRole = "admin"; // Vai trò của người dùng (ví dụ: admin hoặc user)
      if (userRole === "admin") {
        next(); // Cho phép truy cập vào route
      } else {
        res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
      }
    },
    updateUser: (req, res, next) => {
      const userRole = "admin"; // Vai trò của người dùng (ví dụ: admin hoặc user)
      if (userRole === "admin") {
        next(); // Cho phép truy cập vào route
      } else {
        res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
      }
    },
    deleteUser: (req, res, next) => {
      const userRole = "admin"; // Vai trò của người dùng (ví dụ: admin hoặc user)
      if (userRole === "admin") {
        next(); // Cho phép truy cập vào route
      } else {
        res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
      }
    },
  };
  export default productController;
  