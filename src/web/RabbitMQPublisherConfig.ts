/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ICON, KIND_EXCHANGE, KIND_PUBLISHER } from './types';
import { createValidator, getDefinition, renameEntityReferences, resolveEntities } from './utils';
import { IResourceTypeProvider, ResourceRole, ResourceProviderType } from '@kapeta/ui-web-types';
import { Metadata } from '@kapeta/schemas';
import { DSLData } from '@kapeta/kaplang-core';
import { RabbitMQPublisherEditor } from './components/RabbitMQPublisherEditor';

import { RabbitMQPublisherSpec } from '@kapeta/sdk-rabbitmq';

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
    definition: getDefinition(KIND_PUBLISHER),
    capabilities: {
        directDSL: true,
    },
};

export default RabbitMQPublisherConfig;
