import React, { useEffect } from 'react';
import { TextAreaWithLines } from './TextAreaWithLines';
import { grey } from '@mui/material/colors';
import { useFormContextField } from '@kapeta/ui-web-components';

function validateRouteKeys(name: string, value: string) {
    const keys: string[] = [];
    value.split(/\n/g).forEach((key, lineIx) => {
        if (!key) {
            return;
        }

        key = key.trim();

        if (!/^[a-zA-Z-_][a-zA-Z\d-_]*(\.[a-zA-Z\d-_]+)*$/.test(key)) {
            throw new Error(`Invalid routing key on line ${lineIx + 1}: ${key}`);
        }

        if (keys.includes(key)) {
            throw new Error(`Duplicate routing key on line ${lineIx + 1}: ${key}`);
        }
        keys.push(key);
    });

    return keys;
}

interface Props {
    name: string;
}

export const RoutingKeysListField = (props: Props) => {
    const dataField = useFormContextField<string[]>(props.name + '.data');
    const textField = useFormContextField<string>(props.name + '.text');
    const textValue = textField.get();

    useEffect(() => {
        try {
            const keys = validateRouteKeys(props.name, textValue);
            dataField.set(keys);
        } catch (e) {
            dataField.set([]);
        }
    }, [textValue, dataField, props.name]);

    return (
        <>
            <TextAreaWithLines label={'Keys'} name={props.name + '.text'} validation={[validateRouteKeys]} />
            <pre
                style={{
                    color: grey[600],
                    fontSize: '12px',
                }}
            >
                Define the route keys to use when publishing to a topics exchange.
                <br />
                <br />
                <b>Format:</b>
                <br />
                some.route.key
                <br />
                other.route.key
            </pre>
        </>
    );
};
