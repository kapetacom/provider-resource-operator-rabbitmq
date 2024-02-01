/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import _, { cloneDeep } from 'lodash';
import { KIND_SUBSCRIBER, KIND_QUEUE, ICON } from './types';

import { RabbitMQBaseSpec, RabbitMQSubscriberResource, RabbitMQPublisherResource } from '@kapeta/sdk-rabbitmq';

import { IResourceTypeProvider, ResourceProviderType, ResourceRole, ResourceWithSpec } from '@kapeta/ui-web-types';

import { EntityType, Metadata } from '@kapeta/schemas';
import { createValidator, renameEntityReferences, resolveEntities } from './utils';
import { RabbitMQSubscriberEditor } from './components/RabbitMQSubscriberEditor';
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
            createFrom: (data: ResourceWithSpec<RabbitMQBaseSpec>): ResourceWithSpec<RabbitMQBaseSpec> => {
                const queueResource = data as RabbitMQPublisherResource;
                if (!queueResource.kind || !queueResource.kind?.startsWith(KIND_SUBSCRIBER)) {
                    throw new Error(`Invalid resource kind: ${queueResource.kind}. Expected ${KIND_SUBSCRIBER}`);
                }

                const publisherSpec = queueResource.spec ?? {
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
                    kind: queueResource.kind,
                    metadata: cloneDeep(queueResource.metadata),
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
