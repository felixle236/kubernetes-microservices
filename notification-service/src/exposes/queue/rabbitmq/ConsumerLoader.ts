import path from 'path';
import Container from 'typedi';
import { searchFilesSync } from 'utils/File';

export class ConsumerLoader {
    static async load(): Promise<void> {
        const files = searchFilesSync(path.join(__dirname, './consumers/**/*Consumer{.js,.ts}'));
        for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const consumer = require(file).default;
            const con = Container.get(consumer) as { init: () => Promise<void>};
            await con.init();
        }
    }
}
