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
            val webCli = ":sudoscan-webclient"
            dependsOn("$webCli:build")

            doLast {
                val origin = project(webCli).buildDir.absolutePath
                val dest = "${project.buildDir.absolutePath}/resources/main/public"
                copy {
                    from(origin)
                    into(dest)
                }
                logger.quiet("Cli Resources: move from $origin to $dest")
            }
        }
    }
}

val hasDjl = project.hasProperty("djl")
val hasOjalgo = project.hasProperty("ojalgo")
dependencies {
    implementation(if (hasOjalgo) libs.sudoscan.solver.ojalgo else libs.sudoscan.solver.choco)
    implementation(if (hasDjl) libs.sudoscan.recognizer.djl else libs.sudoscan.recognizer.dl4j)

    kapt(libs.micronaut.openapi)
    implementation(libs.micronaut.kotlin)
    implementation(libs.swagger)
    implementation(libs.annotation.api)

    compileOnly(libs.graalvm)
    runtimeOnly(libs.jackson.kotlin)

    implementation(libs.awt.color.factory)
}

application {
    mainClass.set("com.github.pintowar.sudoscan.web.ApplicationKt")
}