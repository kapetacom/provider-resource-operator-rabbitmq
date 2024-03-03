/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { IBlockTypeProvider } from '@kapeta/ui-web-types';
import { ICON, KIND_BLOCK, KIND_EXCHANGE, KIND_QUEUE } from './types';
import { RabbitMQBlockEditorComponent } from './components/RabbitMQBlockEditorComponent';
import { EntityHelpers } from '@kapeta/ui-web-components';
import { RabbitMQBlockDefinition, RabbitMQExchangeResource, RabbitMQQueueResource } from '@kapeta/sdk-rabbitmq';
import {getDefinition} from "./utils";
import {QueueBlockShapeComponent} from "./QueueBlockShapeComponent";

const packageJson = require('../../package.json');

const blockTypeProvider: IBlockTypeProvider<RabbitMQBlockDefinition> = {
    kind: KIND_BLOCK,
    version: packageJson.version,
    title: 'RabbitMQ',
    icon: ICON,
    editorComponent: RabbitMQBlockEditorComponent,
    shapeWidth: 196,
    getShapeHeight: (resourceHeight: number) =>
        Math.max(140, resourceHeight + 50),
    shapeComponent: QueueBlockShapeComponent,
    resourceKinds: [KIND_EXCHANGE, KIND_QUEUE],
    validate: (block: RabbitMQBlockDefinition) => {
        const errors: string[] = [];

        const hasInvalidBindings =
            block.spec?.bindings?.exchanges?.some((exchangeBinding) => {
                return exchangeBinding.bindings?.some((binding) => {
                    let data: RabbitMQExchangeResource | RabbitMQQueueResource | undefined;
                    if (binding.type === 'exchange') {
                        data = block.spec.consumers?.find((consumer) => consumer.metadata.name === binding.name);
                    } else {
                        data = block.spec.providers?.find((provider) => provider.metadata.name === binding.name);
                    }

                    const exchange = block.spec.consumers?.find(
                        (consumer) => consumer.metadata.name === exchangeBinding.exchange
                    );
                    if (!data?.spec?.payloadType?.structure || !exchange?.spec?.payloadType?.structure) {
                        return true;
                    }

                    return !EntityHelpers.isEntityCompatible(
                        data.spec.payloadType.structure,
                        exchange.spec.payloadType.structure,
                        block.spec.entities?.types ?? [],
                        block.spec.entities?.types ?? []
                    );
                });
            }) ?? false;

        if (hasInvalidBindings) {
            errors.push(
                `There are invalid bindings. All exchange data types must be compatible with the bound queue data types.`
            );
        }

        const unboundExchanges =
            block.spec?.consumers?.filter((consumer) => {
                return !block.spec?.bindings?.exchanges?.some((exchange) => {
                    return exchange.exchange === consumer.metadata.name;
                });
            }) ?? [];

        if (unboundExchanges.length > 0) {
            errors.push(
                `There are ${unboundExchanges.length} unbound exchanges. All exchanges must be bound to at least 1 queue or exchange.`
            );
        }

        const unboundQueues =
            block.spec?.providers?.filter((provider) => {
                return !block.spec.bindings?.exchanges?.some((exchange) => {
                    return exchange.bindings?.some((b) => b.type === 'queue' && b.name === provider.metadata.name);
                });
            }) ?? [];

        if (unboundQueues.length > 0) {
            errors.push(
                `There are ${unboundQueues.length} unbound queues. All queues must be bound to at least 1 exchange.`
            );
        }
        return errors;
    },
    definition: getDefinition(KIND_BLOCK)
};

export default blockTypeProvider;
