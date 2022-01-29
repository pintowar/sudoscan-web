plugins {
    id("sudoscan.kotlin-base")
    id("net.researchgate.release")
}

allprojects {
    group = "com.github.pintowar"
//    javacppPlatform = "linux-x86_64,macosx-x86_64,windows-x86_64"
}

tasks {
    register("stage") {
        dependsOn(":sudoscan-webserver:shadowJar")
        group = "build"
        description = "Heroku task"
        doLast {
            val finalJar = "sudoscan-webserver-app-linux-x86_64-all.jar"
            ant.withGroovyBuilder {
                "move"(
                    "file" to "${project(":sudoscan-webserver").buildDir}/libs/$finalJar",
                    "todir" to "$rootDir/build/"
                )
            }
            delete("${project(":sudoscan-webclient").projectDir}/node_modules")
        }
    }

    register("assembleWebApp") {
        dependsOn(":sudoscan-webserver:shadowJar")
        group = "build"
        description = "Build web app"
        doLast {
            copy {
                from(files("${project(":sudoscan-webserver").buildDir}/libs/")) {
                    include("*-all.jar")
                }
                into("$rootDir/build/")
            }

            logger.quiet("JAR generated at $rootDir/build/. It combines the server and client projects.")
        }
    }

    register("copyClientResources") {
        dependsOn(":sudoscan-webclient:build")
        group = "build"
        description = "Copy client resources into server"
        doLast {
            val origin = project(":sudoscan-webclient").buildDir.absolutePath
            val dest = "${project(":sudoscan-webserver").buildDir.absolutePath}/resources/main/public"
            logger.quiet("Cli Resources: copy from $origin to $dest")
            mkdir(dest)
            copy {
                from(origin)
                into(dest)
            }
        }
    }
}

release {
    tagTemplate = "v\$version"

    git {
        requireBranch = "master"
    }
}