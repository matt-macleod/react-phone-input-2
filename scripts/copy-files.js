const fs = require('fs-extra');
const path = require('path');
const { omit, merge } = require('ramda');

const rootPath = path.join(__dirname, '../');
const buildPath = path.join(rootPath, 'dist');

const privatePkgPath = path.join(rootPath, 'package.json');
const publishablePkgPath = path.join(buildPath, 'package.json');

const getPackageJson = () =>
  new Promise((resolve) =>
    fs.readFile(privatePkgPath, 'utf8', (error, data) => {
      if (error) throw error;
      resolve(JSON.parse(data));
    }),
  );

const writePackageJson = (data) =>
  new Promise((resolve) =>
    fs.writeFile(
      publishablePkgPath,
      JSON.stringify(data, null, 2),
      (error) => {
        if (error) throw error;
        resolve();
      },
    ),
  );

const createPackageJson = () =>
  getPackageJson()
    .then((privatePkg) =>
      merge(
        omit(
          [
            'devDependencies',
            'babel',
            'publishConfig',
            'private',
            'babel',
            'scripts',
            'jest',
            'eslintConfig',
          ],
          privatePkg,
        ),
        {
          name: '@slice/react-phone-input',
          main: 'index.js',
          module: 'index.mjs',
        },
      ),
    )
    .then(writePackageJson);

createPackageJson().then(() => console.log('All files copied'));
