# install-latest

[![npm version](https://badge.fury.io/js/install-latest.svg)](https://www.npmjs.com/package/install-latest)
[![GitHub license](https://img.shields.io/github/license/rfoel/install-latest.svg)](https://github.com/rfoel/install-latest/blob/master/LICENSE) ![GitHub stars](https://img.shields.io/github/stars/rfoel/install-latest?style=social)

Does what it says, install the latest dependencies and devDependencies from your package.json.

I know one's not supposed to just dump the latest packages on a project but I find it useful sometimes when I want to get a clean install and work with the latest updates.

## Quick start

```
npx install-latest
```

Done.

### Install only production dependencies

```
npx install-latest -P
```

### Install only development dependencies

```
npx install-latest -D
```

## Usage

```
Usage: index [options]

Does what it says, install latest dependencies and devDependencies from your package.json

Options:
  -V, --version  output the version number
  -P, --prod     update only production dependencies
  -D, --dev      update only development dependencies
  -h, --help     display help for command
```

## Contributing

Issues and pull requests are welcome.

## License

[MIT](https://github.com/rfoell/install-latest/blob/master/LICENSE)
