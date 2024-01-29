/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React from 'react';

import {ResourceTypeProviderEditorProps} from '@kapeta/ui-web-types';

import {Alert, Box, Link, Stack, Typography} from '@mui/material';
import {RabbitMQBaseEditor} from './RabbitMQBaseEditor';
import {RoutingKeysListField} from "./RoutingKeysListField";
import {HeaderOptionsField} from "./HeaderOptionsField";
import {grey} from "@mui/material/colors";

export const RabbitMQPublisherEditor = (props: ResourceTypeProviderEditorProps) => {

    return (
        <Stack className={'rabbitmq-publisher-editor'} sx={{height: '100%'}}>
            <RabbitMQBaseEditor {...props} />

            <Box sx={{
                p:2,
                borderColor: grey[200],
                borderWidth: '1px',
                borderStyle: 'solid',
            }}>
                <Typography variant={'h6'}>Routing</Typography>
                <Alert severity={'info'}>
                    Define routing keys and headers to be used when publishing messages. <br/>

                    Read more about <Link href={'https://www.cloudamqp.com/blog/part4-rabbitmq-for-beginners-exchanges-routing-keys-bindings.html'}
                                       target={'_blank'}>routing in RabbitMQ here</Link>.
                </Alert>

                <RoutingKeysListField name={'spec.routeKeys'} />

                <HeaderOptionsField name={'spec.headers'} />
            </Box>

        </Stack>
    );
};
