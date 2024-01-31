/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { IconType, IconValue } from '@kapeta/schemas';

export const KIND_PUBLISHER = 'kapeta/resource-type-rabbitmq-publisher';
export const KIND_SUBSCRIBER = 'kapeta/resource-type-rabbitmq-subscriber';
export const KIND_EXCHANGE = 'kapeta/resource-type-rabbitmq-exchange';
export const KIND_QUEUE = 'kapeta/resource-type-rabbitmq-queue';
export const KIND_BLOCK = 'kapeta/block-type-rabbitmq';

export const ICON: IconValue = {
    type: IconType.URL,
    value: 'https://storage.googleapis.com/kapeta-public-cdn/icons/rabbitmq.svg',
};
