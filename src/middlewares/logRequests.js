import chalk from "chalk";

export const logRequests = (req, res, next) => {
  const start = process.hrtime.bigint();
  const time = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const { heapUsed, rss } = process.memoryUsage();
    const status = res.statusCode;

    let statusColored = status;
    if (status >= 200 && status < 300) statusColored = chalk.green(status);
    else if (status === 304) statusColored = chalk.yellow(status);
    else if (status >= 400) statusColored = chalk.red(status);

    console.log(
      `[${time}] ${method} ${url} | Status: ${statusColored} | ` +
      `Duração: ${durationMs.toFixed(2)} ms | ` +
      `HeapUsed: ${(heapUsed / 1024 / 1024).toFixed(2)} MB / RSS: ${(rss / 1024 / 1024).toFixed(2)} MB`
    );
  });

  next();
};
