import Libs.AwtColorFactory.implementAwtColorFactory
import Libs.Micronaut.implementMicronautWeb
import Libs.Sudoscan.implementSudoscan
import groovy.json.JsonOutput

plugins {
    id("sudoscan.kotlin-app")
    id("io.micronaut.application")
    id("com.github.johnrengelman.shadow")
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

    graalvmNative {
        binaries {
            named("main") {
                buildArgs("--verbose")
                imageName.set(baseName)
            }
        }
    }

    shadowJar {
        archiveFileName.set("$baseName-all.${archiveExtension.get()}")
        mergeServiceFiles()
    }

    val imagesTags = listOf(
        "pintowar/sudoscan-web:$version",
        "pintowar/sudoscan-web:latest"
    )

    dockerfile {
        baseImage("amd64/eclipse-temurin:17-jre-focal")
    }

    dockerBuild {
        images.set(imagesTags)
    }

    dockerPush {
        images.set(imagesTags)
        registryCredentials {
            username.set(project.findProperty("docker.user")?.toString() ?: System.getenv("DOCKER_USER"))
            password.set(project.findProperty("docker.pass")?.toString() ?: System.getenv("DOCKER_PASS"))
        }
    }

    if (project.hasProperty("web-cli")) {
        processResources {
            dependsOn(":copyClientResources")
        }
    }
}

val hasDjl = project.hasProperty("djl")
val hasOjalgo = project.hasProperty("ojalgo")
dependencies {
    implementSudoscan(hasDjl, hasOjalgo)
    implementMicronautWeb()

    implementAwtColorFactory()
}

application {
    mainClass.set("com.github.pintowar.sudoscan.web.ApplicationKt")
}