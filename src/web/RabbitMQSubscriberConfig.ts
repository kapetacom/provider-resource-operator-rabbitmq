/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import _, { cloneDeep } from 'lodash';
import {
    KIND_SUBSCRIBER,
    RabbitMQBaseSpec,
    RabbitMQSubscriberResource,
    RabbitMQPublisherResource,
    KIND_QUEUE,
    ICON,
} from './types';

import { IResourceTypeProvider, ResourceProviderType, ResourceRole, ResourceWithSpec } from '@kapeta/ui-web-types';

import { EntityType, Metadata } from '@kapeta/schemas';
import { createValidator, renameEntityReferences, resolveEntities } from './utils';
import { RabbitMQSubscriberEditor } from './components/RabbitMQSubscriberEditor';
import { RabbitMQConnectionInspector } from './components/RabbitMQConnectionInspector';
import { DSLData } from '@kapeta/kaplang-core';

const packageJson: any = require('../../package.json');

const RabbitMQSubscriberConfig: IResourceTypeProvider<Metadata, RabbitMQBaseSpec, DSLData> = {
    kind: KIND_SUBSCRIBER,
    version: packageJson.version,
    title: 'Consumer',
    icon: ICON,
    role: ResourceRole.CONSUMES,
    type: ResourceProviderType.INTERNAL,
    editorComponent: RabbitMQSubscriberEditor,
    converters: [
        {
            fromKind: KIND_QUEUE,
            inspectComponentType: RabbitMQConnectionInspector,
            createFrom: (data: ResourceWithSpec<RabbitMQBaseSpec>): ResourceWithSpec<RabbitMQBaseSpec> => {
                const publisherResource = data as RabbitMQPublisherResource;
                if (!publisherResource.kind || !publisherResource.kind?.startsWith(KIND_SUBSCRIBER)) {
                    throw new Error(`Invalid resource kind: ${publisherResource.kind}. Expected ${KIND_SUBSCRIBER}`);
                }

                const publisherSpec = publisherResource.spec ?? {
                    port: {
                        type: 'amqp',
                    },
                    payloadType: {
                        type: 'object',
                        structure: {
                            type: EntityType.Dto,
                            name: 'Payload',
                            properties: {},
                        },
                    },
                    exchangeType: 'fanout',
                };

                return {
                    kind: KIND_SUBSCRIBER,
                    metadata: cloneDeep(publisherResource.metadata),
                    spec: {
                        payloadType: cloneDeep(publisherSpec.payloadType),
                        port: cloneDeep(publisherSpec.port),
                    },
                } satisfies RabbitMQSubscriberResource;
            },
        },
    ],
    renameEntityReferences,
    resolveEntities,
    validate: createValidator(false),
    definition: {
        kind: 'core/resource-type-internal',
        metadata: {
            name: KIND_SUBSCRIBER,
            title: 'RabbitMQ Subscriber',
            description: 'Add a rabbitmq subscriber to your block',
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

export default RabbitMQSubscriberConfig;
