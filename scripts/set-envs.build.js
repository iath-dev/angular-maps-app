const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

const TEMPLATE_PATH = path.join(".env.yaml");
const ENV_DIR = path.join("src", "environments");

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error("❌ No se encontró el archivo .env.yaml");
  process.exit(1);
}

const { variables = {} } = yaml.load(fs.readFileSync(TEMPLATE_PATH, "utf8"));

// Reemplaza ${VAR_NAME} por process.env.VAR_NAME
function resolveEnv(obj) {
  if (typeof obj === "string") {
    const match = obj.match(/^\$\{(.+)\}$/);
    if (match) {
      const envValue = process.env[match[1]];
      if (!envValue) {
        console.warn(`⚠️ Variable de entorno ${match[1]} no está definida`);
      }
      return envValue ?? null;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(resolveEnv);
  }

  if (typeof obj === "object" && obj !== null) {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = resolveEnv(v);
    }
    return result;
  }

  return obj;
}

const resolvedVars = resolveEnv(variables);

if (Object.keys(resolvedVars).length === 0) {
  console.log("⚠️ No hay variables resueltas. Se generará un archivo vacío.");
  process.exit(0);
}

fs.mkdirSync(ENV_DIR, { recursive: true });

const basePath = path.join(ENV_DIR, "environment.ts");
fs.writeFileSync(
  basePath,
  `export const environment = ${JSON.stringify(resolvedVars, null, 2)};\n`
);
