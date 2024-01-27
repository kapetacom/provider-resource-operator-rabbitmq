/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { Stack } from '@mui/material';
import { ResourceTypeProviderInspectorProps } from '@kapeta/ui-web-types';

export const RabbitMQConnectionInspector = (props: ResourceTypeProviderInspectorProps) => {
    return <Stack className={'rabbitmq-connection-inspector'}>Show queue stats and messages here</Stack>;
};
