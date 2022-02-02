import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { PROJECT_DOMAIN, ENVIRONMENT, PROJECT_NAME, PROJECT_PROTOTYPE, INTERNAL_API_URL } from 'config/Configuration';
import { OpenAPIObject } from 'openapi3-ts';
import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { COMPONENT_SCHEMA_PATH } from 'shared/decorators/RefSchema';
import { HttpHeaderKey } from 'shared/types/Common';
import { ApiService } from './ApiService';

/**
 * Get API specs
 */
export function getApiSpecs(): OpenAPIObject {
    const options = ApiService.getRoutingOptions();
    createExpressServer(options);

    const schemas = validationMetadatasToSchemas({
        refPointerPrefix: COMPONENT_SCHEMA_PATH
    });
    const storage = getMetadataArgsStorage();

    return routingControllersToSpec(storage, options, {
        info: {
            title: `${PROJECT_NAME} API For Internal System`,
            description: 'Developed by felix.le.236@gmail.com',
            version: '1.0.0',
            contact: {
                name: 'Felix Lee',
                email: 'felix.le.236@gmail.com',
                url: `${PROJECT_PROTOTYPE}://${PROJECT_DOMAIN}`
            }
        },
        servers: [{
            url: INTERNAL_API_URL,
            description: ENVIRONMENT
        }],
        security: [{
            privateKey: []
        }],
        components: {
            schemas,
            securitySchemes: {
                privateKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: HttpHeaderKey.PrivateKey
                }
            }
        }
    }) as OpenAPIObject;
}
