import { createSignal, createMemo, Show, Index, Switch, Match, For } from 'solid-js';
import './app.css';
import Fireworks from '@fireworks-js/solid';
import Photo from './components/Photo';
import crossImg from './assets/cross.svg';
import noughtImg from './assets/nought.svg';
import starImg from './assets/star.svg';

export default function App () {
  // CONSTANTS
  const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const characters = [`river`, `bobby`, `kiki`, `lavender`, `ethan`, `charlotte`, `barbie`, `wonka`, `donatello`];
  const emptyCheckBoard = Array.from({ length: 9 }, () => ``);

  // STATE
  const [characterSelection, setCharacterSelection] = createSignal(true);
  const [playerA, setPlayerA] = createSignal(null);
  const [playerB, setPlayerB] = createSignal(null);
  const [winner, setWinner] = createSignal(null);
  const [playing, setPlaying] = createSignal(true);
  const [checks, setChecks] = createSignal(emptyCheckBoard);
  const [turn, setTurn] = createSignal(0);
  const isPlayerATurn = createMemo(() => turn() % 2 === 0);

  let debounce = false;
  setInterval(() => debounce = false, 150);


  window.onmousemove = e => {
    if (debounce) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const star = document.createElement(`img`);
    star.classList.add(`star`);
    star.src = starImg;
    star.style.left = `${x * 100}%`;
    star.style.top = `${y * 100}%`;
    document.body.appendChild(star);
    debounce = true;

    setTimeout(() => document.body.removeChild(star), 1000);
  };

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
    setChecks(emptyCheckBoard);
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
          <Fireworks class="fireworks" />
        </Show>
      }>
        {/* Character Selection */}
        <Match when={characterSelection()}>
          <h2 class="subheading">
            Player {!playerA() ? `A` : `B`} - Select your character!
          </h2>

          <div class="player-grid">
            <For each={characters}>{player =>
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
          <h2 class="subheading capitalise">
            {isPlayerATurn() ? playerA() : playerB()}'s Turn
          </h2>
          <section class="game-wrapper">
            <aside class="player-photo-wrapper">
              <Photo
                size="200"
                name={playerA()}
                class="player-photo"
              />
              <img
                src={noughtImg}
                classList={{ 'current-turn': isPlayerATurn() }}
                class="player-icon left"
                height="50"
                width="50"
              />
            </aside>
            <fieldset class="game">
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
            <aside class="player-photo-wrapper">
              <Photo
                size="200"
                name={playerB()}
                class="player-photo"
              />
              <img
                src={crossImg}
                classList={{ 'current-turn': !isPlayerATurn() }}
                class="player-icon right"
                height="50"
                width="50"
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

      <Show when={!characterSelection() && !winner()}>
        <button
          class="switch-button"
          onClick={resetCharacters}
        >
          <img src={rotateImg} height="25" width="25" />
        </button>
      </Show>
    </>
  );
}
