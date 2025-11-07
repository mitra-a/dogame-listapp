import "./GameList.css";
import data from "../data/games.json";
import { useState } from "preact/hooks";

export default function GameList() {
    const RUANGAN = data.rooms;
    const GAMES = data.games.map((game) => {
        const gameRooms = RUANGAN.filter((room) =>
            room.games.includes(game.code)
        ).map((room) => room.name);

        return {
            ...game,
            rooms: gameRooms,
        };
    });

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [popupData, setPopupData] = useState(null);

    const FILTER_GAMES = function () {
        let gamesWithRooms = GAMES;
        if (category !== "all") {
            gamesWithRooms = gamesWithRooms.filter((game) =>
                game.rooms.includes(category)
            );
        }

        // Filter by search term
        if (search.trim() !== "") {
            const searchTerm = search.toLowerCase();
            gamesWithRooms = gamesWithRooms.filter(
                (game) =>
                    game.name.toLowerCase().includes(searchTerm) ||
                    game.code.toLowerCase().includes(searchTerm) ||
                    game.rooms.some((room) =>
                        room.toLowerCase().includes(searchTerm)
                    )
            );
        }

        return gamesWithRooms;
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearch("");
    };

    const handleCategoryChange = (categoryName) => {
        setCategory(categoryName);
    };

    const handleShowRooms = (game) => {
        setPopupData(game);
    };

    const handleClosePopup = () => {
        setPopupData(null);
    };

    return (
        <div className="shell">
            <header aria-label="Aplikasi daftar game">
                <img src="/dogame.png" style={{ height: "40px" }} />
                <div className="title">
                    <h1>Do Game Explorer</h1>
                    <p>Telusuri & filter game favoritmu</p>
                </div>
            </header>

            <div className="sticky-bar">
                <div className="sticky-inner">
                    <div className="search" role="search">
                        <span className="icon" aria-hidden="true">
                            🔎
                        </span>
                        <input
                            id="searchInput"
                            type="input"
                            placeholder="Cari nama game favoritmu..."
                            inputMode="search"
                            autoComplete="off"
                            value={search}
                            onKeyUp={handleSearchChange}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="clear"
                            id="clearBtn"
                            aria-label="Bersihkan pencarian"
                            onClick={handleClearSearch}
                        >
                            ✕
                        </button>
                    </div>

                    <div
                        className="chips"
                        id="chipBar"
                        role="tablist"
                        aria-label="Filter kategori"
                    >
                        <button
                            className="chip"
                            data-category="all"
                            data-active={category === "all"}
                            role="tab"
                            aria-selected={category === "all"}
                            onClick={() => handleCategoryChange("all")}
                        >
                            Semua
                        </button>
                        {RUANGAN.map((ruangan, index) => (
                            <button
                                key={index}
                                className="chip"
                                data-category={ruangan.name}
                                data-active={category === ruangan.name}
                                role="tab"
                                aria-selected={category === ruangan.name}
                                onClick={() =>
                                    handleCategoryChange(ruangan.name)
                                }
                            >
                                {ruangan.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section className="list" id="gameList" aria-live="polite">
                {FILTER_GAMES().map((game, index) => (
                    <article
                        key={index}
                        className="card"
                        data-category={game.rooms.join(", ")}
                        data-title={game.name}
                    >
                        <div className="content">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <h3>{game.name}</h3>{" "}
                                <button
                                    className="info-btn"
                                    onClick={() => handleShowRooms(game)}
                                    aria-label={`Lihat ketersediaan ${game.name}`}
                                >
                                    Info
                                </button>
                            </div>
                            <p className="game-code">Code: {game.code}</p>
                        </div>
                    </article>
                ))}
            </section>

            {/* Popup Modal */}
            {popupData && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="popup-header">
                            <h3>{popupData.name}</h3>
                            <button
                                className="popup-close"
                                onClick={handleClosePopup}
                                aria-label="Tutup popup"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="popup-body">
                            <p className="popup-code">Code: {popupData.code}</p>
                            <h4>Tersedia di ruangan:</h4>
                            <ul className="room-list">
                                {popupData.rooms.map((room, idx) => (
                                    <li key={idx} className="room-item">
                                        {room}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
