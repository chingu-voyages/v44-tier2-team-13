import Grid from "./components/Grid";

function App() {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <Grid cellSize={64} />
        </div>
    );
}

export default App;
