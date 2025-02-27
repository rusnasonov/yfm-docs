import {dirname} from 'path';
const os = require('os');
const notes = require('@doc-tools/transform/lib/plugins/notes');
const anchors = require('@doc-tools/transform/lib/plugins/anchors');
const code = require('@doc-tools/transform/lib/plugins/code');
const cut = require('@doc-tools/transform/lib/plugins/cut');
const deflist = require('@doc-tools/transform/lib/plugins/deflist');
const imsize = require('@doc-tools/transform/lib/plugins/imsize');
const meta = require('@doc-tools/transform/lib/plugins/meta');
const sup = require('@doc-tools/transform/lib/plugins/sup');
const tabs = require('@doc-tools/transform/lib/plugins/tabs');
const video = require('@doc-tools/transform/lib/plugins/video');
const includes = require('@doc-tools/transform/lib/plugins/includes');
const links = require('@doc-tools/transform/lib/plugins/links');
const images = require('@doc-tools/transform/lib/plugins/images');
const monospace = require('@doc-tools/transform/lib/plugins/monospace');
const table = require('@doc-tools/transform/lib/plugins/table');
const term = require('@doc-tools/transform/lib/plugins/term');
const mermaid = require('@diplodoc/mermaid-extension');

includes.collect = require('@doc-tools/transform/lib/plugins/includes/collect');
images.collect = require('@doc-tools/transform/lib/plugins/images/collect');

import openapiSandbox from './services/includers/batteries/openapi/plugin';

export const BUILD_FOLDER = 'build';
export const BUNDLE_FOLDER = '_bundle';
export const BUNDLE_FILENAME = 'app.js';
export const TMP_INPUT_FOLDER = '.tmp_input';
export const TMP_OUTPUT_FOLDER = '.tmp_output';
export const MAIN_TIMER_ID = 'Build time';
export const YFM_CONFIG_FILENAME = '.yfm';
export const REDIRECTS_FILENAME = 'redirects.yaml';
export const LINT_CONFIG_FILENAME = '.yfmlint';
export const SINGLE_PAGE_FILENAME = 'single-page.html';
export const SINGLE_PAGE_DATA_FILENAME = 'single-page.json';
export const CUSTOM_STYLE = 'custom-style';

export enum Stage {
    NEW = 'new',
    PREVIEW = 'preview',
    TECH_PREVIEW = 'tech-preview',
    SKIP = 'skip',
}

export enum Lang {
    RU = 'ru',
    EN = 'en',
}

export enum Platforms {
    WINDOWS = 'win32',
    MAC = 'darwin',
    LINUX = 'linux',
}

export enum IncludeMode {
    ROOT_MERGE = 'root_merge',
    MERGE = 'merge',
    LINK = 'link'
}

export enum ResourceType {
    style = 'style',
    script = 'script',
}

export const BUILD_FOLDER_PATH = dirname(process.mainModule?.filename || '');

export const YFM_PLUGINS = [
    meta,
    deflist,
    includes,
    cut,
    links,
    images,
    notes,
    anchors,
    tabs,
    code,
    imsize,
    sup,
    video,
    monospace,
    table,
    term,
    openapiSandbox,
    mermaid.transform(),
];

export const PROCESSING_FINISHED = 'Processing finished:';
export const LINTING_FINISHED = 'Linting finished:';
export const GETTING_ALL_CONTRIBUTORS = 'Getting all contributors.';
export const ALL_CONTRIBUTORS_RECEIVED = 'All contributors received.';
export const getMsgСonfigurationMustBeProvided =
    (repo: string) => `Сonfiguration must be provided for ${repo} like env variables or in .yfm file`;

export const FIRST_COMMIT_FROM_ROBOT_IN_GITHUB = '2dce14271359cd20d7e874956d604de087560cf4';

// Include example: 'master\n' or 'nanov94/QUEUE-1234_some_branch_name.1.2.3\n'
// Regexp result: 'master' or 'nanov94/QUEUE-1234_some_branch_name'
export const REGEXP_BRANCH_NAME = /([\d\w\-_/.]+)(?=\r?\n)/g;

// Include example: {% include [createfolder](create-folder.md) %}
// Regexp result: [createfolder](create-folder.md)
export const REGEXP_INCLUDE_CONTENTS = /(?<=[{%]\sinclude\s).+(?=\s[%}])/gm;

// Include example: [createfolder](create-folder.md)
// Regexp result: create-folder.md
export const REGEXP_INCLUDE_FILE_PATH = /(?<=[(]).+(?=[)])/g;

// Include example: author: authorLogin
// Regexp result: authorLogin
export const REGEXP_AUTHOR = /(?<=author:\s).+(?=\r?\n)/g;

export const MIN_CHUNK_SIZE = Number(process.env.MIN_CHUNK_SIZE) || 1000;
export const WORKERS_COUNT = Number(process.env.WORKERS_COUNT) || (os.cpus().length - 1);

export const metadataBorder = '---';
