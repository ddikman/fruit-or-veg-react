function getRandomFruit(skipFruits, fruits) {
  const remaining = fruits.filter((f) => skipFruits.find((skip) => skip.name === f.name) === undefined);
  return _.sample(remaining);
}

function GuessFruit(props) {
  const { fruit, onGuess } = props;

  const handleKeyPress = React.useCallback((event) => {
    // if left guess fruit if right guess vegetable
    if (event.keyCode === 37) {
      onGuess('Fruit');
    } else if (event.keyCode === 39) {
      onGuess('Vegetable');
    }
  }, [ onGuess ])

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyPress, false);
    return () => {
      document.removeEventListener("keyup", handleKeyPress, false);
    };
  }, [handleKeyPress]);

  return <div className="mt-4">
    <h2>Is <span className="badge rounded-pill text-bg-secondary">{fruit.name}</span> a fruit or vegetable?</h2>
    <div className="d-grid gap-4 d-sm-flex align-items-center mt-4">
      <button type="button" onClick={ () => onGuess('Fruit') } className="btn btn-outline-primary btn-lg d-flex gap-4 justify-content-center w-100"><i class="bi bi-arrow-left-circle"></i> Fruit</button>
      <span>or</span>
      <button type="button" onClick={() => onGuess('Vegetable') } className="btn btn-outline-primary btn-lg d-flex gap-4 justify-content-center w-100">Vegetable <i class="bi bi-arrow-right-circle"></i> </button>
    </div>
  </div>
}

function ShowResult(props) {
  const { result } = props;

  if (result) {
    return <p>You got it <span className="badge rounded-pill text-bg-success">right</span>!</p>
  }
  return <p>No, that's <span className="badge rounded-pill text-bg-danger">wrong</span>!</p>
}

function ShowStats(props) {
  const { wins, fails } = props.stats

  return <div className="mt-4">
    <h2>Stats</h2>
    <div className="d-flex justify-content-center gap-4">
      <h2><span className="badge rounded-pill text-bg-success">{wins} wins</span></h2>
      <h2><span className="badge rounded-pill text-bg-danger">{fails} fails</span></h2>
    </div>
  </div>
}

let fruits = []
let playedFruit = []

export function App() {
  const [ games, setGames ] = React.useState({ wins: 0, fails: 0 })
  const [ result, setResult ] = React.useState(null)
  const [ currentFruit, setCurrentFruit ] = React.useState(null);
  React.useEffect(async () => {
    fruits = await fetch("./data.json").then((response) => response.json());
    setCurrentFruit(getRandomFruit([], fruits));
  }, []);

  const onGuess = React.useCallback((guess) => {

    playedFruit.push(currentFruit);
    if (playedFruit.length === fruits.length) {
      playedFruit = [];
    }

    const isWin = guess === currentFruit.type
    setGames({ wins: games.wins + (isWin ? 1 : 0), fails: games.fails + (isWin ? 0 : 1) } )
    setResult(isWin);
    setCurrentFruit(getRandomFruit(playedFruit, fruits));
  }, [games, currentFruit]);

  return <div className="px-4 py-5 my-5 text-center">
    <h1 className="display-5 fw-bold text-body-emphasis">Fruit or Vegetable</h1>
    { result !== null && <ShowResult result={result} /> }
    { currentFruit && <div>
      <GuessFruit onGuess={onGuess} fruit={currentFruit} />
    </div> }
    { (games.wins > 0 || games.fails > 0) && <ShowStats stats={games} /> }
    <div class="mt-4">
      Pro-tip: You can use the left and right arrow keys to guess.
    </div>
  </div>;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);