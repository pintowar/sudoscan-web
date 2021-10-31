# SudoScan Web

Scan and Solve Sudoku Puzzles Web Version

## Project Info

This is a toy project for educational purpose.
I usually use this project to explore some JVM/Kotlin libs, new Gradle features/plugins,
AI libs and CI pipes (using github actions).

### Deploying on Heroku

To get your own Sudoscan Web App running on Heroku, click the button below and fill out the form:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pintowar/sudoscan-web)

### Running with Docker

Thanks to GraamVM and Micronaut, it's possible to use the native version of this app using docker. To try it, just run:

`docker run -p 8080:8080 pintowar/sudoscan-web`

After the application is running, it can be accessed using the browser at `http://localhost:8080`.

### Project Modules

The project was broken into the following modules (using java SPI):

* sudoscan-webclient: Web client UI using React js + Typescript + Tailwind;
* sudoscan-webserver: Webserver using Micronaut framework + Sudoscan lib.

## Building Project

To build the fat jar version of the app, run the following command:

`gradle -PjavacppPlatform=linux-x86_64,macosx-x86_64,windows-x86_64 clean assembleWebApp`

The command above will build a fat jar containing the native dependencies of all informed platforms. 
To build a more optimized jar, just inform the desired platform, for instance: 

`gradle -PjavacppPlatform=linux-x86_64 clean assembleWebApp`

It is also possible to chose in compile time, which solver/recognizer module to use. The commands above (by default)
will generate a jar using **sudoscan-solver-choco** and **sudoscan-recognizer-dl4j** as the main solver and recognizer.
To use **sudoscan-solver-ojalgo** and **sudoscan-recognizer-djl** as solver and recognizer components,
run the following command:

`gradle -Pojalgo -Pdjl -PjavacppPlatform=macosx-x86_64 clean assembleWebApp`