/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { KIND_SUBSCRIBER, KIND_QUEUE, ICON } from './types';
import { createValidator, getDefinition, renameEntityReferences, resolveEntities } from './utils';
import { IResourceTypeProvider, ResourceRole, ResourceProviderType } from '@kapeta/ui-web-types';
import { Metadata } from '@kapeta/schemas';
import { DSLData } from '@kapeta/kaplang-core';
import { RabbitMQQueueEditor } from './components/RabbitMQQueueEditor';

import { RabbitMQPublisherSpec } from '@kapeta/sdk-rabbitmq';

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
    definition: getDefinition(KIND_QUEUE),
    capabilities: {
        directDSL: true,
    },
};

export default RabbitMQQueueConfig;
