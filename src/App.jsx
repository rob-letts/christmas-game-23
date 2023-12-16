import { For, createSignal } from 'solid-js';
import './App.css';

function App () {
  const [isNoughtsTurn, setIsNoughtsTurn] = createSignal(true);
  const [checks, setChecks] = createSignal(Array.from({ length: 9 }, () => ``));

  function change (index) {
    setChecks(checks().map((check, i) =>
      i === index
        ? isNoughtsTurn()
          ? `nought`
          : `cross`
        : check
    ));
    setIsNoughtsTurn(!isNoughtsTurn());
  }

  return (
    <>
      <header>
        <h1 class="title">Merry Christmas River</h1>
      </header>
      <fieldset>
        <legend class="turn-info">
          {isNoughtsTurn() ? `Noughts` : `Crosses`} turn
        </legend>
        <div class="checkbox-grid">
          <For each={checks()}>
            {(check, i) =>
              <>
                <input
                  type="checkbox"
                  id={i()}
                  onClick={() => change(i())}
                />
                <label
                  class={checks()[i()]}
                  for={i()}
                />
              </>
            }
          </For>
        </div>
      </fieldset>
    </>
  );
}

export default App;
