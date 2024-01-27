/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { ResourceWithSpec } from '@kapeta/ui-web-types';
import { Entity, EntityList, IconType, IconValue, Metadata } from '@kapeta/schemas';

export const KIND_PUBLISHER = 'kapeta/resource-type-rabbitmq-publisher';
export const KIND_SUBSCRIBER = 'kapeta/resource-type-rabbitmq-subscriber';
export const KIND_EXCHANGE = 'kapeta/resource-type-rabbitmq-exchange';
export const KIND_QUEUE = 'kapeta/resource-type-rabbitmq-queue';
export const KIND_BLOCK = 'kapeta/block-type-rabbitmq';

export const ICON: IconValue = {
    type: IconType.URL,
    value: 'https://storage.googleapis.com/kapeta-public-cdn/icons/rabbitmq.svg',
};

export interface PayloadType {
    type: string;
    structure: Entity;
}

export interface RabbitMQBaseSpec {
    port: {
        type: 'amqp';
    };
    payloadType: PayloadType;
}

export interface RabbitMQSubscriberSpec extends RabbitMQBaseSpec {}

export interface RabbitMQPublisherSpec extends RabbitMQBaseSpec {}

export interface RabbitMQExchangeSpec extends RabbitMQBaseSpec {
    exchangeType: 'direct' | 'fanout' | 'topic' | 'headers';
}

export interface RabbitMQQueueSpec extends RabbitMQBaseSpec {}

export interface RabbitMQBlockSpec {
    entities: EntityList;
    consumers: RabbitMQExchangeResource[];
    publishers: RabbitMQQueueResource[];
}

export interface RabbitMQBlockDefinition {
    kind: typeof KIND_BLOCK;
    metadata: Metadata;
    spec: RabbitMQBlockSpec;
}

export interface RabbitMQSubscriberResource extends ResourceWithSpec<RabbitMQSubscriberSpec> {
    kind: typeof KIND_SUBSCRIBER;
}

export interface RabbitMQPublisherResource extends ResourceWithSpec<RabbitMQPublisherSpec> {
    kind: typeof KIND_PUBLISHER;
}

export interface RabbitMQExchangeResource extends ResourceWithSpec<RabbitMQExchangeSpec> {
    kind: typeof KIND_EXCHANGE;
}

export interface RabbitMQQueueResource extends ResourceWithSpec<RabbitMQQueueSpec> {
    kind: typeof KIND_QUEUE;
}
