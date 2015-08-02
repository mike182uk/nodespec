#Contributing

Contributions are **welcome** and will be fully **credited**.

Contributions can be made via a Pull Request on [Github](https://github.com/mike182uk/nodespec).

##Pull requests

- **[Node coding style](https://github.com/felixge/node-style-guide)** - [JSCS](http://jscs.info/). Make sure you run `npm run cs` before committing your code.

- **Add specs where appropriate** - [Jasmine](http://jasmine.github.io)

- **Add examples for new features** - [Cucumber](https://github.com/cucumber/cucumber-js)

- **Document any change in behavior** - Make sure the README and any other relevant documentation are kept up-to-date.

- **Create topic branches** - i.e `feature/some-awesome-feature`.

- **One pull request per feature**

- **Send coherent history** - Make sure each individual commit in your pull request is meaningful. If you had to make multiple intermediate commits while developing, please squash them before submitting.

##Running specs

```bash
npm run specs
```

##Running examples

```bash
npm run examples
```

##Running everything (specs, examples, code style)

```bash
npm run all
```
