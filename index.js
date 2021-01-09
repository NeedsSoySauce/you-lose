(() => {
    const PIECES_CONTAINER = document.getElementById('pieces-container');
    const MOVES_CONTAINER = document.getElementById('moves-container');
    const RESTART_CONTAINER = document.getElementById('restart-container');

    const BUTTON_TAKE_1 = document.getElementById('button-take-1');
    const BUTTON_TAKE_2 = document.getElementById('button-take-2');
    const BUTTON_TAKE_3 = document.getElementById('button-take-3');
    const BUTTON_RESTART = document.getElementById('button-restart');

    const PlayerCode = {
        player: 0,
        computer: 1
    };

    const showMovesContainer = () => {
        MOVES_CONTAINER.classList.remove('hidden');
        RESTART_CONTAINER.classList.add('hidden');
    };

    const showRestartContainer = () => {
        MOVES_CONTAINER.classList.add('hidden');
        RESTART_CONTAINER.classList.remove('hidden');
    };

    const takePieces = (pieces, numberOfPieces, playerClass, oppositionClass) => {
        let endPos = pieces.findIndex((piece) => piece.classList.contains(oppositionClass));
        endPos = endPos === -1 ? pieces.length : endPos;
        pieces
            .slice(pieces.length - numberOfPieces - (pieces.length - endPos), endPos)
            .forEach((piece) => piece.classList.add(playerClass));
    };

    const handleTakePieces = (state, numberOfPieces) => {
        takePieces(state.pieces, numberOfPieces, 'green', 'red');
        setPlayerTurnButtonActiveStates(false);
        state.hasPlayerMoved = true;
    };

    const handleRestart = (state) => {
        resetPieces(state.pieces);
        startGameLoop(state);
    };

    const registerButtonActions = (state) => {
        BUTTON_TAKE_1.addEventListener('click', handleTakePieces.bind(null, state, 1));
        BUTTON_TAKE_2.addEventListener('click', handleTakePieces.bind(null, state, 2));
        BUTTON_TAKE_3.addEventListener('click', handleTakePieces.bind(null, state, 3));
        BUTTON_RESTART.addEventListener('click', handleRestart.bind(null, state));
    };

    const setPlayerTurnButtonActiveStates = (isActive) => {
        [BUTTON_TAKE_1, BUTTON_TAKE_2, BUTTON_TAKE_3].forEach((button) => (button.disabled = !isActive));
    };

    const resetPieces = (pieces) => {
        pieces.forEach((piece) => {
            piece.classList.remove('red');
            piece.classList.remove('green');
        });
        showMovesContainer();
    };

    const isPieceTaken = (piece) => {
        return piece.classList.contains('red') || piece.classList.contains('green');
    };

    const isGameOver = (pieces) => {
        return isPieceTaken(pieces[0]);
    };

    const waitForMilliseconds = async (milliseconds) => {
        await new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const playerMove = async (state) => {
        state.isPlayerTurn = true;
        state.hasPlayerMoved = false;
        setPlayerTurnButtonActiveStates(true);

        // There are more efficient ways to do this, but this is simple and works well enough
        while (!state.hasPlayerMoved) {
            await waitForMilliseconds(25);
        }
        state.hasPlayerMoved = false;
    };

    const computerMove = (pieces) => {
        let numberOfUntakenPieces = pieces.findIndex(isPieceTaken);
        takePieces(pieces, numberOfUntakenPieces % 4, 'red', 'green');
    };

    // We don't really need a game loop (we could make this entirely event driven as it's turn based)
    // but I find things easier to follow when they're like this
    const startGameLoop = async (state) => {
        let isRunning = true;
        let pieces = state.pieces;

        while (isRunning) {
            await playerMove(state);
            lastPlayerToMove = PlayerCode.player;
            isRunning = !isGameOver(pieces);

            await waitForMilliseconds(Math.random() * 200 + 50);
            computerMove(pieces);
            isRunning = !isGameOver(pieces);
        }

        showRestartContainer();
    };

    const main = () => {
        let state = {
            isPlayerTurn: true,
            hasPlayerMoved: false,
            pieces: [...PIECES_CONTAINER.children]
        };

        registerButtonActions(state);

        startGameLoop(state);
    };

    main();
})();
