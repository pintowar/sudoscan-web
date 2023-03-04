# SudoScan Web
![master status](https://github.com/pintowar/sudoscan-web/actions/workflows/gradle_master.yml/badge.svg?branch=master)

![develop status](https://github.com/pintowar/sudoscan-web/actions/workflows/gradle_develop.yml/badge.svg?branch=develop)

![GitHub tag (latest)](https://img.shields.io/github/v/tag/pintowar/sudoscan-web)
![GitHub license](https://img.shields.io/github/license/pintowar/sudoscan-web)
Scan and Solve Sudoku Puzzles Web Version

## Project Info

This is a web version of the [Sudoscan Project](https://github.com/pintowar/sudoscan).
The main engine uses Sudoscan's libs on the server side while a Typescript/React client uses webcam + websockets 
to solve Sudoku Puzzles given a Puzzle image.  

This is a toy project for educational purpose.
I usually use this project to explore some JVM/Kotlin libs, new Gradle features/plugins,
AI libs and CI pipes (using github actions).

### Running with Docker

For a quick view of the application in action, run the following command:

`docker run -p 8080:8080 pintowar/sudoscan-web`

After the application is running, it can be accessed using the browser at `http://localhost:8080`.

### Project Modules

The project was broken into the following modules (using java SPI):

* sudoscan-webclient: Web client UI using React js + Typescript + Tailwind;
* sudoscan-webserver: Webserver using Micronaut framework + Sudoscan lib.

## Building Project

This project uses dependencies from the [sudoscan project](https://github.com/pintowar/sudoscan) sub-modules. Those dependencies are hosted on Github Packages. In order to make gradle be able to download them, add these lines to `$HOME/.gradle/gradle.properties` (create the file if it doesn't exist):

```properties
gpr.user=github_user
gpr.pass=github_token
```

To build the fat jar version of the app, run the following command:

`gradle -Pweb-cli -PjavacppPlatform=linux-x86_64,macosx-x86_64,windows-x86_64 clean assembleWebApp`

The command above will build a fat jar containing the native dependencies of all informed platforms. The `web-cli` param tells gradle to add the minified client generated on **sudoscan-webclient** sub-module.
To build a more optimized jar, just inform the desired platform, for instance: 

`gradle -Pweb-cli -PjavacppPlatform=linux-x86_64 clean assembleWebApp`

It is also possible to chose in compile time, which solver/recognizer module to use. The commands above (by default)
will generate a jar using **sudoscan-solver-choco** and **sudoscan-recognizer-djl** as the main solver and recognizer.
To use **sudoscan-solver-ojalgo** and **sudoscan-recognizer-dl4j** as solver and recognizer components,
run the following command:

`gradle -Pweb-cli -Pojalgo -Pdl4j -PjavacppPlatform=macosx-x86_64 clean assembleWebApp`