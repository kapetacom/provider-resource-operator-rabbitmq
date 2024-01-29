import React from 'react';
import { TextAreaWithLines } from './TextAreaWithLines';
import { grey } from '@mui/material/colors';

function validateHeaderValue(name: string, value: string) {
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
    });
}

interface Props {
    name: string;
}

export const HeaderOptionsField = (props: Props) => {
    return (
        <>
            <TextAreaWithLines label={'Headers'} name={props.name} validation={[validateHeaderValue]} />
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
