import { configureSync, getConsoleSink } from "@logtape/logtape";

const isProduction = import.meta.env.MODE === "production";

configureSync({
  sinks: {
    console: getConsoleSink(),
  },
  loggers: [
    { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["console"] },
    { category: [], lowestLevel: isProduction ? "warning" : "info", sinks: ["console"] },
  ],
});
