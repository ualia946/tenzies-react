import "../styles/Die.css"

/**
 * Die component — represents a single die in the game.
 * 
 * Props:
 * - value (Number): The number shown on the die (1 to 6).
 * - isHeld (Boolean): Whether the die is "frozen" by the player.
 * - id (Number): Unique identifier for the die.
 * - holdFunction (Function): Callback function to toggle the die's held state.
 * 
 * Accessibility:
 * - `aria-label`: Describes the die's value and status for screen readers.
 * - `aria-pressed`: Indicates whether the die is in a "pressed" (held) state.
 * 
 * Behavior:
 * - When clicked, calls `holdFunction` with the die's `id` to toggle `isHeld`.
 * - Visual style is conditionally applied via className based on `isHeld`.
 */
export default function Die(props) {
  return (
    <button
      onClick={() => props.holdFunction(props.id)}
      className={props.isHeld ? "dice-held" : "dice-not-held"}
      aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
      aria-pressed={props.isHeld}
    >
      {props.value}
    </button>
  )
}
