/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from '@jest/globals';
import { validateName } from '../src/web/utils';

describe('utils', () => {
    test('can validate names', () => {
        expect(() => validateName('', 'test')).not.toThrowError();
        expect(() => validateName('', 'test-')).toThrowError();
        expect(() => validateName('', '-test')).toThrowError();
        expect(() => validateName('', 'backend-api')).toThrowError();
        expect(() => validateName('', 'backend.api')).toThrowError();
    });
});
