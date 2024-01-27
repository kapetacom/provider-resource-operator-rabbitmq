import React, { useEffect, useMemo } from 'react';
import { FormField, FormFieldType, useFormContextField } from '@kapeta/ui-web-components';
import { Entity } from '@kapeta/schemas';
import { ResourceTypeProviderEditorProps } from '@kapeta/ui-web-types';
import { validateName } from '../utils';

export const RabbitMQBaseEditor = (props: ResourceTypeProviderEditorProps) => {
    const entityNames = useMemo(() => {
        if (!props.block.spec.entities?.types) {
            return [];
        }
        return props.block.spec.entities.types.map((e) => e.name);
    }, [props.block.spec.entities?.types]);

    const payloadTypeField = useFormContextField<string>('spec.payloadType.type');
    const structureField = useFormContextField<Entity>('spec.payloadType.structure');

    const payloadType = payloadTypeField.get();

    useEffect(() => {
        if (!payloadType || !props.block.spec.entities?.types) {
            return;
        }
        const type = payloadType;
        const entity = props.block.spec.entities.types.find((e) => e.name === type);
        if (!entity) {
            return;
        }
        structureField.set(entity);
    }, [payloadTypeField, payloadType, structureField, props.block.spec.entities?.types]);

    return (
        <>
            <FormField
                name={'metadata.name'}
                label={'Name'}
                validation={['required', validateName]}
                help={'Name your resource. E.g. "events"'}
            />

            <FormField
                name={'spec.payloadType.type'}
                type={FormFieldType.ENUM}
                options={entityNames}
                validation={['required']}
                help={'The message payload type'}
            />
        </>
    );
};
