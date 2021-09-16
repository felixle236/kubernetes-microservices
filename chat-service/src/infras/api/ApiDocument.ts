import { API_PORT, PROJECT_NAME } from '@configs/Configuration';
import { COMPONENT_SCHEMA_PATH } from '@shared/decorators/RefSchema';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { OpenAPIObject } from 'openapi3-ts';
import { getMetadataArgsStorage, RoutingControllersOptions } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

export class ApiDocument {
    static generate(options: RoutingControllersOptions): OpenAPIObject {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: COMPONENT_SCHEMA_PATH
        });
        const storage = getMetadataArgsStorage();

        return routingControllersToSpec(storage, options, {
            info: {
                title: `${PROJECT_NAME} API`,
                description: 'Developed by felix.le.236@gmail.com',
                version: '1.0.0',
                contact: {
                    name: 'Felix Le',
                    email: 'felix.le.236@gmail.com'
                }
            },
            servers: [{
                url: `http://localhost:${API_PORT}`,
                description: 'Localhost'
            }, {
                url: 'https://dev.domain',
                description: 'Development Environment'
            }, {
                url: 'https://stag.domain',
                description: 'Staging Environment'
            }, {
                url: 'https://domain',
                description: 'Production Environment'
            }],
            security: [{
                bearerAuth: []
            }],
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }) as OpenAPIObject;
    }
}