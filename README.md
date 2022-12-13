# IBM CloudPak for Watson AIOps UI extension bundle tools

[![Build Status](https://travis-ci.com/IBM/cp4waiops-ui-bundle-tools.svg?branch=main)](https://app.travis-ci.com/github/IBM/cp4waiops-ui-bundle-tools)

## Scope
The purpose of this package is to make it easy to develop and deploy UI extension bundles
into IBM CloudPak for Watson AIOps.

## Usage
### As a NodeJS CLI tool
#### Pre-requisites:
1. [NodeJS v16](https://nodejs.org/en/)

#### Usage:
The tool can be run directly with npx:

```
npx cp4waiops-ui-bundle-tools --help
```

Or can be installed globally and then ran standalone:

```
npm install -g cp4waiops-ui-bundle-tools
aiops-ui --help
```

## Notes
If you have any questions or issues you can create a new [issue here](issues).

Pull requests are very welcome! Make sure your patches are well tested.
Ideally create a topic branch for every separate change you make. For
example:

1. Fork the repo
2. Create your feature branch (`git checkout -b my-name/my-new-feature`)
3. Commit your changes (`git commit -am 'feat: added some feature'`)
4. Push to the branch (`git push origin my-name/my-new-feature`)
5. Create new Pull Request
