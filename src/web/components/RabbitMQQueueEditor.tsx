/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { ResourceTypeProviderEditorProps } from '@kapeta/ui-web-types';

import { Stack } from '@mui/material';
import { RabbitMQBaseEditor } from './RabbitMQBaseEditor';

export const RabbitMQQueueEditor = (props: ResourceTypeProviderEditorProps) => {
    return (
        <Stack className={'rabbitmq-queue-editor'} sx={{ height: '100%' }}>
            <RabbitMQBaseEditor {...props} />
        </Stack>
    );
};
