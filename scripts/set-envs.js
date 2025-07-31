const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

const TEMPLATE_PATH = path.join(".env.yaml");
const ENV_DIR = path.join("src", "environments");

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error("❌ No se encontró el archivo env.template.yaml");
  process.exit(1);
}

const { environments = [], variables = {} } = yaml.load(
  fs.readFileSync(TEMPLATE_PATH, "utf8")
);

const hasVars = Object.keys(variables).length > 0;
if (!hasVars) {
  console.log(
    "⚠️ No hay variables definidas en el YAML. Solo se creó environment.ts"
  );
  process.exit(0);
}

fs.mkdirSync(ENV_DIR, { recursive: true });

const basePath = path.join(ENV_DIR, "environment.ts");
fs.writeFileSync(
  basePath,
  `export const environment = ${JSON.stringify(variables, null, 2)};\n`
);
console.log(`✅ environment.ts base creado.`);

environments.forEach((env) => {
  const fileName = `environment.${env}.ts`;
  const filePath = path.join(ENV_DIR, fileName);
  const content = `export const environment = ${JSON.stringify(
    variables,
    null,
    2
  )};\n`;
  fs.writeFileSync(filePath, content);
  console.log(`✅ Archivo generado: ${fileName}`);
});

try {
  execSync("npx ng generate environments --dry-run", { stdio: "inherit" });
  console.log(
    "✅ ng generate environments ejecutado en modo dry-run (sin sobrescribir)"
  );
} catch (e) {
  console.warn(
    '⚠️ No se pudo ejecutar "ng generate environments --dry-run". Asegúrate de tener Angular CLI instalado.'
  );
}
