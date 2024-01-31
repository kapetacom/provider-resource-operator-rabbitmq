/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */
import React, { useEffect } from 'react';
import { TextAreaWithLines } from './TextAreaWithLines';
import { grey } from '@mui/material/colors';
import { useFormContextField } from '@kapeta/ui-web-components';
import { RabbitMQHeaderRoute } from '@kapeta/sdk-rabbitmq';

function validateHeaderValue(name: string, value: string) {
    const headers: RabbitMQHeaderRoute[] = [];
    const headerNames: string[] = [];
    value.split(/\n/g).forEach((key, lineIx) => {
        if (!key) {
            return;
        }
        key = key.trim();

        if (!key.includes(':')) {
            throw new Error(`Invalid syntax on line ${lineIx + 1}: ${key}`);
        }

        const [headerName, headerValue] = key.split(':');

        const lcHeaderName = headerName.toLowerCase();

        if (headerNames.includes(lcHeaderName)) {
            throw new Error(`Duplicate header name on line ${lineIx + 1}: ${key}`);
        }
        headerNames.push(lcHeaderName);

        if (!/^[a-z-][a-z\d-]*([a-z\d-]+)*$/i.test(headerName)) {
            throw new Error(`Invalid header name key on line ${lineIx + 1}: ${key}`);
        }

        const headerValues = headerValue
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);
        if (headerValues.length === 0) {
            throw new Error(`Missing header values on line ${lineIx + 1}: ${key}`);
        }

        headers.push({
            name: headerName,
            values: headerValues,
        });
    });

    return headers;
}

interface Props {
    name: string;
}

export const HeaderOptionsField = (props: Props) => {
    const dataField = useFormContextField<RabbitMQHeaderRoute[]>(props.name + '.data');
    const textField = useFormContextField<string>(props.name + '.text');
    const textValue = textField.get();

    useEffect(() => {
        try {
            const keys = validateHeaderValue(props.name, textValue);
            dataField.set(keys);
        } catch (e) {
            dataField.set([]);
        }
    }, [textValue, dataField, props.name]);

    return (
        <>
            <TextAreaWithLines label={'Headers'} name={props.name + '.text'} validation={[validateHeaderValue]} />
            <pre
                style={{
                    color: grey[600],
                    fontSize: '12px',
                }}
            >
                Define the headers to be used when publishing to a headers exchange.
                <br />
                <br />
                <b>Format:</b>
                <br />
                Some-Header: value1, value2, value3
                <br />
                Other-Header: other1, other2
            </pre>
        </>
    );
};
