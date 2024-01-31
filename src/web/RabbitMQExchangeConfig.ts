/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ICON, KIND_EXCHANGE, KIND_PUBLISHER } from './types';
import { createValidator, renameEntityReferences, resolveEntities } from './utils';
import { IResourceTypeProvider, ResourceProviderType, ResourceRole, ResourceWithSpec } from '@kapeta/ui-web-types';
import { EntityType, Metadata } from '@kapeta/schemas';
import { DSLData } from '@kapeta/kaplang-core';
import { RabbitMQExchangeEditor } from './components/RabbitMQExchangeEditor';
import { RabbitMQConnectionInspector } from './components/RabbitMQConnectionInspector';
import { cloneDeep } from 'lodash';

import { RabbitMQBaseSpec, RabbitMQExchangeResource, RabbitMQPublisherResource } from '@kapeta/sdk-rabbitmq';

const packageJson: any = require('../../package.json');

export const RabbitMQExchangeConfig: IResourceTypeProvider<Metadata, RabbitMQBaseSpec, DSLData> = {
    kind: KIND_EXCHANGE,
    version: packageJson.version,
    title: 'Exchange',
    icon: ICON,
    role: ResourceRole.CONSUMES,
    type: ResourceProviderType.INTERNAL,
    editorComponent: RabbitMQExchangeEditor,
    renameEntityReferences,
    resolveEntities,
    validate: createValidator(true),
    converters: [
        {
            fromKind: KIND_PUBLISHER,
            inspectComponentType: RabbitMQConnectionInspector,
            createFrom: (data: ResourceWithSpec<RabbitMQBaseSpec>): ResourceWithSpec<RabbitMQBaseSpec> => {
                const publisherResource = data as RabbitMQPublisherResource;
                if (!publisherResource.kind || !publisherResource.kind?.startsWith(KIND_EXCHANGE)) {
                    throw new Error(`Invalid resource kind: ${publisherResource.kind}. Expected ${KIND_EXCHANGE}`);
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
                    kind: publisherResource.kind,
                    metadata: cloneDeep(publisherResource.metadata),
                    spec: {
                        payloadType: cloneDeep(publisherSpec.payloadType),
                        port: cloneDeep(publisherSpec.port),
                        // @ts-ignore
                        exchangeType: 'fanout',
                    },
                } satisfies RabbitMQExchangeResource;
            },
        },
    ],
    definition: {
        kind: 'core/resource-type-internal',
        metadata: {
            name: KIND_EXCHANGE,
            title: 'RabbitMQ Exchange',
            description: 'Add an exchange to RabbitMQ',
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

export default RabbitMQExchangeConfig;
