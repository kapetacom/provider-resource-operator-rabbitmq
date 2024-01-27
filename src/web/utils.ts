/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import { RabbitMQBaseSpec, RabbitMQExchangeSpec } from './types';
import { ResourceWithSpec } from '@kapeta/ui-web-types';

export function validateName(fieldName: string, name: string) {
    if (!name) {
        return;
    }

    if (!/^[a-zA-Z_][a-zA-Z\d_]*$/.test(name)) {
        throw new Error('Invalid API name');
    }
}

export function validateRoutingKey(fieldName: string, name: string) {
    if (!name) {
        return;
    }

    if (!/^[a-zA-Z-_#*][a-zA-Z\d-_#*]*(\.[a-zA-Z\d-_#*]+)*$/.test(name)) {
        throw new Error('Invalid routing key');
    }
}

export function validateHeaderName(fieldName: string, name: string) {
    if (!name) {
        return;
    }

    if (!/^[a-zA-Z-_:][a-zA-Z\d-_:]*$/.test(name)) {
        throw new Error('Invalid header name');
    }
}

export function renameEntityReferences(resource: ResourceWithSpec<RabbitMQBaseSpec>, oldName: string, newName: string) {
    if (resource.spec.payloadType.type === oldName) {
        resource.spec.payloadType.type = newName;
    }
}

export function resolveEntities(resource: ResourceWithSpec<RabbitMQBaseSpec>): string[] {
    return [resource.spec.payloadType.type];
}

export const createValidator = (exchange: boolean = false) => {
    return (context: ResourceWithSpec<RabbitMQBaseSpec>): string[] => {
        const errors: string[] = [];

        if (!context.spec?.payloadType?.type) {
            errors.push('Missing payload type');
            return errors;
        }

        if (exchange) {
            const spec = context.spec as RabbitMQExchangeSpec;
            if (!spec?.exchangeType) {
                errors.push('Missing exchange type');
                return errors;
            }
        }

        return errors;
    };
};
