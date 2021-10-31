plugins {
    id("sudoscan.kotlin-base")
    id("net.researchgate.release")
}

allprojects {
    group = "com.github.pintowar"
//    javacppPlatform = "linux-x86_64,macosx-x86_64,windows-x86_64"
}

tasks {
    register<JacocoReport>("codeCoverageReport") {
        group = "verification"
        description = "Run tests and merge all jacoco reports"

        val codeCoverageTask = this
        // If a subproject applies the 'jacoco' plugin, add the result it to the report
        subprojects {
            val subproject = this
            subproject.plugins.withType<JacocoPlugin>().configureEach {
                val extensions = subproject.tasks.matching { it.extensions.findByType<JacocoTaskExtension>() != null }
                extensions.forEach { codeCoverageTask.dependsOn(it) }

                extensions.configureEach {
                    val testTask = this
                    sourceSets(subproject.sourceSets.main.get())
                    executionData(testTask)
                }
            }
        }

        reports {
            xml.required.set(true)
            html.required.set(true)
            csv.required.set(true)
        }
    }

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
        dependsOn(":sudoscan-webserver:build")
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
            copy {
                from(project(":sudoscan-webclient").buildDir.absolutePath)
                into("${project(":sudoscan-webserver").buildDir}/resources/main/public")
            }
        }
    }
}

release {
    tagTemplate = "v\$version"

    git {
        requireBranch = "master"
        signTag = true
    }
}