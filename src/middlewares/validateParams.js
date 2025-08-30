export function validateParams(requiredParams) {
  return (req, res, next) => {
    const missing = requiredParams.filter((param) => !req.params[param]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Parâmetros obrigatórios ausentes: ${missing.join(", ")}`,
      });
    }

    requiredParams.forEach((param) => {
      req[param] = req.params[param];
    });

    next();
  };
}
