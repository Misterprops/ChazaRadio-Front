import logo from "/Icecast_logo.png"
export const Emisora_main = () => {
    return (
        <>
            <div className="flex flex-col items-center w-1/1 h-3/10">
                <img src={logo} className="h-1/1 w-1/10" />
                <p>Radio powered by Icecast</p>
                <>▶︎ ▐▐</>
            </div>
            <p className="h-2/10"></p>
            <div className="flex flex-col w-1/1 h-3/10">
                <p>Visita tambien nuestros podcasts</p>
                <div className="flex justify-around h-1/1">
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5 h-1/1"></iframe>
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5 h-1/1"></iframe>
                    <iframe src="https://www.youtube.com/embed/4sMN6TukqNU" className="w-1/5 h-1/1"></iframe>
                </div>
            </div>
        </>
    );
}