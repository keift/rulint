import { rulint } from 'rulint';
import { naming } from '@rulint/naming';

export default rulint({ configs: [naming({ naming: { variable: ['snake_case'] } })] });
