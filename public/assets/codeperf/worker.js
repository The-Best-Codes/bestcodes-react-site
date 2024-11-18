self.onmessage = function (e) {
  // Verify message origin
  const allowedOrigins = [
    location.origin, // Same origin as where the worker is hosted
  ];

  if (!allowedOrigins.includes(e.origin)) {
    console.error("Received message from untrusted origin:", e.origin);
    return;
  }

  const { code, runTime } = e.data;
  const start = performance.now();
  let iterations = 0;

  while (performance.now() - start < runTime) {
    try {
      new Function(code)();
      iterations++;
    } catch (error) {
      self.postMessage({ error: error.toString() });
      return;
    }
  }

  const end = performance.now();
  const timeElapsed = end - start;
  self.postMessage({ iterations, timeElapsed });
};
