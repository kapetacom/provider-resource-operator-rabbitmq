/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { ResourceTypeProviderEditorProps } from '@kapeta/ui-web-types';

import { Stack } from '@mui/material';
import { RabbitMQBaseEditor } from './RabbitMQBaseEditor';
import { FormField, FormFieldType, useFormContextField } from '@kapeta/ui-web-components';

export const RabbitMQQueueEditor = (props: ResourceTypeProviderEditorProps) => {
    const durableField = useFormContextField('spec.durable');
    const exclusiveField = useFormContextField('spec.exclusive');
    const autoDeleteField = useFormContextField('spec.autoDelete');

    return (
        <Stack className={'rabbitmq-queue-editor'} sx={{ height: '100%' }}>
            <RabbitMQBaseEditor {...props} />

            <FormField
                label="Durable"
                type={FormFieldType.CHECKBOX}
                disabled={exclusiveField.get(false) || autoDeleteField.get(false)}
                name={'spec.durable'}
                help={'If true, the queue will survive broker restarts.'}
            />

            <FormField
                label="Exclusive"
                disabled={durableField.get(false) || autoDeleteField.get(false)}
                type={FormFieldType.CHECKBOX}
                name={'spec.exclusive'}
                help={'If true, scopes the queue to the connection (defaults to false).'}
            />

            <FormField
                label="Auto-Delete"
                type={FormFieldType.CHECKBOX}
                disabled={durableField.get(false) || exclusiveField.get(false)}
                name={'spec.autoDelete'}
                help={'If true, the queue is deleted when all consumers are disconnected.'}
            />
        </Stack>
    );
};
