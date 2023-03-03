package com.github.pintowar.sudoscan.web

import io.github.pintowar.sudoscan.api.engine.SudokuEngine
import io.github.pintowar.sudoscan.api.spi.Recognizer
import io.github.pintowar.sudoscan.api.spi.Solver
import io.micronaut.context.annotation.Context
import mu.KLogging

@Context
class SudokuService : KLogging() {

    private val solver = Solver.provider()
    private val recognizer = Recognizer.provider()
    private val engine = SudokuEngine(recognizer, solver)

    fun solve(sudoku: SudokuInfo): String {
        val bytes = sudoku.decode()
        val debugScale = if (sudoku.debug) 1.5 else 1.0
        val sol = engine.solveAndCombineSolution(
            bytes, sudoku.solutionColor(), sudoku.recognizerColor(), sudoku.extension(), debugScale
        )
        return sudoku.encode(sol)
    }

    fun info(): Map<String, String> = mapOf("solver" to solver.name, "recognizer" to recognizer.name)
}