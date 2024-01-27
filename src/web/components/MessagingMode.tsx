import { FormField, FormFieldType } from '@kapeta/ui-web-components';
import { Alert, Link } from '@mui/material';
import React, { useState } from 'react';

const localStorageKey = 'showMessagingModeHelp';

export const MessagingMode = () => {
    const [showHelp, setShowHelp] = useState(window.localStorage.getItem(localStorageKey) !== 'false');

    return (
        <>
            <FormField
                name={'messagingMode'}
                validation={['required']}
                label={'Messaging Mode'}
                type={FormFieldType.ENUM}
                options={{
                    instances: 'All instances',
                    blocks: 'All blocks',
                    competing: 'Competing Consumers',
                }}
                help={'This setting determines who will receive messages from this publisher.'}
            />
            {showHelp && (
                <Alert
                    severity={'info'}
                    closeText={'Hide this message'}
                    onClose={() => {
                        setShowHelp(false);
                        window.localStorage.setItem(localStorageKey, 'false');
                    }}
                >
                    Messaging mode determines how messages are routed to consumers.
                    <p>
                        <b>All instances</b>: All instances of all blocks connected to provider will receive all
                        message.
                    </p>
                    <p>
                        <b>All blocks</b>: One instance of each block connected to provider will receive all message.
                    </p>
                    <p>
                        <b>Competing Consumers</b>: Only one instance of any blocks connected to provider will receive
                        the message.
                    </p>
                    Read more how RabbitMQ exchanges work{' '}
                    <Link href={'https://www.rabbitmq.com/tutorials/amqp-concepts.html#exchanges'} target={'_blank'}>
                        here
                    </Link>
                    .
                </Alert>
            )}
        </>
    );
};
