import Libs.AwtColorFactory.implementAwtColorFactory
import Libs.Micronaut.implementMicronautWeb
import Libs.Sudoscan.implementSudoscan
import groovy.json.JsonOutput

plugins {
    id("sudoscan.kotlin-app")
    id("io.micronaut.application")
    id("com.github.johnrengelman.shadow")
//    id("com.google.cloud.tools.jib") version "2.8.0"
}

description = "Sudoscan Web Server"

micronaut {
    runtime("netty")
    testRuntime("kotest")
    processing {
        incremental(true)
        annotations("com.github.pintowar.sudoscan.web.*")
    }
}

tasks {
    val platform = project.properties["javacppPlatform"] ?: "multi"
    val baseName = "${project.name}-app-$platform"

    nativeImage {
        args("--verbose")
        imageName.set(baseName)
    }

    shadowJar {
        archiveFileName.set("$baseName-all.${archiveExtension.get()}")
        mergeServiceFiles()
    }

    dockerfileNative {
        graalVersion.set("21.2.0")
    }

    if (project.hasProperty("web-cli")) {
        processResources {
            dependsOn(":copyClientResources")
        }

        generateResourceConfigFile {
            val resourceConfig = this.outputDirectory.file("resource-config.json").get().asFile
            doLast {
                val content = groovy.json.JsonSlurper().parseText(resourceConfig.readText()) as Map<*, *>
                val webCliAssets = mapOf("pattern" to "public/*.*")
                val newContent = mapOf("resources" to (content["resources"] as List<*>) + webCliAssets)
                resourceConfig.writeText(JsonOutput.prettyPrint(JsonOutput.toJson(newContent)))

                logger.quiet("adding cli assets to resource-config.json")
            }
        }
    }

//    jib {
//        to {
//            image = "gcr.io/myapp/jib-image"
//        }
//    }
}

val hasDjl = project.hasProperty("djl")
dependencies {
    implementSudoscan(hasDjl)
    implementMicronautWeb()

    implementAwtColorFactory()
}

application {
    mainClass.set("com.github.pintowar.sudoscan.web.ApplicationKt")
}