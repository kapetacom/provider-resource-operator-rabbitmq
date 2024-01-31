/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */
import { Stack, TextField } from '@mui/material';
import { validateHeaderName } from '../utils';
import { useFormContextField } from '@kapeta/ui-web-components';
import React, { useEffect, useState } from 'react';

interface HeaderEditorProps {
    name: string;
    value: string;
    duplicate: boolean;
    onChange: (name: string, value: any) => void;
}

const HeaderEditor = (props: HeaderEditorProps) => {
    return (
        <Stack direction={'row'} gap={1}>
            <TextField
                name={`name`}
                label={'Name'}
                error={props.duplicate}
                helperText={props.duplicate ? 'Duplicate header name' : undefined}
                size={'small'}
                value={props.name}
                onChange={(evt) => {
                    try {
                        validateHeaderName('headerName', evt.target.value);
                        props.onChange(evt.target.value, props.value);
                    } catch (e) {
                        // ignore
                    }
                }}
            />
            <TextField
                name={`value`}
                label={'Value'}
                size={'small'}
                value={props.value}
                onChange={(evt) => {
                    props.onChange(props.name, evt.target.value);
                }}
            />
        </Stack>
    );
};

type HeaderValue = { [key: string]: string };

interface HeaderObjectEditorProps {
    name: string;
}

export const HeaderObjectEditor = (props: HeaderObjectEditorProps) => {
    const field = useFormContextField<HeaderValue>(props.name);
    const [headers, setHeaders] = useState<[string, string][]>([]);

    useEffect(() => {
        const headerValues = Object.entries(field.get({})).filter(([key, value]) => Boolean(key));
        console.log('headerValues', headerValues);
        setHeaders(headerValues);
    }, [field]);

    const headerCount = headers.length;

    const hasDuplicates = headers.some(([key, value], ix) => {
        return headers.some(([key2, value2], ix2) => {
            return ix !== ix2 && key === key2;
        });
    });

    useEffect(() => {
        if (headerCount === 0 || hasDuplicates) {
            field.invalid();
        } else {
            field.valid();
        }
    }, [headerCount, hasDuplicates]);

    if (headers.length === 0) {
        headers.push(['', '']);
    } else if (headers[headers.length - 1][0]) {
        // Add a new empty header if the last one is not empty
        headers.push(['', '']);
    }

    const duplicateHeaderNames = new Set<string>();

    return (
        <Stack direction={'column'} gap={2}>
            {headers.map(([previousName, value], ix) => {
                const duplicate = duplicateHeaderNames.has(previousName);
                duplicateHeaderNames.add(previousName);
                return (
                    <HeaderEditor
                        key={ix}
                        name={previousName}
                        value={value}
                        duplicate={duplicate}
                        onChange={(name, value) => {
                            const copy = [...headers].filter(([key, value]) => Boolean(key));
                            if (name) {
                                copy[ix] = [name, value];
                            } else {
                                copy.splice(ix, 1);
                            }
                            setHeaders(copy);
                            field.set(Object.fromEntries(copy));
                        }}
                    />
                );
            })}
        </Stack>
    );
};
