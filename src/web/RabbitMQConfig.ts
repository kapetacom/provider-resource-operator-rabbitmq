/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { IBlockTypeProvider } from '@kapeta/ui-web-types';
import { ICON, KIND_BLOCK, KIND_EXCHANGE, KIND_QUEUE, RabbitMQBlockDefinition } from './types';
import { RabbitMQBlockConfigComponent } from './components/RabbitMQBlockConfigComponent';
import { RabbitMQBlockEditorComponent } from './components/RabbitMQBlockEditorComponent';

const packageJson = require('../../package.json');

const blockTypeProvider: IBlockTypeProvider<RabbitMQBlockDefinition> = {
    kind: KIND_BLOCK,
    version: packageJson.version,
    title: 'RabbitMQ',
    icon: ICON,
    editorComponent: RabbitMQBlockEditorComponent,
    configComponent: RabbitMQBlockConfigComponent,
    resourceKinds: [KIND_EXCHANGE, KIND_QUEUE],
    createDefaultConfig: (block: RabbitMQBlockDefinition) => {
        return {};
    },
    definition: {
        kind: KIND_BLOCK,
        metadata: {
            name: KIND_BLOCK,
            title: 'RabbitMQ',
            description: 'Provides a RabbitMQ server to your plan',
        },
        spec: {
            consumers: [],
            icon: ICON,
            schema: {
                type: 'object',
                properties: {
                    icon: {
                        $ref: '/core/icon-value',
                    },
                    entities: {
                        $ref: '/core/entity-list',
                    },
                    consumers: {
                        $ref: '/core/block-resource-list',
                    },
                    providers: {
                        $ref: '/core/block-resource-list',
                    },
                },
            },
            defaultPort: {
                type: 'amqp',
            },
        },
    },
};

export default blockTypeProvider;
