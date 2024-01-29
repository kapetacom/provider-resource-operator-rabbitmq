import {FormField, FormFieldProps, FormFieldType, useFormContextField} from "@kapeta/ui-web-components";
import {Box} from "@mui/material";
import {grey} from "@mui/material/colors";
import React from "react";

interface Props extends FormFieldProps{

}

export const TextAreaWithLines = (props:Props) => {

    const field = useFormContextField(props.name);
    const stringValue = field.get('');

    const lineCount = stringValue.length > 0 ?
        stringValue.split(/\n/g).length : 0;

    let lineNumberWidth = 24;
    if (lineCount > 9) {
        lineNumberWidth = 28;
    }

    if (lineCount > 99) {
        lineNumberWidth = 34;
    }

    let lineNumbers = [];
    for (let i = 0; i < lineCount; i++) {
        lineNumbers.push(i);
    }

    let preTop = props.help ? 16 : 8;

    return (
        <Box sx={{
            position: 'relative',
            'textarea,pre': {
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '24px',
                fontWeight: 300
            },
            'textarea': {
                pl: `${lineNumberWidth + 8}px`
            },
            pre: {
                position: 'absolute',
                overflow: 'hidden',
                boxSizing: 'border-box',
                top: `${preTop}px`,
                left: 0,
                width: `${lineNumberWidth + 4}px`,
                pl: '4px',
                bgcolor: grey[100],
                color: grey[800],
                borderColor: 'divider',
                borderStyle: 'solid',
                borderWidth: '1px',
            }
        }}>
            {lineNumbers.length > 0 &&
                <pre>
                    {lineNumbers.map((line) => {
                        return `#${line + 1}\n`;
                    })}
                    </pre>
            }
            <FormField
                {...props}
                type={FormFieldType.TEXT}
            />
        </Box>
    )
}