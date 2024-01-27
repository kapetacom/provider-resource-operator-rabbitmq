/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { RabbitMQExchangeResource, RabbitMQQueueResource } from '../types';
import { Stack } from '@mui/material';
import { FormField, FormFieldType } from '@kapeta/ui-web-components';
import { validateRoutingKey } from '../utils';
import { HeaderObjectEditor } from './HeaderEditor';
import { DSLData } from '@kapeta/kaplang-core';

type RabbitMQBindingEditorProps = {
    exchange: RabbitMQExchangeResource;
    queue: RabbitMQQueueResource;
    onDataChanged?: (change: any) => void;
    entities: DSLData[];
};

const RabbitMQBindingEditorInner = (props: RabbitMQBindingEditorProps) => {
    switch (props.exchange.exchangeType) {
        case 'direct':
            return <>Will automatically deliver all messages to at least 1 subscriber</>;
        case 'fanout':
            return <>Will automatically deliver all messages to all subscribers</>;
        case 'topic':
            return (
                <>
                    <FormField
                        name={'routing'}
                        validation={['required', validateRoutingKey]}
                        label={'Routing Key'}
                        help={
                            'Determines routing key. Use # to match zero or more words and * to match exactly one word. Use . to separate words'
                        }
                    />
                </>
            );
        case 'headers':
            return (
                <>
                    <FormField
                        name={'routing.matchAll'}
                        label={'Match all'}
                        type={FormFieldType.CHECKBOX}
                        help={'If checked all headers must match. If unchecked any match will do.'}
                    />
                    <HeaderObjectEditor name={'routing.headers'} />
                </>
            );
    }

    return <></>;
};

export const RabbitMQBindingEditor = (props: RabbitMQBindingEditorProps) => {
    return (
        <Stack className={'rabbitmq-connection-editor'} gap={1}>
            <RabbitMQBindingEditorInner {...props} />
        </Stack>
    );
};
