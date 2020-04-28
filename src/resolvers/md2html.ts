import {basename, dirname, join, relative, resolve} from 'path';
import {readFileSync} from 'fs';
import yaml from 'js-yaml';

import transform, {Output} from 'yfm-transform';
import log from 'yfm-transform/lib/log';

import {YFM_PLUGINS} from '../constants';
import {YfmToc} from '../models';
import {ArgvService, PresetService, TocService} from '../services';
import {generateStaticMarkup, ResolverOptions, transformToc} from '../utils';

export interface FileTransformOptions {
    path: string;
    root?: string;
}

export const FileTransformer: Record<string, Function> = {
    '.yaml': function({path}: FileTransformOptions): Object {
        const {input} = ArgvService.getConfig();
        const resolvedPath = resolve(input, path);
        let data = {};

        try {
            const content = readFileSync(resolvedPath, 'utf8');
            data = yaml.safeLoad(content);
        } catch {
            log.error('');
        }

        return {
            result: {data}
        };
    },
    '.md': function({path}: FileTransformOptions): Output {
        const {input, vars, ...options} = ArgvService.getConfig();
        const resolvedPath: string = resolve(input, path);
        const content: string = readFileSync(resolvedPath, 'utf8');

        /* Relative path from folder of .md file to root of user' output folder */
        const assetsPublicPath = relative(dirname(resolvedPath), resolve(input));

        return transform(content, {
            ...options,
            plugins: YFM_PLUGINS,
            vars: {
                ...PresetService.get(dirname(path)),
                ...vars,
            },
            root: resolve(input),
            path: resolvedPath,
            assetsPublicPath,
        });
    }
};

/**
 * Transforms markdown file to HTML format.
 * @param inputPath
 * @param fileExtension
 * @param outputPath
 * @param outputBundlePath
 */
export function resolveMd2HTML({inputPath, fileExtension, outputPath, outputBundlePath}: ResolverOptions): string {
    const pathToDir: string = dirname(inputPath);
    const toc: YfmToc|undefined = TocService.getForPath(inputPath);
    const tocBase: string = toc && toc.base ? toc.base : '';
    const pathToIndex: string = pathToDir !== tocBase ? pathToDir.replace(tocBase, '..') : '';

    const transformFn: Function = FileTransformer[fileExtension];
    const {result} = transformFn({path: inputPath});
    const props = {
        isLeading: inputPath.endsWith('.yaml'),
        toc: transformToc(toc, pathToDir) || {},
        pathname: join(pathToIndex, basename(outputPath)),
        ...result,
    };
    const outputDir = dirname(outputPath);
    const relativePathToBundle: string = relative(resolve(outputDir), resolve(outputBundlePath));

    return generateStaticMarkup(props, relativePathToBundle);
}
