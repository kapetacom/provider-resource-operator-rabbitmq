/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { ResourceTypeProviderEditorProps } from '@kapeta/ui-web-types';

import { Stack } from '@mui/material';
import { RabbitMQBaseEditor } from './RabbitMQBaseEditor';
import { FormField, FormFieldType } from '@kapeta/ui-web-components';

export const RabbitMQExchangeEditor = (props: ResourceTypeProviderEditorProps) => {
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
        </Stack>
    );
};
