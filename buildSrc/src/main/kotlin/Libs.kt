import org.gradle.api.artifacts.dsl.DependencyHandler

object Libs {

    object Kotlin {
        private const val vKLogging = "2.0.10"
        const val bom = "org.jetbrains.kotlin:kotlin-bom"
        const val reflect = "org.jetbrains.kotlin:kotlin-reflect"
        const val jdk8 = "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
        const val logging = "io.github.microutils:kotlin-logging-jvm:$vKLogging"
    }

    object Kotest {
        private const val vKotest = "4.6.3"

        const val junit = "io.kotest:kotest-runner-junit5-jvm:$vKotest"
        const val assertionsCore = "io.kotest:kotest-assertions-core-jvm:$vKotest"
        const val assertionsJson = "io.kotest:kotest-assertions-json-jvm:$vKotest"
    }

    object Mockk {
        private const val vMockk = "1.12.0"
        const val mockk = "io.mockk:mockk:$vMockk"
    }

    object LogBack {
        private const val vLogback = "1.2.3"
        const val logback = "ch.qos.logback:logback-classic:$vLogback"
    }

    object Micronaut {
        const val openApi = "io.micronaut.openapi:micronaut-openapi"

        const val swagger = "io.swagger.core.v3:swagger-annotations"
        const val kotlinJackson = "com.fasterxml.jackson.module:jackson-module-kotlin"
        const val annotationApi = "javax.annotation:javax.annotation-api"

        const val micronautKotlinRuntime = "io.micronaut.kotlin:micronaut-kotlin-runtime"
        const val graalvm = "org.graalvm.nativeimage:svm"

        fun DependencyHandler.implementMicronautWeb() {
            add("kapt", openApi)

            add("implementation", micronautKotlinRuntime)
            add("implementation", swagger)
            add("implementation", annotationApi)

            add("compileOnly", graalvm)
            add("runtimeOnly", kotlinJackson)
        }
    }

    object AwtColorFactory {
        private const val vAwtColorFactory = "1.0.2"
        const val awtColorFactory = "org.beryx:awt-color-factory:$vAwtColorFactory"

        fun DependencyHandler.implementAwtColorFactory() {
            add("implementation", awtColorFactory)
        }
    }

    object Sudoscan {
        private const val vSudoscan = "0.9.3"

        const val sudoscanSolverChoco = "com.github.pintowar:sudoscan-solver-choco:$vSudoscan"
        const val sudoscanSolverOjalgo = "com.github.pintowar:sudoscan-solver-ojalgo:$vSudoscan"
        const val sudoscanRecognizerDjl = "com.github.pintowar:sudoscan-recognizer-djl:$vSudoscan"
        const val sudoscanRecognizerDl4j = "com.github.pintowar:sudoscan-recognizer-dl4j:$vSudoscan"

        fun DependencyHandler.implementSudoscan(isDjl: Boolean, isOjalgo: Boolean) {
            add("implementation", if (isOjalgo) sudoscanSolverOjalgo else sudoscanSolverChoco)
            add("implementation", if (isDjl) sudoscanRecognizerDjl else sudoscanRecognizerDl4j)
        }
    }

}