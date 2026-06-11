import { rulint } from 'rulint';
import { naming } from '@rulint/naming';

export default rulint({ configs: [naming({ naming: { function: ['snake_case'], variable: ['snake_case'] } })] });
