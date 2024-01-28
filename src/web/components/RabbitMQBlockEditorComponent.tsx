/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { InfoBox } from '@kapeta/ui-web-components';

import { BlockTypeEditorProps } from '@kapeta/ui-web-types';

import { RabbitMQBlockDefinition } from '../types';
import { RabbitMQBindingEditor } from './RabbitMQBindingEditor';

export const RabbitMQBlockEditorComponent = (props: BlockTypeEditorProps<RabbitMQBlockDefinition>) => {
    if (props.creating) {
        // No need to show the editor when creating a new block - we need resources first
        return null;
    }

    return (
        <div>
            <InfoBox>RabbitMQ Server for sending async messages between your services</InfoBox>
            <RabbitMQBindingEditor
                exchanges={props.block.spec?.consumers ?? []}
                queues={props.block.spec?.providers ?? []}
                entities={props.block.spec?.entities?.types ?? []}
            />
        </div>
    );
};
