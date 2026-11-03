// AQUI INICIALIZAMOS EL JUEGO

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game('game')
  const start = document.getElementById("start")
  
  start.addEventListener("click", () => {
    document.getElementById("canvas-container").style.display = "flex"
    document.getElementById("start-screen").style.display = "none"
    game.start()
  })
  const stop = document.getElementById("pause")
  stop.addEventListener("click", () => {
    game.stop()
  })

  const restart = document.getElementById("restart")
  restart.addEventListener("click", () => {
    game.restart()
  })

  const gameOver = document.getElementById("gameover")
  gameOver.addEventListener("click", () => {
    document.getElementById("gameover-screen").style.display = "none"
    document.getElementById("canvas-container").style.display = "flex"
    game.restart()
  })
})



// creamos un new Game con el ID del canvas porque en el constructor del game le pasamos el ID
// llamamos al metodo start del Game para que empeize el juego (renderizar los fps)