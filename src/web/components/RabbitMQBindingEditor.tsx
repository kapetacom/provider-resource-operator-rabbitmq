/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
    QueueRouting,
    RabbitMQBindingsSchema,
    RabbitMQExchangeResource,
    RabbitMQExchangeSpec,
    RabbitMQQueueResource,
} from '../types';
import { alpha, Box, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { ArrowRight, Clear } from '@mui/icons-material';
import { EntityHelpers, FormField, FormFieldType, useFormContextField } from '@kapeta/ui-web-components';
import { validateRoutingKey } from '../utils';
import { HeaderObjectEditor } from './HeaderEditor';
import _ from 'lodash';
import { Entity } from '@kapeta/schemas';

type RoutingEditorProps = {
    name: string;
    exchange: RabbitMQExchangeResource;
};

function createDefaultRouter(exchangeType: RabbitMQExchangeSpec['exchangeType']): QueueRouting {
    if (exchangeType === 'topic') {
        return '#';
    }

    if (exchangeType === 'headers') {
        return {
            matchAll: true,
            headers: {},
        };
    }

    return '';
}

const RoutingInfo = (props: Pick<RoutingEditorProps, 'exchange'>) => {
    switch (props.exchange.spec.exchangeType) {
        case 'direct':
            return <>Will automatically deliver all messages to at least 1 subscriber</>;
        case 'fanout':
            return <>Will automatically deliver all messages to all subscribers</>;
        case 'topic':
            return <>Use # to match zero or more words and * to match exactly one word. Use "." to separate words</>;
        case 'headers':
            return (
                <>
                    Does exact matching for message headers. Use the match all checkbox to determine if all headers must
                    match or if any match will do.
                </>
            );
    }

    return <>Unknown: {props.exchange.spec.exchangeType}</>;
};

const RoutingEditor = (props: RoutingEditorProps) => {
    switch (props.exchange.spec.exchangeType) {
        case 'topic':
            return (
                <>
                    <FormField
                        name={`${props.name}.routing`}
                        validation={['required', validateRoutingKey]}
                        label={'Routing Key'}
                    />
                </>
            );
        case 'headers':
            return (
                <>
                    <FormField
                        name={`${props.name}.routing.matchAll`}
                        label={'Match all'}
                        type={FormFieldType.CHECKBOX}
                    />
                    <HeaderObjectEditor name={`${props.name}.routing.headers`} />
                </>
            );
    }

    return <></>;
};

interface QueueBinding {
    queue: RabbitMQQueueResource;
    routing?: QueueRouting;
}

interface ExchangeBindings {
    exchange: RabbitMQExchangeResource;
    bindings: QueueBinding[];
}

interface BindingsData {
    exchanges: ExchangeBindings[];
}

type RabbitMQBindingEditorProps = {
    exchanges: RabbitMQExchangeResource[];
    queues: RabbitMQQueueResource[];
    onDataChanged?: (change: RabbitMQBindingsSchema) => void;
    entities: Entity[];
};

const toSchema = (data: BindingsData): RabbitMQBindingsSchema => {
    return {
        exchanges: data.exchanges.map((exchange) => {
            return {
                exchange: exchange.exchange.metadata.name,
                bindings: exchange.bindings.map((binding) => {
                    return {
                        queue: binding.queue.metadata.name,
                        routing: binding.routing,
                    };
                }),
            };
        }),
    };
};

const fromSchema = (
    schema: RabbitMQBindingsSchema,
    exchanges: RabbitMQExchangeResource[],
    queues: RabbitMQQueueResource[]
): BindingsData => {
    return {
        exchanges:
            (schema.exchanges
                ?.map((exchangeSchema) => {
                    const exchange = exchanges.find((e) => e.metadata.name === exchangeSchema.exchange);
                    if (!exchange) {
                        return undefined;
                    }

                    const bindings =
                        (exchangeSchema.bindings
                            ?.map((bindingSchema) => {
                                const queue = queues.find((q) => q.metadata.name === bindingSchema.queue);
                                if (!queue) {
                                    return undefined;
                                }
                                return {
                                    queue,
                                    routing: bindingSchema.routing,
                                } satisfies QueueBinding;
                            })
                            .filter(Boolean) as QueueBinding[]) ?? [];

                    return {
                        exchange,
                        bindings,
                    } satisfies ExchangeBindings;
                })
                .filter(Boolean) as ExchangeBindings[]) ?? [],
    };
};

export const RabbitMQBindingEditor = (props: RabbitMQBindingEditorProps) => {
    const bindingsField = useFormContextField<RabbitMQBindingsSchema>('spec.bindings');
    const formData = bindingsField.get({
        exchanges: props.exchanges.map((exchange) => {
            return {
                exchange: exchange.metadata.name,
                bindings: [],
            };
        }),
    });

    const [data, setData] = useState<BindingsData>(fromSchema(formData, props.exchanges, props.queues));

    const onDataChanged = useCallback(
        (data: BindingsData) => {
            const schemaData = toSchema(data);
            bindingsField.set(schemaData);
            if (props.onDataChanged) {
                props.onDataChanged(schemaData);
            }
            setData(data);
        },
        [setData, bindingsField, props.onDataChanged]
    );

    useEffect(() => {
        const copy = { ...data };
        copy.exchanges = props.exchanges.map((exchange) => {
            const existing = data.exchanges.find((e) => e.exchange.metadata.name === exchange.metadata.name);
            if (existing) {
                return existing;
            }
            return {
                exchange,
                bindings: [],
            };
        });
        if (!_.isEqual(copy, data)) {
            onDataChanged(copy);
        }
    }, [props.exchanges]);

    useEffect(() => {
        const anyIncompatible = data.exchanges.some((exchange) => {
            return exchange.bindings.some((binding) => {
                return !EntityHelpers.isEntityCompatible(
                    exchange.exchange.spec.payloadType.structure,
                    binding.queue.spec.payloadType.structure,
                    props.entities,
                    props.entities
                );
            });
        });

        if (anyIncompatible) {
            bindingsField.invalid();
        } else {
            bindingsField.valid();
        }
    }, [data]);

    return (
        <Stack className={'rabbitmq-binding-editor'} gap={1}>
            {data.exchanges.map((binding, exchangeIx) => {
                const matchingQueues = props.queues.filter((queue) => {
                    return EntityHelpers.isEntityCompatible(
                        binding.exchange.spec.payloadType.structure,
                        queue.spec.payloadType.structure,
                        props.entities,
                        props.entities
                    );
                });

                const unboundQueues = matchingQueues.filter((queue) => {
                    return !binding.bindings.some((b) => {
                        return b.queue.metadata.name === queue.metadata.name;
                    });
                });
                return (
                    <Stack
                        direction={'row'}
                        gap={2}
                        sx={{
                            borderBottomColor: grey[400],
                            borderBottomStyle: 'solid',
                            borderBottomWidth: 1,
                        }}
                    >
                        <Box
                            flex={1}
                            sx={{
                                flex: 1,
                                minWidth: '130px',
                                maxWidth: '200px',
                            }}
                        >
                            <h3>Exchange: {binding.exchange.metadata.name}</h3>
                            <p>
                                Type: <b>{binding.exchange.spec.exchangeType}</b>
                            </p>
                            <Typography color={grey[700]} fontSize={'12px'} py={1}>
                                <RoutingInfo exchange={binding.exchange} />
                            </Typography>
                        </Box>
                        <Stack direction={'column'} flex={1} gap={2} mb={2} minWidth={'150px'} mt={1.5}>
                            {matchingQueues.length === 0 && (
                                <Typography color={grey[700]} fontSize={'12px'} py={1} lineHeight={2}>
                                    No queue data types are compatible with this exchange.
                                    <br />
                                    Exchange type: <b>{binding.exchange.spec.payloadType.type}</b>
                                </Typography>
                            )}
                            {binding.bindings.map((queueBinding, bindingIx) => {
                                const compatible = EntityHelpers.isEntityCompatible(
                                    binding.exchange.spec.payloadType.structure,
                                    queueBinding.queue.spec.payloadType.structure,
                                    props.entities,
                                    props.entities
                                );

                                return (
                                    <Stack
                                        direction={'row'}
                                        gap={1}
                                        alignContent={'stretch'}
                                        alignItems={'stretch'}
                                        sx={{
                                            borderColor: compatible ? grey[200] : red[200],
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            p: 2,
                                        }}
                                    >
                                        <Box mt={1}>
                                            <ArrowRight />
                                        </Box>
                                        <Box flex={1}>
                                            <Typography mt={1}>Queue: {queueBinding.queue.metadata.name}</Typography>
                                            {!compatible && (
                                                <Typography
                                                    sx={{
                                                        color: red[400],
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    Queue data type not compatible :{' '}
                                                    <b>{queueBinding.queue.spec.payloadType.type}</b>
                                                </Typography>
                                            )}
                                            <RoutingEditor
                                                name={`spec.bindings.exchanges[${exchangeIx}].bindings[${bindingIx}]`}
                                                exchange={binding.exchange}
                                            />
                                        </Box>
                                        <Box mt={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    const copy = { ...data };
                                                    const exchange = copy.exchanges[exchangeIx];
                                                    exchange.bindings = exchange.bindings.filter(
                                                        (b) =>
                                                            b.queue.metadata.name !== queueBinding.queue.metadata.name
                                                    );
                                                    onDataChanged(copy);
                                                }}
                                                sx={{
                                                    transition: 'background-color 0.2s ease-in-out',
                                                    color: (theme) => theme.palette.text.disabled,
                                                    '&&:hover': {
                                                        color: (theme) => theme.palette.error.main,
                                                        backgroundColor: (theme) =>
                                                            alpha(theme.palette.error.main, 0.08),
                                                    },
                                                }}
                                            >
                                                <Clear fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                );
                            })}

                            {unboundQueues.length > 0 && (
                                <Stack direction={'row'} gap={1}>
                                    <Box mt={1} ml={2}>
                                        <ArrowRight />
                                    </Box>
                                    <Box flex={1}>
                                        <Select
                                            fullWidth={true}
                                            size={'small'}
                                            value={''}
                                            displayEmpty={true}
                                            onChange={(event) => {
                                                const queueName = event.target.value as string;
                                                if (!queueName) {
                                                    return;
                                                }
                                                const queue = props.queues.find((q) => q.metadata.name === queueName);
                                                if (queue) {
                                                    const copy = { ...data };
                                                    const exchange = copy.exchanges[exchangeIx];
                                                    exchange.bindings.push({
                                                        queue,
                                                        routing: createDefaultRouter(
                                                            exchange.exchange.spec.exchangeType
                                                        ),
                                                    });
                                                    onDataChanged(copy);
                                                }
                                            }}
                                        >
                                            <MenuItem value={''}>Actions...</MenuItem>
                                            {unboundQueues.map((queue) => {
                                                return (
                                                    <MenuItem value={queue.metadata.name}>
                                                        Add binding for queue:&nbsp;<b>{queue.metadata.name}</b>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </Box>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                );
            })}
        </Stack>
    );
};
