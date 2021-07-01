import {resolve} from 'path';
import walkSync from 'walk-sync';
import shell from 'shelljs';

import {ArgvService, TocService} from '../services';
import {convertBackSlashToSlash} from '../utils';

/**
 * Removes all content files that unspecified in toc files or ignored.
 * @return {void}
 */
export function processExcludedFiles() {
    const {
        input: inputFolderPath,
        ignore,
    } = ArgvService.getConfig();

    const allContentFiles: string[] = walkSync(inputFolderPath, {
        directories: false,
        includeBasePath: true,
        globs: [
            '**/*.md',
            '**/index.yaml',
            ...ignore,
        ],
        // Ignores service directories like "_includes", "_templates" and etc.
        ignore: ['**/_*/**/*'],
    });
    const resolvedNavPath = TocService.getNavigationPaths()
        .map((filePath) => convertBackSlashToSlash(resolve(inputFolderPath, filePath)));
    const tocSpecifiedFiles = new Set(resolvedNavPath);
    const excludedFiles = allContentFiles
        .filter((filePath) => !tocSpecifiedFiles.has(filePath));

    shell.rm('-f', excludedFiles);
}
