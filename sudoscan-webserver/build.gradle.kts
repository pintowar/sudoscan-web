import Libs.AwtColorFactory.implementAwtColorFactory
import Libs.Micronaut.implementMicronautWeb
import Libs.Sudoscan.implementSudoscan

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
    nativeImage {
        args("--verbose", "-H:IncludeResources=\"logback.xml|application.yml|public/*.*\"")
        imageName.set("sudoscan-web-server")
    }

    processResources {
        if (project.hasProperty("web-cli")) {
            dependsOn(":copyClientResources")
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