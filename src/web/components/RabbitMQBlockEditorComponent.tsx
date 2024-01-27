/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import { FormAvatarEditorField, InfoBox } from '@kapeta/ui-web-components';

import { BlockTypeEditorProps } from '@kapeta/ui-web-types';

import { RabbitMQBlockDefinition } from '../types';

export const RabbitMQBlockEditorComponent = (props: BlockTypeEditorProps<RabbitMQBlockDefinition>) => {
    return (
        <div>
            <InfoBox>RabbitMQ Server for sending async messages between your services</InfoBox>
            <FormAvatarEditorField
                name={'spec.icon'}
                label={'Icon'}
                maxFileSize={1024 * 50}
                help={
                    'Select an icon for this block to make it easier to identify. Max 50 kb - and we recommend using a square SVG image.'
                }
                fallbackIcon={'kap-icon-block'}
            />
        </div>
    );
};
