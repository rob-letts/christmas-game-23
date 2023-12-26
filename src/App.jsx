import { createSignal, createMemo, Show, Index } from 'solid-js';
import './App.css';

export default function App () {
  const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  const [playing, setPlaying] = createSignal(true);
  const [result, setResult] = createSignal(`It's a tie!`);
  const [checks, setChecks] = createSignal(Array.from({ length: 9 }, () => ``));
  const [turn, setTurn] = createSignal(0);
  const isNoughtsTurn = createMemo(() => turn() % 2 === 0);

  function changeTurn () {
    setTurn(turn() + 1);
    if (turn() > 8) setPlaying(false);
  }

  function checkForWin (index) {
    const symbol = checks().at(index);

    const playerWon = winConditions.some(condition => {
      return condition.every(index => checks().at(index) === symbol);
    });

    if (playerWon) declareWinner(symbol);
  }

  function declareWinner (symbol) {
    const name = symbol.charAt(0).toUpperCase() + symbol.slice(1);
    setResult(`${name} wins!`);
    setPlaying(false);
  }

  function updateGameState (index) {
    setChecks(checks().toSpliced(index, 1, isNoughtsTurn() ? `nought` : `cross`));
    if (turn() >= 4) checkForWin(index);
    changeTurn();
  }

  function resetGameState () {
    setPlaying(true);
    setResult(`It's a tie!`);
    setTurn(0);
    setChecks(Array.from({ length: 9 }, () => ``));
  }

  return (
    <>
      <header>
        <h1 class="title">
          <span>Merry Christmas</span>
          <span class="barbie">River</span>
        </h1>
      </header>

      <fieldset class="game">
        <Show
          when={playing()}
          fallback={<p class="result">{result()}</p>}
        >
          <legend class="current-turn">
            {isNoughtsTurn() ? `Noughts` : `Crosses`} turn
          </legend>
        </Show>
        <div class="checkbox-grid">
          <Index each={checks()}>
            {(_, index) =>
              <>
                <input
                  type="checkbox"
                  disabled={!playing()}
                  id={index}
                  onClick={() => updateGameState(index)}
                />
                <label
                  class={checks().at(index)}
                  for={index}
                />
              </>
            }
          </Index>
        </div>
      </fieldset>

      <Show when={!playing()}>
        <button
          class="reset-button"
          onClick={resetGameState}
        >
          Play again?
        </button>
      </Show>
    </>
  );
}