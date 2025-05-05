import { useState, useEffect, useRef } from 'react'
import './styles/App.css'
import Die from './components/Die.jsx'
import confetti from 'canvas-confetti'

/**
 * App.jsx
 * 
 * Main component for the Tenzies game built in React.
 * 
 * This file manages the entire game state, including dice generation, user interaction,
 * game logic (win/lose conditions), and UI rendering. The game tracks the number of rolls,
 * allows users to "hold" specific dice, and provides feedback on performance via color cues
 * and accessibility features. A confetti effect is triggered upon winning.
 * 
 * Key Features:
 * - Imperative win-checking logic using a loop (to demonstrate algorithmic thinking)
 * - Visual and accessible feedback (color, aria-live, focus management)
 * - Conditional rendering for win and loss states
 * - Clean separation of logic and presentation
 */


function App() {
  // 🎲 Generates an array of 10 dice, each with a random value between 1 and 6 and initially not held
  function generateAllNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push({
        id: i + 1,
        value: Math.floor(Math.random() * 6) + 1,
        isHeld: false
      })
    }
    return newDice
  }

  // 🔄 Main state variables
  const [dice, setDice] = useState(() => generateAllNewDice())
  const [count, setCount] = useState(0)
  const [newGame, setNewGame] = useState(false)

  // 🧭 Ref to focus the "New Game" button when the game ends
  const buttonRef = useRef(null)

  // 🧠 Game-ending logic: either win (all dice held & same value) or lose (count > 25)
  useEffect(() => {
    // ❌ Lose condition
    if (count > 25) {
      setNewGame(true)
      return
    }

    // ✅ Win condition (imperative logic using loop)
    let j = 1
    for (let i = 0; i < dice.length; i++) {
      if (!dice[i].isHeld || dice[i].value !== dice[j].value) return
      if (j < dice.length - 1) j++
    }

    setNewGame(true)

    // 🎉 Confetti animation triggered on win
    confetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      origin: { x: 0.5, y: 0.5 }
    })
  }, [dice, count])

  // 🔁 Auto-focus "New Game" button on win or lose
  useEffect(() => {
    if (newGame) buttonRef.current.focus()
  }, [newGame])

  // 🖱️ Toggles the `isHeld` state of a die when clicked
  function hold(id) {
    setDice(prevDice =>
      prevDice.map(diceObj =>
        diceObj.id === id
          ? { ...diceObj, isHeld: !diceObj.isHeld }
          : diceObj
      )
    )
  }

  // ➕ Increments the roll counter
  function rollCounts() {
    setCount(prevCount => prevCount + 1)
  }

  // 🎲 Re-rolls only dice that are not held
  function rollDice() {
    setDice(prevDice =>
      prevDice.map(diceObj =>
        diceObj.isHeld
          ? diceObj
          : { ...diceObj, value: Math.floor(Math.random() * 6) + 1 }
      )
    )
  }

  // 🔄 Resets the game to initial state
  function resetGame() {
    setDice(generateAllNewDice())
    setCount(0)
    setNewGame(false)
  }

  // 🧱 Dynamically renders the 10 Die components
  const diceValues = dice.map(dieObj => (
    <Die
      key={dieObj.id}
      id={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      holdFunction={hold}
    />
  ))

  // 🎨 Determines the color of the counter based on performance
  let colorCount = "green"
  if (count > 10) colorCount = "yellow"
  if (count > 20) colorCount = "red"

  return (
    <main>
      {count <= 25 ? (
        <>
          {/* 📣 Screen reader message on win */}
          <div aria-live='polite' className='sr-only'>
            {newGame && <p>Congratulations! You won! Press "New game" to start again</p>}
          </div>

          <h1>Tenzies</h1>

          <p className="instructions">
            Roll until all are the same. Click each die to freeze it at its current value between rolls.
          </p>

          <div className="dice-container">
            {diceValues}
          </div>

          <div className="roll-container">
            {!newGame ? (
              <button
                className="roll"
                onClick={() => {
                  rollDice()
                  rollCounts()
                }}
              >
                Roll
              </button>
            ) : (
              <button className="roll" onClick={resetGame} ref={buttonRef}>
                New Game
              </button>
            )}
          </div>

          <span className="counter">
            Roll Counter: <count className={colorCount}>{count}</count>
          </span>
        </>
      ) : (
        <>
          {/* 📣 Screen reader message on lose */}
          <div aria-live='polite' className='sr-only'>
            {newGame && <p>Game over! You lost! Press "New game" to try again</p>}
          </div>

          <h1>GAME OVER!</h1>

          <div className="roll-container">
            <button className="roll" onClick={resetGame} ref={buttonRef}>
              New Game
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default App
