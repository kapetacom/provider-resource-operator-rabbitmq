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
import { RabbitMQBlockConfigComponent } from '../src/web/components/RabbitMQBlockConfigComponent';

const mapper = ([name, property]: [string, any]): DSLDataTypeProperty => ({
    name,
    ...property,
});

const toEntity = (type: DSLData, types: DSLData[]): Entity => {
    return DSLConverters.toSchemaEntity(CONSUMER_ENTITIES[0], CONSUMER_ENTITIES as DSLDataType[]) as Entity;
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
        consumers: [],
        publishers: [],
    },
};

const PUBLISHER_ENTITIES: DSLData[] = [
    {
        type: DSLEntityType.DATATYPE,
        name: 'Task',
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
];

const CONSUMER_ENTITIES: DSLData[] = [
    {
        type: DSLEntityType.DATATYPE,
        name: 'Task',
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
];

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

const RabbitMQExchangeResourceData: RabbitMQExchangeResource = {
    kind: KIND_EXCHANGE,
    metadata: {
        name: 'MyPublisher',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: PUBLISHER_ENTITIES[0].name,
            structure: toEntity(PUBLISHER_ENTITIES[0], PUBLISHER_ENTITIES),
        },
        exchangeType: 'topic',
    },
};

const RabbitMQQueueResourceData: RabbitMQQueueResource = {
    kind: KIND_QUEUE,
    metadata: {
        name: 'MyRESTClient',
    },
    spec: {
        port: {
            type: 'amqp',
        },
        payloadType: {
            type: CONSUMER_ENTITIES[0].name,
            structure: toEntity(CONSUMER_ENTITIES[0], CONSUMER_ENTITIES),
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
            initialValue={RabbitMQExchangeResourceData}
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
            initialValue={RabbitMQExchangeResourceData}
            onChange={(data: any) => console.log('Data changed', data)}
        >
            <RabbitMQPublisherEditor block={BLOCK} />
        </FormContainer>
    </div>
);

export const BindingEditorTopic = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchange={RabbitMQExchangeResourceData}
            queue={RabbitMQQueueResourceData}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const BindingEditorDirect = () => {
    const source = {
        ...RabbitMQExchangeResourceData,
        spec: {
            ...RabbitMQExchangeResourceData.spec,
            exchangeType: 'direct',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchange={source}
                queue={RabbitMQQueueResourceData}
                onDataChanged={(change) => console.log('Data changed', change)}
                entities={PUBLISHER_ENTITIES}
            />
        </div>
    );
};

export const BindingEditorFanout = () => {
    const source = {
        ...RabbitMQExchangeResourceData,
        spec: {
            ...RabbitMQExchangeResourceData.spec,
            exchangeType: 'fanout',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchange={source}
                queue={RabbitMQQueueResourceData}
                onDataChanged={(change) => console.log('Data changed', change)}
                entities={PUBLISHER_ENTITIES}
            />
        </div>
    );
};

export const BindingEditorHeader = () => {
    const source = {
        ...RabbitMQExchangeResourceData,
        spec: {
            ...RabbitMQExchangeResourceData.spec,
            exchangeType: 'headers',
        },
    } satisfies RabbitMQExchangeResource;

    return (
        <div style={{ padding: '25px', width: '750px', height: '100%' }}>
            <ToastContainer />
            <RabbitMQBindingEditor
                exchange={source}
                queue={RabbitMQQueueResourceData}
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
            exchange={RabbitMQExchangeResourceEmptyData}
            queue={RabbitMQQueueResourceData}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const BindingEditorEmptyServerOK = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchange={RabbitMQExchangeResourceEmptyData}
            queue={RabbitMQQueueResourceData}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={CONSUMER_ENTITIES}
        />
    </div>
);

export const BindingEditorEmptyClientProblem = () => (
    <div style={{ padding: '25px', width: '750px', height: '100%' }}>
        <ToastContainer />
        <RabbitMQBindingEditor
            exchange={RabbitMQExchangeResourceData}
            queue={RabbitMQSubscriberEmptyData}
            onDataChanged={(change) => console.log('Data changed', change)}
            entities={PUBLISHER_ENTITIES}
        />
    </div>
);

export const TrafficInspectorView = () => <RabbitMQConnectionInspector mapping={{}} trafficLines={trafficLines} />;

export const BlockEditorView = () => {
    return <RabbitMQBlockEditorComponent block={RABBIT_BLOCK} />;
};

export const BlockConfigView = () => {
    return (
        <RabbitMQBlockConfigComponent
            block={RABBIT_BLOCK}
            instance={{
                block: {
                    ref: 'kapeta/test',
                },
                name: 'mq1',
                id: '1',
                dimensions: {
                    height: 1,
                    width: 1,
                    top: 0,
                    left: 0,
                },
                defaultConfiguration: {},
            }}
        />
    );
};
