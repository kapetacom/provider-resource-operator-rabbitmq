/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import {ICON, KIND_EXCHANGE, KIND_PUBLISHER, RabbitMQPublisherSpec} from './types';
import { createValidator, renameEntityReferences, resolveEntities } from './utils';
import { IResourceTypeProvider, ResourceRole, ResourceProviderType } from '@kapeta/ui-web-types';
import { Metadata } from '@kapeta/schemas';
import { DSLData } from '@kapeta/kaplang-core';
import { RabbitMQPublisherEditor } from './components/RabbitMQPublisherEditor';

const packageJson: any = require('../../package.json');

export const RabbitMQPublisherConfig: IResourceTypeProvider<Metadata, RabbitMQPublisherSpec, DSLData> = {
    kind: KIND_PUBLISHER,
    version: packageJson.version,
    title: 'Publisher',
    icon: ICON,
    role: ResourceRole.PROVIDES,
    type: ResourceProviderType.INTERNAL,
    editorComponent: RabbitMQPublisherEditor,
    consumableKind: KIND_EXCHANGE,
    renameEntityReferences,
    resolveEntities,
    validate: createValidator(false),
    definition: {
        kind: 'core/resource-type-internal',
        metadata: {
            name: KIND_PUBLISHER,
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

export default RabbitMQPublisherConfig;
