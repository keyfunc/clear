import { generateAPI } from "./dist/index.js";

const docUrl = "https://petstore.swagger.io/v2/swagger.json";
// const docUrl = "https://keyfunc.top:8080/swagger/doc.json";
const requestLibPath = "import request from '@/utils/http'";
const outDir = "";

generateAPI({ docUrl, requestLibPath, outDir });
