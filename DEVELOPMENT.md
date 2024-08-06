## Development

> [!NOTE]
> This project uses `yarn`,[^1] not `npm`. Don't use any `npm` commands for this project.
>
> If you don't already have `yarn` installed, run `npm i -g yarn` to install it.
>
> Also note that updating the `main` branch does not automatically trigger a release into production (i.e. the `production` branch getting updated).

### Project setup

First, install the project's dependencies.

```shell
$ yarn install
```

Next, build the `crochet-stitcher` library. This needs to be done whenever a change is made to the library, so that the frontend can use the latest version of the library.

```shell
$ cd crochet-stitcher
$ yarn build
```

### Running tests

You can run the unit tests for the crochet-stitcher library with:

```shell
$ cd crochet-stitcher
$ yarn test
```

### Development server

To run the development server for the frontend:

```shell
$ cd crochetcraft
$ yarn dev
```

[^1]: Isn't that fitting?
