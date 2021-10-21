const fs = require('fs');
const path = require('path');
const util = require('util');
const htmlTagValidator = require('html-tag-validator');
const esprima = require('esprima');

const validate = util.promisify(htmlTagValidator);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const BASEDIR = path.join(
    __dirname, '..', 'public', 'js', 'plan', 'components');

const OPTIONS = {
    attributes: {'_': {mixed: /^params$/}}
};

(async () => {
    const files = await readdir(BASEDIR);
    const htmlFiles = files.filter(file => file.match(/\.html$/));
    for (const file of htmlFiles) {
        console.log(`Validating file ${file}.`);
        const content = await readFile(path.join(BASEDIR, file), 'utf8');
        const tree = await validate(content, OPTIONS);
        tree.document.forEach(walk);
    }
})().catch(err => console.log(err));

const walk = (element) => {
    /*
    if (element.type === 'comment') {
        throw new Error('File contains comments.');
    }*/
    if (element.attributes) {
        if (element.attributes['data-bind']) {
            checkExpr(element.attributes['data-bind']);
        }
        if (element.attributes['params']) {
            checkExpr(element.attributes['params']);
        }
    }
    if (Array.isArray(element.children)) {
        element.children.forEach(walk);
    } else if (element.children) {
        walk(element.children);
    }
};

const checkExpr = (expr) => {
    try {
        esprima.parseScript(`({${expr}})`);
    } catch (err) {
        console.log(`Invalid bind expression: ${expr}.`);
    }
};

