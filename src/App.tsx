import Grid from "./components/Grid";
import Form from "./components/Form";

function App() {
    return (
        <div className="flex flex-col h-screen">
            <div className="text-2xl font-bold text-[#D4ADFC] font-Inter p-4 h-16 w-full bg-[#1D267D]">
                BooleBots
            </div>
            <div className="flex flex-1 items-center justify-evenly w-full h-4/5 bg-primary-900">
                <Form />
                <Grid cellSize={60} />
            </div>
        </div>
    );
}

export default App;
