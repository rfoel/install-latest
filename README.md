# install-latest

[![npm version](https://badge.fury.io/js/install-latest.svg)](https://www.npmjs.com/package/install-latest)
[![GitHub license](https://img.shields.io/github/license/rfoel/install-latest.svg)](https://github.com/rfoel/install-latest/blob/master/LICENSE) ![GitHub stars](https://img.shields.io/github/stars/rfoel/install-latest?style=social)

Does what it says, install the latest dependencies your package.json. 

I know one's not supposed to just dump the latest packages on a project but I find it useful sometimes when I want to get a clean install and work with the latest updates.

## Quick start

If none flag is passed, it will attempt to install all latest updates for all types of dependencies.

```
npx install-latest
```

You can also update only a specific type o dependency passing the following flags:
### Update only production dependencies

```
npx install-latest --prod
```

### Update only development dependencies

```
npx install-latest --dev
```

### Update only optional dependencies

```
npx install-latest --optional
```

### Update only peer dependencies

```
npx install-latest --peer
```

It is also possible to pass more than one flag at once like so:

```
npx install-latest --prod --dev
```

## Usage

```
Usage: index [options]

Does what it says, install latest dependencies from your package.json

Options:
  -V, --version  output the version number
  --prod         update only production dependencies
  --dev          update only development dependencies
  --optional     update only optional dependencies
  --peer         update only peer dependencies
  -h, --help     display help for command
```

## Contributing

Issues and pull requests are welcome.

## License

[MIT](https://github.com/rfoell/install-latest/blob/master/LICENSE)
