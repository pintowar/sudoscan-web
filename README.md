# SudoScan Web

Scan and Solve Sudoku Puzzles Web Version

## Project Info

This is a toy project for educational purpose.
I usually use this project to explore some JVM/Kotlin libs, new Gradle features/plugins,
AI libs and CI pipes (using github actions).

### Project Modules

The project was broken into the following modules (using java SPI):

* sudoscan-webclient: Web client UI using React js + Typescript + Tailwind;
* sudoscan-webserver: Webserver using Micronaut framework + Sudoscan lib.

## Building Project

To build the fat jar version of the app, run the following command:

`gradle -PjavacppPlatform=linux-x86_64,macosx-x86_64,windows-x86_64 clean assembleDesktopApp`

The command above will build a fat jar containing the native dependencies of all informed platforms. 
To build a more optimized jar, just inform the desired platform, for instance: 

`gradle -PjavacppPlatform=linux-x86_64 clean assembleWebApp`

This second command will build a smaller jar, but it will run only on linux-x86_64 platforms.

It is also possible to chose in compile time, which recognizer module to use. The commands above (by default) will 
generate a jar using **sudoscan-recognizer-dl4j** as the main recognizer. To use **sudoscan-recognizer-djl** as 
recognizer component, run the following command:

`gradle -Pdjl -PjavacppPlatform=macosx-x86_64 clean assembleWebApp`