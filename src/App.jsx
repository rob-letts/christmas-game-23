import { createSignal, createMemo, Show, Index, Switch, Match, For } from 'solid-js';
import './app.css';
import Photo from './components/Photo';

export default function App () {
  // CONSTANTS
  const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const players = [`river`, `bobby`, `kiki`, `lavender`, `ethan`, `charlotte`, `barbie`, `wonka`, `donatello`];

  // STATE
  const [characterSelection, setCharacterSelection] = createSignal(true);
  const [playerA, setPlayerA] = createSignal(null);
  const [playerB, setPlayerB] = createSignal(null);
  const [winner, setWinner] = createSignal(null);
  const [playing, setPlaying] = createSignal(true);
  const [checks, setChecks] = createSignal(Array.from({ length: 9 }, () => ``));
  const [turn, setTurn] = createSignal(0);
  const isPlayerATurn = createMemo(() => turn() % 2 === 0);

  // GAME LOGIC
  function resetCharacters () {
    setCharacterSelection(true);
    setPlayerA(null);
    setPlayerB(null);
    resetGameState();
  }

  function selectCharacter (player) {
    if (!playerA()) {
      setPlayerA(player);
    } else if (player !== playerA()) {
      setPlayerB(player);
    }

    if (playerA() && playerB()) setCharacterSelection(false);
  }

  function changeTurn () {
    setTurn(turn() + 1);
    if (turn() > 8) setPlaying(false);
  }

  function checkForWin (index) {
    const symbol = checks().at(index);

    const playerWon = winConditions.some(condition => {
      return condition.every(index => checks().at(index) === symbol);
    });

    if (playerWon) declareWinner();
  }

  function declareWinner () {
    setWinner(isPlayerATurn() ? playerA() : playerB());
    setPlaying(false);
  }

  function updateGameState (index) {
    setChecks(checks().toSpliced(index, 1, isPlayerATurn() ? `nought` : `cross`));
    if (turn() >= 4) checkForWin(index);
    changeTurn();
  }

  function resetGameState () {
    setPlaying(true);
    setTurn(0);
    setChecks(Array.from({ length: 9 }, () => ``));
    setWinner(null);
  }

  return (
    <>
      <header>
        <h1 class="title">
          <span>Merry Christmas</span>
          <span class="barbie">River</span>
        </h1>
      </header>

      <Switch fallback={
        // GAME RESULT
        <Show when={winner()} fallback={
          <>
            <h2 class="result">It's a tie!</h2>
            <div class="tie-wrapper">
              <Photo
                size="200"
                name={playerA()}
                class="player-photo current-turn winning-photo"
              />
              <Photo
                size="200"
                name={playerB()}
                class="player-photo current-turn winning-photo"
              />
            </div>
          </>
        }>
          <h2 class="result capitalise">
            {`${winner()} wins!`}
          </h2>

          <Photo
            size="200"
            name={winner()}
            class="player-photo current-turn winning-photo"
          />
        </Show>
      }>
        {/* Character Selection */}
        <Match when={characterSelection()}>
          <h2 class="subheading">
            Player {!playerA() ? `A` : `B`} - Select your character!
          </h2>

          <div class="player-grid">
            <For each={players}>{player =>
              <button
                onClick={() => selectCharacter(player)}
                classList={{selected: player === playerA()}}
                class="player-selection-button"
              >
                <Photo
                  name={player}
                  size="150"
                />
              </button>
            }</For>
          </div>
        </Match>

        {/* Playing Game */}
        <Match when={playing()}>
          <section class="game-wrapper">
            <aside>
              <h3 class="player-name capitalise">{playerA()}</h3>
              <Photo
                size="200"
                name={playerA()}
                class={`player-photo ${isPlayerATurn() ? `current-turn` : ``}`}
              />
            </aside>
            <fieldset class="game">
              <legend class="game-legend capitalise">
                {isPlayerATurn() ? playerA() : playerB()}'s Turn
              </legend>

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
            <aside>
              <h3 class="player-name capitalise">{playerB()}</h3>
              <Photo
                size="200"
                name={playerB()}
                class={`player-photo ${!isPlayerATurn() ? `current-turn` : ``}`}
              />
            </aside>
          </section>
        </Match>
      </Switch>

      {/* Reset Game */}
      <Show when={!playing()}>
        <div class="reset-button-wrapper">
          <button
            class="reset-button"
            onClick={resetGameState}
          >
          Play Again?
          </button>
          <button
            class="reset-button"
            onClick={resetCharacters}
          >
          Change Characters?
          </button>
        </div>
      </Show>
    </>
  );
}