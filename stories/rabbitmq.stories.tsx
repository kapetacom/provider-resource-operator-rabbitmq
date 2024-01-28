/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import '@kapeta/ui-web-components/styles/index.less';

import React from 'react';
import { Traffic } from '@kapeta/ui-web-types';

import { DSLConverters, DSLData, DSLDataType, DSLDataTypeProperty, DSLEntityType } from '@kapeta/kaplang-core';
import { BlockDefinition, Entity, EntityType } from '@kapeta/schemas';
import { RabbitMQSubscriberEditor } from '../src/web/components/RabbitMQSubscriberEditor';
import {
    KIND_EXCHANGE,
    KIND_QUEUE,
    RabbitMQBlockDefinition,
    RabbitMQExchangeResource,
    RabbitMQQueueResource,
} from '../src/web/types';
import { FormContainer, ToastContainer } from '@kapeta/ui-web-components';
import { RabbitMQPublisherEditor } from '../src/web/components/RabbitMQPublisherEditor';
import { RabbitMQBindingEditor } from '../src/web/components/RabbitMQBindingEditor';
import { RabbitMQConnectionInspector } from '../src/web/components/RabbitMQConnectionInspector';
import { RabbitMQBlockEditorComponent } from '../src/web/components/RabbitMQBlockEditorComponent';
import { RabbitMQExchangeEditor } from '../src/web/components/RabbitMQExchangeEditor';
import { RabbitMQQueueEditor } from '../src/web/components/RabbitMQQueueEditor';

const mapper = ([name, property]: [string, any]): DSLDataTypeProperty => ({
    name,
    ...property,
});

const toEntity = (type: DSLData, types: DSLData[]): Entity => {
    return DSLConverters.toSchemaEntity(type, types as DSLDataType[]) as Entity;
};

const toEntities = (data: DSLData[]): Entity[] => {
    return data.map((d) => toEntity(d, data));
};

const BLOCK: BlockDefinition = {
    kind: 'kapeta/block-type-service',
    metadata: {
        name: 'kapeta/test',
    },
    spec: {
        entities: {
            types: [
                {
                    type: EntityType.Dto,
                    name: 'Task',
                    properties: {
                        id: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        state: {
                            ref: 'TaskState',
                        },
                    },
                },
            ],
        },
    },
};
const PUBLISHER_ENTITIES = toEntities([
    {
        type: DSLEntityType.DATATYPE,
        name: 'PublisherTask',
        properties: Object.entries({
            id: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            state: {
                ref: 'TaskState',
            },
        }).map(mapper),
    },
    {
        type: DSLEntityType.DATATYPE,
        name: 'SimpleTask',
        properties: Object.entries({
            id: {
                type: 'string',
            },
            state: {
                ref: 'TaskState',
            },
        }).map(mapper),
    },
    {
        type: DSLEntityType.ENUM,
        name: 'TaskState',
        values: ['PENDING', 'DONE'],
    },
]);

const CONSUMER_ENTITIES = toEntities([
    {
        type: DSLEntityType.DATATYPE,
        name: 'ConsumerTask',
        properties: Object.entries({
            id: {
                type: 'string',
            },
            state: {
                ref: 'TaskState',
            },
        }).map(mapper),
    },
    {
        type: DSLEntityType.ENUM,
        name: 'TaskState',
        values: ['PENDING', 'DONE'],
    },
]);

const RabbitMQExchangeResourceEmptyData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'MyEmptyPublisher',
    },
    // @ts-ignore
    spec: {
        port: {
            type: 'amqp',
        },
    },
};

const RabbitMQExchangeResourceTopicData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'events',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
        exchangeType: 'topic',
    },
};

const RabbitMQExchangeResourceHeadersData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'logs',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
        exchangeType: 'headers',
    },
};

const RabbitMQExchangeResourceDirectData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'commands',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
        exchangeType: 'direct',
    },
};

const RabbitMQExchangeResourceFanoutData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'audit',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
        exchangeType: 'fanout',
    },
};

const RabbitMQQueueResourceData: RabbitMQQueueResource = {
    kind: KIND_QUEUE,
    metadata: {
        name: 'events',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
    },
};

const RabbitMQQueueResourceData2: RabbitMQQueueResource = {
    kind: KIND_QUEUE,
    metadata: {
        name: 'logs',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: PUBLISHER_ENTITIES[0],
        },
    },
};

const RabbitMQQueueResourceDataOtherType: RabbitMQQueueResource = {
    kind: KIND_QUEUE,
    metadata: {
        name: 'other',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: CONSUMER_ENTITIES[0].name,
            structure: CONSUMER_ENTITIES[0],
        },
    },
};

const RabbitMQSubscriberEmptyData: RabbitMQQueueResource = {
    kind: KIND_QUEUE,
    metadata: {
        name: 'MyEmptyClient',
    },
    // @ts-ignore
    spec: {
        port: {
            type: 'amqp',
        },
    },
};

const RABBIT_BLOCK: RabbitMQBlockDefinition = {
    kind: 'kapeta/block-type-rabbitmq',
    metadata: {
        name: 'kapeta/test',
    },
    spec: {
        entities: {
            types: [
                {
                    type: EntityType.Dto,
                    name: 'Task',
                    properties: {
                        id: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        state: {
                            ref: 'TaskState',
                        },
                    },
                },
            ],
        },
        consumers: [
            RabbitMQExchangeResourceTopicData,
            RabbitMQExchangeResourceHeadersData,
            RabbitMQExchangeResourceDirectData,
            RabbitMQExchangeResourceFanoutData,
        ],
        providers: [RabbitMQQueueResourceData, RabbitMQQueueResourceData2, RabbitMQQueueResourceDataOtherType],
    },
};

const RABBIT_BLOCK_FILLED: RabbitMQBlockDefinition = {
    kind: 'kapeta/block-type-rabbitmq',
    metadata: {
        name: 'kapeta/test',
    },
    spec: {
        entities: {
            types: [
                {
                    type: EntityType.Dto,
                    name: 'Task',
                    properties: {
                        id: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        state: {
                            ref: 'TaskState',
                        },
                    },
                },
            ],
        },
        consumers: [
            RabbitMQExchangeResourceTopicData,
            RabbitMQExchangeResourceHeadersData,
            RabbitMQExchangeResourceDirectData,
            RabbitMQExchangeResourceFanoutData,
        ],
        providers: [RabbitMQQueueResourceData, RabbitMQQueueResourceData2, RabbitMQQueueResourceDataOtherType],
        bindings: {
            exchanges: [
                {
                    exchange: RabbitMQExchangeResourceTopicData.metadata.name,
                    bindings: [
                        {
                            queue: RabbitMQQueueResourceData.metadata.name,
                            routing: 'events',
                        },
                        {
                            queue: RabbitMQQueueResourceData2.metadata.name,
                            routing: '#',
                        },
                    ],
                },
                {
                    exchange: RabbitMQExchangeResourceHeadersData.metadata.name,
                    bindings: [
                        {
                            queue: RabbitMQQueueResourceData.metadata.name,
                            routing: {
                                matchAll: true,
                                headers: {
                                    'x-match': 'all',
                                },
                            },
                        },
                        {
                            queue: RabbitMQQueueResourceData2.metadata.name,
                            routing: {
                                matchAll: false,
                                headers: {
                                    some: 'thing',
                                    other: 'here',
                                },
                            },
                        },
                    ],
                },
                {
                    exchange: RabbitMQExchangeResourceDirectData.metadata.name,
                    bindings: [
                        {
                            queue: RabbitMQQueueResourceData2.metadata.name,
                        },
                    ],
                },
                {
                    exchange: RabbitMQExchangeResourceFanoutData.metadata.name,
                    bindings: [
                        {
                            queue: RabbitMQQueueResourceDataOtherType.metadata.name,
                        },
                    ],
                },
            ],
        },
    },
};

const trafficLines: Traffic[] = [
    {
        ended: new Date().getTime(),
        connectionId: '1',
        consumerMethodId: 'remoteTest',
        created: new Date().getTime(),
        id: '1',
        providerMethodId: 'test',
        error: '',
        request: {
            headers: {},
            body: '',
            url: '/some/where',
            method: 'POST',
        },
        response: {
            code: 200,
            headers: {},
        },
    },
    {
        ended: new Date().getTime(),
        connectionId: '1',
        consumerMethodId: 'remoteTest',
        created: new Date().getTime(),
        id: '2',
        providerMethodId: 'test',
        error: '',
        request: {
            headers: {},
            body: '',
            url: '/some/where',
            method: 'POST',
        },
        response: {
            code: 200,
            headers: {},
        },
    },
    {
        ended: new Date().getTime(),
        connectionId: '1',
        consumerMethodId: 'remoteTest',
        created: new Date().getTime(),
        id: '3',
        providerMethodId: 'test',
        error: '',
        request: {
            headers: {},
            body: '',
            url: '/some/where',
            method: 'POST',
        },
        response: {
            code: 503,
            headers: {},
        },
    },
    {
        ended: new Date().getTime(),
        connectionId: '1',
        consumerMethodId: 'remoteOtherTest',
        created: new Date().getTime(),
        id: '4',
        providerMethodId: 'otherTest',
        error: '',
        request: {
            headers: {},
            body: '',
            url: '/some/where',
            method: 'POST',
        },
        response: {
            code: 200,
            headers: {},
        },
    },
];

export default {
    title: 'RabbitMQ',
};

export const ConsumerEditor = () => (
    <div
        style={{ padding: '10px', width: '850px', height: '500px', backgroundColor: 'white', border: '1px solid gray' }}
    >
        <FormContainer
            initialValue={RabbitMQExchangeResourceTopicData}
            onChange={(data: any) => console.log('Data changed', data)}
        >
            <RabbitMQSubscriberEditor block={BLOCK} />
        </FormContainer>
    </div>
);

export const PublisherEditor = () => (
    <div
        style={{ padding: '10px', width: '850px', height: '500px', backgroundColor: 'white', border: '1px solid gray' }}
    >
        <FormContainer
            initialValue={RabbitMQExchangeResourceTopicData}
            onChange={(data: any) => console.log('Data changed', data)}
        >
            <RabbitMQPublisherEditor block={BLOCK} />
        </FormContainer>
    </div>
);

export const ExchangeEditor = () => (
    <div
        style={{ padding: '10px', width: '850px', height: '500px', backgroundColor: 'white', border: '1px solid gray' }}
    >
        <FormContainer
            initialValue={RabbitMQExchangeResourceTopicData}
            onChange={(data: any) => console.log('Data changed', data)}
        >
            <RabbitMQExchangeEditor block={RABBIT_BLOCK as any as BlockDefinition} />
        </FormContainer>
    </div>
);

export const QueueEditor = () => (
    <div
        style={{ padding: '10px', width: '850px', height: '500px', backgroundColor: 'white', border: '1px solid gray' }}
    >
        <FormContainer
            initialValue={RabbitMQExchangeResourceTopicData}
            onChange={(data: any) => console.log('Data changed', data)}
        >
            <RabbitMQQueueEditor block={RABBIT_BLOCK as any as BlockDefinition} />
        </FormContainer>
    </div>
);

export const BindingEditorTopic = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchanges={[
                RabbitMQExchangeResourceTopicData,
                RabbitMQExchangeResourceHeadersData,
                RabbitMQExchangeResourceDirectData,
                RabbitMQExchangeResourceFanoutData,
            ]}
            queues={[RabbitMQQueueResourceData, RabbitMQQueueResourceData2]}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const BindingEditorTopicTypeMismatch = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchanges={[
                RabbitMQExchangeResourceTopicData,
                RabbitMQExchangeResourceHeadersData,
                RabbitMQExchangeResourceDirectData,
                RabbitMQExchangeResourceFanoutData,
            ]}
            queues={[RabbitMQQueueResourceDataOtherType]}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const BindingEditorDirect = () => {
    const source = {
        ...RabbitMQExchangeResourceTopicData,
        spec: {
            ...RabbitMQExchangeResourceTopicData.spec,
            exchangeType: 'direct',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchanges={[source]}
                queues={[RabbitMQQueueResourceData]}
                onDataChanged={(change) => console.log('Data changed', change)}
                entities={PUBLISHER_ENTITIES}
            />
        </div>
    );
};

export const BindingEditorFanout = () => {
    const source = {
        ...RabbitMQExchangeResourceTopicData,
        spec: {
            ...RabbitMQExchangeResourceTopicData.spec,
            exchangeType: 'fanout',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchanges={[source]}
                queues={[RabbitMQQueueResourceData]}
                onDataChanged={(change) => console.log('Data changed', change)}
                entities={PUBLISHER_ENTITIES}
            />
        </div>
    );
};

export const BindingEditorHeader = () => {
    const source = {
        ...RabbitMQExchangeResourceTopicData,
        spec: {
            ...RabbitMQExchangeResourceTopicData.spec,
            exchangeType: 'headers',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchanges={[source]}
                queues={[RabbitMQQueueResourceData]}
                onDataChanged={(change) => console.log('Data changed', change)}
                entities={PUBLISHER_ENTITIES}
            />
        </div>
    );
};

export const BindingEditorEmptyServerProblem = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchanges={[RabbitMQExchangeResourceEmptyData]}
            queues={[RabbitMQQueueResourceData]}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const BindingEditorEmptyServerOK = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchanges={[RabbitMQExchangeResourceEmptyData]}
            queues={[RabbitMQQueueResourceData]}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={CONSUMER_ENTITIES}
        />
    </div>
);

export const BindingEditorEmptyClientProblem = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchanges={[RabbitMQExchangeResourceTopicData]}
            queues={[RabbitMQSubscriberEmptyData]}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const TrafficInspectorView = () => <RabbitMQConnectionInspector mapping={{}} trafficLines={trafficLines} />;

export const BlockEditorView = () => {
    return (
        <FormContainer
            initialValue={RABBIT_BLOCK}
            onChange={(data) => {
                console.log('Form data changed', data);
            }}
        >
            <RabbitMQBlockEditorComponent block={RABBIT_BLOCK} />
        </FormContainer>
    );
};

export const BlockEditorFilledView = () => {
    return (
        <FormContainer
            initialValue={RABBIT_BLOCK_FILLED}
            onChange={(data) => {
                console.log('Form data changed', data);
            }}
        >
            <RabbitMQBlockEditorComponent block={RABBIT_BLOCK_FILLED} />
        </FormContainer>
    );
};
