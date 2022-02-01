import net.researchgate.release.GitAdapter.GitConfig
import net.researchgate.release.ReleaseExtension
import java.io.BufferedReader
import java.io.File
import java.util.concurrent.TimeUnit

fun ReleaseExtension.git(configure: GitConfig.() -> Unit) = (getProperty("git") as GitConfig).configure()

fun String.runCommand(workingDir: File? = null): String {
    val process = ProcessBuilder(*split(" ").toTypedArray())
        .directory(workingDir)
        .start()
    if (!process.waitFor(10, TimeUnit.SECONDS)) {
        process.destroy()
        throw RuntimeException("execution timed out: $this")
    }
    if (process.exitValue() != 0) {
        throw RuntimeException("execution failed with code ${process.exitValue()}: $this")
    }
    return process.inputReader().readText()
}