/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { KIND_SUBSCRIBER, RabbitMQPublisherSpec, KIND_QUEUE, ICON } from './types';
import { createValidator, renameEntityReferences, resolveEntities } from './utils';
import { IResourceTypeProvider, ResourceRole, ResourceProviderType } from '@kapeta/ui-web-types';
import { Metadata } from '@kapeta/schemas';
import { DSLData } from '@kapeta/kaplang-core';
import { RabbitMQQueueEditor } from './components/RabbitMQQueueEditor';

const packageJson: any = require('../../package.json');

export const RabbitMQQueueConfig: IResourceTypeProvider<Metadata, RabbitMQPublisherSpec, DSLData> = {
    kind: KIND_QUEUE,
    version: packageJson.version,
    title: 'Queue',
    icon: ICON,
    role: ResourceRole.PROVIDES,
    type: ResourceProviderType.INTERNAL,
    editorComponent: RabbitMQQueueEditor,
    consumableKind: KIND_SUBSCRIBER,
    renameEntityReferences,
    resolveEntities,
    validate: createValidator(false),
    definition: {
        kind: 'core/resource-type-internal',
        metadata: {
            name: KIND_QUEUE,
            title: 'RabbitMQ Publisher',
            description: 'Add a rabbitmq publisher to your block',
        },
        spec: {
            // @ts-ignore
            icon: ICON,
            ports: [
                {
                    name: 'amqp',
                    type: 'amqp',
                },
            ],
        },
    },
    capabilities: {
        directDSL: true,
    },
};

export default RabbitMQQueueConfig;
