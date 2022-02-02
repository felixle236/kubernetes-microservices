/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { SWAGGER_UI_APIS } from 'config/Configuration';
import { writeFile } from 'utils/File';

if (!SWAGGER_UI_APIS || !SWAGGER_UI_APIS.length)
    throw new Error('Can not generate Api documents');

SWAGGER_UI_APIS.forEach(apiName => {
    const specs = require(`../../api/${apiName}/ApiDocument`).getApiSpecs();
    writeFile(path.join(__dirname, `./public/api-docs/${apiName}-api.json`), JSON.stringify(specs));
});
