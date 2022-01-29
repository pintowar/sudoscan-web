import net.researchgate.release.GitAdapter.GitConfig
import net.researchgate.release.ReleaseExtension
import java.io.File

fun ReleaseExtension.git(configure: GitConfig.() -> Unit) = (getProperty("git") as GitConfig).configure()

fun String.executeCommand(workingDir: File): String {
    val proc = ProcessBuilder(this.split("\\s".toRegex()))
        .directory(workingDir)
        .redirectOutput(ProcessBuilder.Redirect.PIPE)
        .redirectError(ProcessBuilder.Redirect.PIPE)
        .start()

    proc.waitFor()
    return proc.inputStream.bufferedReader().readText()
}