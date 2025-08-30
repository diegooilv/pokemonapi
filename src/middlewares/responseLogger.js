export const responseLogger = (req, res, next) => {
  const start = process.hrtime();

  let originalSend = res.send;
  let responseBody;

  res.send = function (body) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
    const sizeInBytes = responseBody ? Buffer.byteLength(responseBody, "utf8") : 0;

    setImmediate(() => {
      console.log(
        `${req.method} ${req.originalUrl} - ${res.statusCode} - ${timeInMs.toFixed(
          2
        )} ms - ${sizeInBytes} bytes - query: ${JSON.stringify(req.query)}`
      );
    });
  });

  next();
};
