export const logRequests = (req, res, next) => {
  const method = req.method;
  const url = req.url;
  const time = new Date().toISOString();

  console.log(`[${time}] ${method} ${url}`);
  next();
};