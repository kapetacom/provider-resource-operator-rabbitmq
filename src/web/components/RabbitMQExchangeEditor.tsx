/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { ResourceTypeProviderEditorProps } from '@kapeta/ui-web-types';

import { Stack } from '@mui/material';
import { RabbitMQBaseEditor } from './RabbitMQBaseEditor';
import { FormField, FormFieldType, useFormContextField } from '@kapeta/ui-web-components';

export const RabbitMQExchangeEditor = (props: ResourceTypeProviderEditorProps) => {
    const durableField = useFormContextField('spec.durable');
    const autoDeleteField = useFormContextField('spec.autoDelete');

    return (
        <Stack className={'rabbitmq-exchange-editor'} sx={{ height: '100%' }}>
            <RabbitMQBaseEditor {...props} />

            <FormField
                name={'spec.exchangeType'}
                type={FormFieldType.ENUM}
                validation={['required']}
                options={{
                    direct: 'Direct',
                    fanout: 'Fanout',
                    topic: 'Topic',
                    headers: 'Headers',
                }}
                help={'The RabbitMQ exchange type'}
            />

            <FormField
                label="Durable"
                type={FormFieldType.CHECKBOX}
                disabled={autoDeleteField.get(false)}
                name={'spec.durable'}
                help={'If true, the queue will survive broker restarts.'}
            />

            <FormField
                label="Auto-Delete"
                type={FormFieldType.CHECKBOX}
                disabled={durableField.get(false)}
                name={'spec.autoDelete'}
                help={'If true, the queue is deleted when all consumers are disconnected.'}
            />
        </Stack>
    );
};
