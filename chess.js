







document.addEventListener('DOMContentLoaded', () => {
            const PIECE_BASE = 'https://chessboardjs.com/img/chesspieces/wikipedia/';
            const STOCKFISH_BASE = 'https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/';
            const STOCKFISH_SCRIPT = STOCKFISH_BASE + 'stockfish-nnue-16-single.js';

            const game = new Chess();
            let board = null;
            let audioCtx = null;

            const els = {
                introScreen: document.getElementById('introScreen'),
                gameShell: document.getElementById('gameShell'),
                introBoard: document.getElementById('introBoard'),
                introModeGrid: document.getElementById('introModeGrid'),
                enterGameBtn: document.getElementById('enterGameBtn'),
                introSide: document.getElementById('introSide'),
                homeBtn: document.getElementById('homeBtn'),
                board: document.getElementById('board'),
                boardWrapper: document.getElementById('boardWrapper'),
                arrowLayer: document.getElementById('arrowLayer'),
                browsingBadge: document.getElementById('browsingBadge'),
                engineBadge: document.getElementById('engineBadge'),
                engineText: document.getElementById('engineText'),
                modeTabs: document.getElementById('modeTabs'),
                status: document.getElementById('status'),
                mobileStatus: document.getElementById('mobileStatus'),
                lastMoveText: document.getElementById('lastMoveText'),
                qualityBadge: document.getElementById('qualityBadge'),
                moveHistory: document.getElementById('moveHistory'),
                evalBar: document.getElementById('evalBar'),
                evalFill: document.getElementById('evalFill'),
                evalLabel: document.getElementById('evalLabel'),
                timeWhite: document.getElementById('timeWhite'),
                timeBlack: document.getElementById('timeBlack'),
                clockWhite: document.getElementById('clockWhite'),
                clockBlack: document.getElementById('clockBlack'),
                clockBoxWhite: document.getElementById('clockBoxWhite'),
                clockBoxBlack: document.getElementById('clockBoxBlack'),
                boardTheme: document.getElementById('boardTheme'),
                pieceColor: document.getElementById('pieceColor'),
                playerSide: document.getElementById('playerSide'),
                botProfile: document.getElementById('botProfile'),
                botProfileWrap: document.getElementById('botProfileWrap'),
                botCard: document.getElementById('botCard'),
                botAvatar: document.getElementById('botAvatar'),
                botName: document.getElementById('botName'),
                botElo: document.getElementById('botElo'),
                botPersona: document.getElementById('botPersona'),
                toggleEval: document.getElementById('toggleEval'),
                togglePremove: document.getElementById('togglePremove'),
                toggleSound: document.getElementById('toggleSound'),
                toggleColorblind: document.getElementById('toggleColorblind'),
                navFirst: document.getElementById('navFirst'),
                navPrev: document.getElementById('navPrev'),
                navNext: document.getElementById('navNext'),
                navLast: document.getElementById('navLast'),
                resetBtn: document.getElementById('resetBtn'),
                newGameTopBtn: document.getElementById('newGameTopBtn'),
                focusBoardBtn: document.getElementById('focusBoardBtn'),
                installAppBtn: document.getElementById('installAppBtn'),
                undoBtn: document.getElementById('undoBtn'),
                exportBtn: document.getElementById('exportBtn'),
                exportTopBtn: document.getElementById('exportTopBtn'),
                copyPgnBtn: document.getElementById('copyPgnBtn'),
                claudeEndpoint: document.getElementById('claudeEndpoint'),
                claudeKey: document.getElementById('claudeKey'),
                claudeBtn: document.getElementById('claudeBtn'),
                analysisOutput: document.getElementById('analysisOutput'),
                playPauseBtn: document.getElementById('playPauseBtn'),
                nextTrackBtn: document.getElementById('nextTrackBtn'),
                musicFiles: document.getElementById('musicFiles'),
                musicSearchInput: document.getElementById('musicSearchInput'),
                musicSearchBtn: document.getElementById('musicSearchBtn'),
                musicSearchStatus: document.getElementById('musicSearchStatus'),
                musicSearchResults: document.getElementById('musicSearchResults'),
                currentTrackName: document.getElementById('currentTrackName'),
                audioPlayer: document.getElementById('audioPlayer'),
                endOverlay: document.getElementById('endOverlay'),
                endTitle: document.getElementById('endTitle'),
                endResult: document.getElementById('endResult'),
                statMoves: document.getElementById('statMoves'),
                statDuration: document.getElementById('statDuration'),
                statQuality: document.getElementById('statQuality'),
                endNewBtn: document.getElementById('endNewBtn'),
                endExportBtn: document.getElementById('endExportBtn'),
                endAnalyzeBtn: document.getElementById('endAnalyzeBtn'),
                endOnlineBtn: document.getElementById('endOnlineBtn'),
                endOnlineStatus: document.getElementById('endOnlineStatus'),
                mobilePanelBtn: document.getElementById('mobilePanelBtn')
            };

            const state = {
                introMode: 'pvp',
                mode: 'pvp',
                evalEnabled: true,
                premoveEnabled: true,
                soundEnabled: true,
                colorblind: false,
                isBotThinking: false,
                botToken: 0,
                isTimeout: false,
                endShown: false,
                boardFocus: false,
                mobilePanelOpen: false,
                selectedSquare: null,
                selectedAsPremove: false,
                premoveQueue: [],
                fenHistory: [],
                moves: [],
                browseIndex: 0,
                currentEvalCp: 0,
                timer: null,
                clockRunning: false,
                timeW: 0,
                timeB: 0,
                limitW: 0,
                limitB: 0,
                startedAt: Date.now(),
                endedAt: null,
                deferredInstallPrompt: null,
                playlist: [],
                currentTrack: 0,
                currentMusicObjectUrl: null,
                onlineMusicResults: [],
                drawingArrow: false,
                arrowStart: null,
                currentArrowLine: null,
                allowedArrowTargets: null,
                touchBoardLocked: false,
                puzzleIndex: 0,
                puzzleStep: 0
            };

            const boardThemes = {
                forest: { light: '#e7d8b4', dark: '#56704c' },
                classic: { light: '#f0d9b5', dark: '#b58863' },
                graphite: { light: '#c9c7bd', dark: '#5b6260' },
                ocean: { light: '#d8f3dc', dark: '#168aad' },
                royal: { light: '#ead7ff', dark: '#5a189a' },
                walnut: { light: '#ead2ac', dark: '#7f5539' },
                ice: { light: '#edf6f9', dark: '#83c5be' },
                volcano: { light: '#ffe8d6', dark: '#9d0208' },
                aurora: { light: '#d9ed92', dark: '#1a759f' },
                tournament: { light: '#f7f3df', dark: '#8ba064' },
                midnight: { light: '#bfc7d5', dark: '#26324a' },
                colorblind: { light: '#f1e6c8', dark: '#2364aa' }
            };

            const botProfiles = {
                novice: {
                    name: 'Camille Calm',
                    avatar: '\u2659',
                    elo: 1350,
                    persona: 'Accessible, mais elle ne donne presque plus de pièces gratuitement.',
                    depth: 6,
                    movetime: 650,
                    skill: 8,
                    limitStrength: true,
                    lines: ['Camille Calm cherche un coup naturel solide.', 'Camille Calm vérifie les captures simples.']
                },
                rookie: {
                    name: 'Nina Blitz',
                    avatar: '\u2658',
                    elo: 1500,
                    persona: 'Rapide, tactique, beaucoup moins indulgente en un coup.',
                    depth: 8,
                    movetime: 850,
                    skill: 11,
                    limitStrength: true,
                    lines: ['Nina Blitz cherche le coup forcing.', 'Nina Blitz calcule les tactiques courtes.']
                },
                gambit: {
                    name: 'Miro Gambit',
                    avatar: '\u2657',
                    elo: 1750,
                    persona: 'Agressif, sacrifie seulement quand la compensation tient.',
                    depth: 10,
                    movetime: 1050,
                    skill: 14,
                    limitStrength: true,
                    lines: ['Miro Gambit prépare une attaque calculée.', 'Miro Gambit accepte le désordre si les lignes s’ouvrent.']
                },
                keeper: {
                    name: 'Atlas Keeper',
                    avatar: '\u265C',
                    elo: 2000,
                    persona: 'Solide, patient, aime les finales propres.',
                    depth: 12,
                    movetime: 1350,
                    skill: 16,
                    limitStrength: true,
                    lines: ['Atlas Keeper consolide sa position.', 'Atlas Keeper calcule une structure saine.']
                },
                tactician: {
                    name: 'Vega Tacticienne',
                    avatar: '\u265E',
                    elo: 2250,
                    persona: 'Calculatrice, punit vite les pièces non protégées.',
                    depth: 14,
                    movetime: 1700,
                    skill: 18,
                    limitStrength: true,
                    lines: ['Vega Tacticienne vérifie les coups intermédiaires.', 'Vega Tacticienne vise une tactique nette.']
                },
                endgame: {
                    name: 'Soren Finaliste',
                    avatar: '\u2656',
                    elo: 2450,
                    persona: 'Technique, convertit mieux les petits avantages.',
                    depth: 16,
                    movetime: 2100,
                    skill: 19,
                    limitStrength: true,
                    lines: ['Soren Finaliste simplifie avec précision.', 'Soren Finaliste prépare la finale.']
                },
                prime: {
                    name: 'Guy Prime',
                    avatar: '\u265B',
                    elo: 2850,
                    persona: 'Stockfish quasi libre : très précis, très dur à surprendre.',
                    depth: 20,
                    movetime: 3200,
                    skill: 20,
                    limitStrength: false,
                    lines: ['Guy Prime inspecte la variante critique.', 'Guy Prime serre la position.']
                }
            };

            const puzzles = [
                {
                    fen: '3r2k1/p4ppp/1p6/8/8/1P6/P4PPP/4R1K1 w - - 0 1',
                    seq: ['e1e8'],
                    desc: 'Mat en 1 - Trait aux Blancs',
                    color: 'w'
                },
                {
                    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 5',
                    seq: ['f6e4', 'c3e4', 'd7d5'],
                    desc: 'Gagner du matériel - Trait aux Noirs',
                    color: 'b'
                },
                {
                    fen: '6k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1',
                    seq: ['f1e1'],
                    desc: 'Finale de tours - Activez la tour',
                    color: 'w'
                }
            ];

            class StockfishClient {
                constructor() {
                    this.worker = null;
                    this.ready = false;
                    this.failed = false;
                    this.queue = [];
                    this.current = null;
                    this.init();
                }

                init() {
                    try {
                        const workerBody = `
                            self.Module = {
                                locateFile: function(path) {
                                    return '${STOCKFISH_BASE}' + path;
                                }
                            };
                            importScripts('${STOCKFISH_SCRIPT}');
                        `;
                        const blob = new Blob([workerBody], { type: 'text/javascript' });
                        this.worker = new Worker(URL.createObjectURL(blob));
                        this.worker.onmessage = event => this.handleLine(String(event.data || ''));
                        this.worker.onerror = () => this.markFailed();
                        this.post('uci');
                        setTimeout(() => {
                            if (!this.ready) this.markFailed();
                        }, 9000);
                    } catch (err) {
                        this.markFailed();
                    }
                }

                post(command) {
                    if (this.worker && !this.failed) this.worker.postMessage(command);
                }

                markReady() {
                    this.ready = true;
                    this.failed = false;
                    els.engineBadge.classList.add('ready');
                    els.engineBadge.classList.remove('failed');
                    els.engineText.textContent = 'Stockfish prêt';
                    this.flush();
                }

                markFailed() {
                    if (this.failed) return;
                    this.failed = true;
                    this.ready = false;
                    els.engineBadge.classList.remove('ready');
                    els.engineBadge.classList.add('failed');
                    els.engineText.textContent = 'Repli local';
                    while (this.queue.length) {
                        const task = this.queue.shift();
                        task.resolve(fallbackEngine(task.fen));
                    }
                    if (this.current) {
                        this.current.resolve(fallbackEngine(this.current.fen));
                        this.current = null;
                    }
                }

                handleLine(line) {
                    if (!line) return;
                    if (line === 'uciok' || line.includes('uciok')) {
                        this.markReady();
                        this.post('isready');
                        return;
                    }
                    if (!this.current) return;
                    const cpMatch = line.match(/\bscore cp (-?\d+)/);
                    const mateMatch = line.match(/\bscore mate (-?\d+)/);
                    if (cpMatch) {
                        this.current.rawScore = { cp: parseInt(cpMatch[1], 10), mate: null };
                    }
                    if (mateMatch) {
                        this.current.rawScore = { cp: null, mate: parseInt(mateMatch[1], 10) };
                    }
                    const bestMatch = line.match(/\bbestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                    if (bestMatch) {
                        const task = this.current;
                        clearTimeout(task.timeout);
                        this.current = null;
                        task.resolve({
                            bestmove: bestMatch[1],
                            whiteCp: normalizeScore(task.rawScore, task.fen),
                            raw: task.rawScore,
                            source: 'stockfish'
                        });
                        this.flush();
                    }
                }

                evaluate(fen, options = {}) {
                    if (this.failed) return Promise.resolve(fallbackEngine(fen));
                    return new Promise(resolve => {
                        this.queue.push({
                            fen,
                            depth: options.depth || 8,
                            movetime: options.movetime || 350,
                            skill: options.skill,
                            elo: options.elo,
                            limitStrength: options.limitStrength,
                            resolve
                        });
                        this.flush();
                    });
                }

                flush() {
                    if (!this.ready || this.failed || this.current || !this.queue.length) return;
                    const task = this.queue.shift();
                    this.current = task;
                    task.rawScore = null;
                    task.timeout = setTimeout(() => {
                        if (this.current !== task) return;
                        this.post('stop');
                        this.current = null;
                        task.resolve(fallbackEngine(task.fen));
                        this.flush();
                    }, Math.max(2200, task.movetime + 3200));
                    if (typeof task.skill === 'number') {
                        this.post('setoption name Skill Level value ' + task.skill);
                    }
                    if (typeof task.elo === 'number') {
                        const limited = task.limitStrength !== false;
                        this.post('setoption name UCI_LimitStrength value ' + (limited ? 'true' : 'false'));
                        if (limited) this.post('setoption name UCI_Elo value ' + Math.max(1350, Math.min(2850, task.elo)));
                    } else {
                        this.post('setoption name UCI_LimitStrength value false');
                    }
                    this.post('position fen ' + task.fen);
                    if (task.movetime) this.post('go movetime ' + task.movetime);
                    else this.post('go depth ' + task.depth);
                }
            }

            const engine = new StockfishClient();

            function normalizeScore(rawScore, fen) {
                if (!rawScore) return materialEvalFen(fen);
                const turn = fen.split(' ')[1];
                let cp = 0;
                if (rawScore.mate !== null && rawScore.mate !== undefined) {
                    const sign = rawScore.mate > 0 ? 1 : -1;
                    cp = sign * (100000 - Math.min(90000, Math.abs(rawScore.mate) * 1000));
                } else {
                    cp = rawScore.cp || 0;
                }
                return turn === 'w' ? cp : -cp;
            }

            function fallbackEngine(fen) {
                const g = new Chess(fen);
                const moves = g.moves({ verbose: true });
                if (!moves.length) {
                    return { bestmove: null, whiteCp: materialEvalGame(g), source: 'fallback' };
                }
                const scored = moves.map(move => {
                    let score = 0;
                    if (move.captured) score += pieceValue(move.captured) + 20;
                    if (move.san.includes('+')) score += 35;
                    if (move.san.includes('#')) score += 9000;
                    if (move.promotion) score += 700;
                    score += Math.random() * 12;
                    return { move, score };
                }).sort((a, b) => b.score - a.score);
                const best = scored[0].move;
                return {
                    bestmove: best.from + best.to + (best.promotion || ''),
                    whiteCp: materialEvalGame(g),
                    source: 'fallback'
                };
            }

            function pieceValue(type) {
                return { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 }[type] || 0;
            }

            function materialEvalFen(fen) {
                const g = new Chess(fen);
                return materialEvalGame(g);
            }

            function materialEvalGame(g) {
                if (g.game_over()) {
                    if (g.in_draw()) return 0;
                    return g.turn() === 'w' ? -100000 : 100000;
                }
                let score = 0;
                const placement = g.fen().split(' ')[0];
                for (const ch of placement) {
                    if (ch === '/' || /\d/.test(ch)) continue;
                    const value = pieceValue(ch.toLowerCase());
                    score += ch === ch.toUpperCase() ? value : -value;
                }
                return score;
            }

            function renderIntroBoard() {
                const placement = {
                    a8: 'bR', b8: 'bN', c8: 'bB', d8: 'bQ', e8: 'bK', f8: 'bB', g8: 'bN', h8: 'bR',
                    a7: 'bP', b7: 'bP', c7: 'bP', d7: 'bP', e7: 'bP', f7: 'bP', g7: 'bP', h7: 'bP',
                    a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', e2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP',
                    a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', f1: 'wB', g1: 'wN', h1: 'wR'
                };
                const files = 'abcdefgh';
                let html = '';
                for (let rank = 8; rank >= 1; rank--) {
                    for (let file = 0; file < 8; file++) {
                        const sq = files[file] + rank;
                        const color = (file + rank) % 2 === 0 ? 'dark' : 'light';
                        const piece = placement[sq];
                        html += `<div class="intro-square ${color}">${piece ? `<img alt="" src="${PIECE_BASE}${piece}.png">` : ''}</div>`;
                    }
                }
                els.introBoard.innerHTML = html;
            }

            function humanColor() {
                return els.playerSide.value === 'black' ? 'b' : 'w';
            }

            function botColor() {
                return humanColor() === 'w' ? 'b' : 'w';
            }

            function isBrowsing() {
                return state.browseIndex < state.fenHistory.length - 1;
            }

            function isHumanTurn() {
                if (state.isTimeout || game.game_over() || state.isBotThinking) return false;
                if (state.mode === 'bot') return game.turn() === humanColor();
                if (state.mode === 'puzzle') return game.turn() === puzzles[state.puzzleIndex].color;
                return true;
            }

            function premoveColor() {
                if (state.mode === 'bot') return humanColor();
                return game.turn() === 'w' ? 'b' : 'w';
            }

            function createBoard() {
                if (board) board.destroy();
                board = Chessboard('board', {
                    draggable: true,
                    position: game.fen(),
                    orientation: els.playerSide.value,
                    pieceTheme: PIECE_BASE + '{piece}.png',
                    onDragStart,
                    onDrop,
                    onSnapEnd
                });
                applyPieceFilter();
                clearArrows();
                setTimeout(() => {
                    board.resize();
                    resizeArrowSVG();
                }, 80);
            }

            function applyPieceFilter() {
                const classNames = ['piece-filter-ivory', 'piece-filter-golden', 'piece-filter-onyx', 'piece-filter-rose'];
                els.board.classList.remove(...classNames);
                if (els.pieceColor.value !== 'classic') {
                    els.board.classList.add('piece-filter-' + els.pieceColor.value);
                }
            }

            function initHistory() {
                state.fenHistory = [game.fen()];
                state.moves = [];
                state.browseIndex = 0;
                state.currentEvalCp = materialEvalGame(game);
                renderMoveHistory();
                updateNavButtons();
                updateLastMove(null);
                requestEval(game.fen(), true);
            }

            function recordMove(move, fenBefore, beforeCp) {
                const item = {
                    san: move.san,
                    from: move.from,
                    to: move.to,
                    color: move.color,
                    flags: move.flags,
                    captured: move.captured || null,
                    promotion: move.promotion || null,
                    fenBefore,
                    fenAfter: game.fen(),
                    beforeCp,
                    afterCp: materialEvalGame(game),
                    quality: null,
                    qualityLabel: 'Analyse'
                };
                state.moves.push(item);
                state.fenHistory.push(game.fen());
                state.browseIndex = state.fenHistory.length - 1;
                state.currentEvalCp = item.afterCp;
                renderMoveHistory();
                updateNavButtons();
                updateLastMove(item);
                requestMoveQuality(item);
            }

            async function requestEval(fen, updateBar) {
                if (!state.evalEnabled && !updateBar) return null;
                const result = await engine.evaluate(fen, { depth: 7, movetime: 280 });
                if (updateBar && !isBrowsing()) {
                    state.currentEvalCp = result.whiteCp;
                    renderEval(result.whiteCp);
                }
                return result;
            }

            async function requestMoveQuality(item) {
                const result = await engine.evaluate(item.fenAfter, { depth: 8, movetime: 320 });
                item.afterCp = result.whiteCp;
                const deltaForMover = (item.afterCp - item.beforeCp) * (item.color === 'w' ? 1 : -1);
                item.quality = classifyMove(deltaForMover, item);
                item.qualityLabel = qualityLabel(item.quality);
                if (state.moves[state.moves.length - 1] === item && !isBrowsing()) {
                    state.currentEvalCp = item.afterCp;
                    renderEval(item.afterCp);
                    updateLastMove(item);
                }
                renderMoveHistory();
            }

            function classifyMove(deltaForMover, item) {
                if (item.san.includes('#')) return 'brilliant';
                if (deltaForMover >= 150 && (item.captured || item.san.includes('+') || item.promotion)) return 'brilliant';
                if (deltaForMover >= -45) return 'good';
                if (deltaForMover >= -130) return 'inexact';
                return 'error';
            }

            function qualityLabel(quality) {
                return {
                    brilliant: 'Brillant',
                    good: 'Bon',
                    inexact: 'Inexact',
                    error: 'Erreur'
                }[quality] || 'Analyse';
            }

            function renderEval(cp) {
                if (!state.evalEnabled) return;
                const fill = Math.max(4, Math.min(96, 50 + Math.tanh(cp / 650) * 45));
                els.evalFill.style.height = fill + '%';
                if (Math.abs(cp) > 90000) {
                    els.evalLabel.textContent = cp > 0 ? '+M' : '-M';
                } else {
                    const pawns = cp / 100;
                    els.evalLabel.textContent = (pawns > 0 ? '+' : '') + pawns.toFixed(1);
                }
            }

            function updateLastMove(item) {
                els.qualityBadge.className = 'move-quality';
                if (!item) {
                    els.lastMoveText.textContent = 'Aucun coup';
                    els.qualityBadge.querySelector('span:last-child').textContent = 'En attente';
                    return;
                }
                els.lastMoveText.textContent = `${item.color === 'w' ? 'Blancs' : 'Noirs'} : ${item.san}`;
                if (item.quality) els.qualityBadge.classList.add('quality-' + item.quality);
                els.qualityBadge.querySelector('span:last-child').textContent = item.qualityLabel;
            }

            function renderMoveHistory() {
                if (!state.moves.length) {
                    els.moveHistory.innerHTML = '<span style="color:var(--subtle)">En attente...</span>';
                    return;
                }
                let html = '';
                for (let i = 0; i < state.moves.length; i += 2) {
                    const moveNo = Math.floor(i / 2) + 1;
                    html += '<div class="move-row">';
                    html += `<span class="move-num">${moveNo}.</span>`;
                    html += moveCellHtml(i);
                    html += moveCellHtml(i + 1);
                    html += '</div>';
                }
                els.moveHistory.innerHTML = html;
                els.moveHistory.querySelectorAll('.move-cell[data-idx]').forEach(cell => {
                    cell.addEventListener('click', () => goToMove(parseInt(cell.dataset.idx, 10)));
                });
                const current = els.moveHistory.querySelector('.move-cell.current');
                if (current) els.moveHistory.scrollTop = current.offsetTop - els.moveHistory.clientHeight / 2;
            }

            function moveCellHtml(index) {
                const item = state.moves[index];
                const moveIndex = index + 1;
                if (!item) return '<span class="move-cell"></span>';
                const quality = item.quality ? `tag-${item.quality}` : '';
                const title = item.qualityLabel || 'Analyse';
                return `<span class="move-cell ${state.browseIndex === moveIndex ? 'current' : ''}" data-idx="${moveIndex}" title="${title}">
                    <span class="move-san">${item.san}</span>
                    <span class="move-tag ${quality}"></span>
                </span>`;
            }

            function goToMove(index) {
                index = Math.max(0, Math.min(state.fenHistory.length - 1, index));
                state.browseIndex = index;
                board.position(state.fenHistory[index], false);
                clearArrows();
                els.browsingBadge.classList.toggle('visible', isBrowsing());
                renderMoveHistory();
                updateNavButtons();
                const cp = index === 0 ? 0 : (state.moves[index - 1]?.afterCp ?? materialEvalFen(state.fenHistory[index]));
                renderEval(cp);
            }

            function goToEnd() {
                state.browseIndex = state.fenHistory.length - 1;
                board.position(game.fen(), false);
                els.browsingBadge.classList.remove('visible');
                renderMoveHistory();
                updateNavButtons();
                renderEval(state.currentEvalCp);
            }

            function updateNavButtons() {
                els.navFirst.disabled = state.browseIndex <= 0;
                els.navPrev.disabled = state.browseIndex <= 0;
                els.navNext.disabled = state.browseIndex >= state.fenHistory.length - 1;
                els.navLast.disabled = state.browseIndex >= state.fenHistory.length - 1;
            }

            function tryExecuteMove(moveObj, isDrag = false) {
                if (isBrowsing()) {
                    goToEnd();
                    return false;
                }
                if (state.isTimeout || game.game_over()) return false;

                if (state.mode === 'puzzle') {
                    return tryPuzzleMove(moveObj, isDrag);
                }

                const fenBefore = game.fen();
                const beforeCp = state.currentEvalCp ?? materialEvalGame(game);
                const move = game.move(moveObj);
                if (!move) return false;

                recordMove(move, fenBefore, beforeCp);
                if (!isDrag) board.position(game.fen(), false);
                clearArrows();
                playMoveSound(move);
                ensureClockStarted();
                updateStatus();
                if (state.mode === 'bot') {
                    maybeRunBot();
                } else {
                    processPremoveQueue();
                }
                return true;
            }

            function tryPuzzleMove(moveObj, isDrag) {
                const puzzle = puzzles[state.puzzleIndex];
                const expected = puzzle.seq[state.puzzleStep];
                const fenBefore = game.fen();
                const beforeCp = state.currentEvalCp ?? materialEvalGame(game);
                const move = game.move(moveObj);
                if (!move) return false;
                if (move.from + move.to + (move.promotion || '') === expected || move.san === expected) {
                    recordMove(move, fenBefore, beforeCp);
                    if (!isDrag) board.position(game.fen(), false);
                    clearArrows();
                    playMoveSound(move);
                    state.puzzleStep++;
                    updateStatus();
                    if (state.puzzleStep < puzzle.seq.length) {
                        state.isBotThinking = true;
                        setTimeout(() => {
                            const replyFen = game.fen();
                            const replyBefore = state.currentEvalCp ?? materialEvalGame(game);
                            const reply = game.move(puzzle.seq[state.puzzleStep], { sloppy: true });
                            if (reply) {
                                recordMove(reply, replyFen, replyBefore);
                                board.position(game.fen(), false);
                                playMoveSound(reply);
                            }
                            state.puzzleStep++;
                            state.isBotThinking = false;
                            updateStatus();
                            processPremoveQueue();
                        }, 520);
                    }
                    return true;
                }
                game.undo();
                setStatusHtml('<span style="color:var(--danger)">Mauvais coup, réessayez.</span>');
                playTone(180, 0.12, 'square');
                return false;
            }

            async function maybeRunBot() {
                if (state.mode !== 'bot' || game.game_over() || state.isTimeout || game.turn() !== botColor()) return;
                const profile = botProfiles[els.botProfile.value] || botProfiles.keeper;
                const token = ++state.botToken;
                state.isBotThinking = true;
                removeHighlights();
                renderPremoves();
                const line = profile.lines[Math.floor(Math.random() * profile.lines.length)];
                setStatusHtml(`<span style="color:var(--accent)">${line}</span>`);
                const result = await engine.evaluate(game.fen(), {
                    depth: profile.depth,
                    movetime: profile.movetime,
                    skill: profile.skill,
                    elo: profile.elo,
                    limitStrength: profile.limitStrength
                });
                if (token !== state.botToken || state.mode !== 'bot' || state.isTimeout || game.game_over()) {
                    state.isBotThinking = false;
                    updateStatus();
                    return;
                }
                const best = result.bestmove || fallbackEngine(game.fen()).bestmove;
                if (best) {
                    const fenBefore = game.fen();
                    const beforeCp = state.currentEvalCp ?? materialEvalGame(game);
                    const move = game.move({ from: best.slice(0, 2), to: best.slice(2, 4), promotion: best[4] || 'q' });
                    if (move) {
                        recordMove(move, fenBefore, beforeCp);
                        board.position(game.fen(), false);
                        playMoveSound(move);
                    }
                }
                state.isBotThinking = false;
                updateStatus();
                processPremoveQueue();
            }

            function processPremoveQueue() {
                if (!state.premoveQueue.length || game.game_over() || state.isTimeout) return;
                const next = state.premoveQueue.shift();
                renderPremoves();
                if (!tryExecuteMove(next)) {
                    state.premoveQueue = [];
                    renderPremoves();
                }
            }

            function onDragStart(source, piece) {
                if (isBrowsing() || state.isTimeout || game.game_over()) return false;
                if (isHumanTurn()) {
                    if (piece.charAt(0) !== game.turn()) return false;
                    removeHighlights();
                    highlightSquare(source, false);
                    game.moves({ square: source, verbose: true }).forEach(move => highlightValid(move.to));
                    return true;
                }
                if (state.premoveEnabled && piece.charAt(0) === premoveColor()) {
                    removeHighlights();
                    highlightSquare(source, true);
                    return true;
                }
                return false;
            }

            function onDrop(source, target) {
                removeHighlights();
                if (source === target) {
                    handleClickOnSquare(source);
                    renderPremoves();
                    return 'snapback';
                }
                if (isHumanTurn()) {
                    state.selectedSquare = null;
                    if (tryExecuteMove({ from: source, to: target, promotion: 'q' }, true)) return undefined;
                    renderPremoves();
                    return 'snapback';
                }
                if (state.premoveEnabled) {
                    const piece = game.get(source);
                    if (piece && piece.color === premoveColor()) {
                        state.premoveQueue = [{ from: source, to: target, promotion: 'q' }];
                        state.selectedSquare = null;
                        renderPremoves();
                        return undefined;
                    }
                }
                state.selectedSquare = null;
                renderPremoves();
                return 'snapback';
            }

            function onSnapEnd() {
                if (!isBrowsing()) board.position(game.fen(), false);
                renderPremoves();
            }

            function handleClickOnSquare(square) {
                if (isBrowsing()) {
                    goToEnd();
                    return;
                }
                const piece = game.get(square);
                if (isHumanTurn()) {
                    if (!state.selectedSquare || state.selectedAsPremove) {
                        if (piece && piece.color === game.turn()) selectSquare(square, false);
                        else clearSelectionAndPremoves();
                        return;
                    }
                    if (state.selectedSquare === square) {
                        clearSelection();
                        return;
                    }
                    if (piece && piece.color === game.turn()) {
                        selectSquare(square, false);
                        return;
                    }
                    const moved = tryExecuteMove({ from: state.selectedSquare, to: square, promotion: 'q' });
                    if (!moved) state.premoveQueue = [];
                    clearSelection();
                    renderPremoves();
                    return;
                }
                if (state.premoveEnabled && !state.isTimeout && !game.game_over()) {
                    if (!state.selectedSquare || !state.selectedAsPremove) {
                        if (piece && piece.color === premoveColor()) selectSquare(square, true);
                        else clearSelectionAndPremoves();
                        return;
                    }
                    if (state.selectedSquare === square) {
                        clearSelection();
                        renderPremoves();
                        return;
                    }
                    if (piece && piece.color === premoveColor()) {
                        selectSquare(square, true);
                        return;
                    }
                    state.premoveQueue = [{ from: state.selectedSquare, to: square, promotion: 'q' }];
                    clearSelection();
                    renderPremoves();
                    return;
                }
                clearSelectionAndPremoves();
            }

            function selectSquare(square, asPremove) {
                state.selectedSquare = square;
                state.selectedAsPremove = asPremove;
                removeHighlights();
                highlightSquare(square, asPremove);
                if (!asPremove) {
                    game.moves({ square, verbose: true }).forEach(move => highlightValid(move.to));
                }
            }

            function clearSelection() {
                state.selectedSquare = null;
                state.selectedAsPremove = false;
                removeHighlights();
            }

            function clearSelectionAndPremoves() {
                clearSelection();
                state.premoveQueue = [];
                renderPremoves();
            }

            function removeHighlights() {
                document.querySelectorAll('.square-55d63').forEach(square => {
                    square.classList.remove('highlight-valid', 'highlight-selected', 'highlight-premove');
                });
            }

            function highlightSquare(square, asPremove) {
                const el = document.querySelector('#board .square-' + square);
                if (!el) return;
                el.classList.add('highlight-selected');
                if (asPremove) el.classList.add('highlight-premove');
            }

            function highlightValid(square) {
                const el = document.querySelector('#board .square-' + square);
                if (el) el.classList.add('highlight-valid');
            }

            function renderPremoves() {
                document.querySelectorAll('.square-55d63').forEach(square => square.classList.remove('highlight-premove'));
                for (const move of state.premoveQueue) {
                    const from = document.querySelector('#board .square-' + move.from);
                    const to = document.querySelector('#board .square-' + move.to);
                    if (from) from.classList.add('highlight-premove');
                    if (to) to.classList.add('highlight-premove');
                }
            }

            function initClocks() {
                clearInterval(state.timer);
                state.timer = null;
                state.clockRunning = false;
                state.isTimeout = false;
                state.limitW = state.mode === 'puzzle' ? 0 : (parseInt(els.timeWhite.value, 10) || 0) * 60;
                state.limitB = state.mode === 'puzzle' ? 0 : (parseInt(els.timeBlack.value, 10) || 0) * 60;
                state.timeW = state.limitW;
                state.timeB = state.limitB;
                updateClockUI();
            }

            function ensureClockStarted() {
                if (state.clockRunning || state.mode === 'puzzle' || (!state.limitW && !state.limitB) || game.game_over() || state.isTimeout) return;
                state.clockRunning = true;
                let last = performance.now();
                state.timer = setInterval(() => {
                    if (game.game_over() || state.isTimeout) {
                        clearInterval(state.timer);
                        state.clockRunning = false;
                        updateClockUI();
                        return;
                    }
                    const now = performance.now();
                    const delta = (now - last) / 1000;
                    last = now;
                    if (game.turn() === 'w' && state.limitW > 0) {
                        state.timeW = Math.max(0, state.timeW - delta);
                        if (state.timeW <= 0) handleTimeout('w');
                    } else if (game.turn() === 'b' && state.limitB > 0) {
                        state.timeB = Math.max(0, state.timeB - delta);
                        if (state.timeB <= 0) handleTimeout('b');
                    }
                    updateClockUI();
                }, 100);
            }

            function handleTimeout(color) {
                state.isTimeout = true;
                state.endedAt = Date.now();
                state.premoveQueue = [];
                renderPremoves();
                clearInterval(state.timer);
                state.clockRunning = false;
                playTone(140, 0.22, 'sawtooth');
                updateClockUI();
                updateStatus();
            }

            function updateClockUI() {
                els.clockWhite.textContent = state.limitW ? formatTime(state.timeW) : '--:--';
                els.clockBlack.textContent = state.limitB ? formatTime(state.timeB) : '--:--';
                els.clockBoxWhite.classList.remove('active', 'low');
                els.clockBoxBlack.classList.remove('active', 'low');
                if (state.clockRunning && !state.isTimeout && !game.game_over()) {
                    if (game.turn() === 'w' && state.limitW) els.clockBoxWhite.classList.add('active');
                    if (game.turn() === 'b' && state.limitB) els.clockBoxBlack.classList.add('active');
                }
                if (state.limitW && state.timeW < 20 && state.timeW > 0) els.clockBoxWhite.classList.add('low');
                if (state.limitB && state.timeB < 20 && state.timeB > 0) els.clockBoxBlack.classList.add('low');
            }

            function formatTime(seconds) {
                if (seconds <= 0) return '0:00';
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                const tenths = Math.floor((seconds % 1) * 10);
                if (min === 0 && sec < 20) return `${sec}.${tenths}`;
                return `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }

            function setStatusHtml(html) {
                els.status.innerHTML = html;
                if (els.mobileStatus) els.mobileStatus.innerHTML = html;
            }

            function updateStatus() {
                if (state.isBotThinking) return;
                let status = '';
                if (state.isTimeout) {
                    const winner = state.timeW <= 0 ? 'Noirs' : 'Blancs';
                    status = `<span style="color:var(--danger)">Temps écoulé.</span> ${winner} gagne.`;
                } else if (state.mode === 'puzzle') {
                    const puzzle = puzzles[state.puzzleIndex];
                    status = state.puzzleStep >= puzzle.seq.length
                        ? '<span style="color:var(--success)">Problème résolu.</span>'
                        : puzzle.desc;
                } else if (game.in_checkmate()) {
                    const winner = game.turn() === 'w' ? 'Noirs' : 'Blancs';
                    status = `<span style="color:var(--danger)">Échec et mat.</span> ${winner} gagne.`;
                } else if (game.in_draw()) {
                    status = '<span style="color:var(--accent-2)">Match nul.</span>';
                } else {
                    const who = game.turn() === 'w' ? 'Blancs' : 'Noirs';
                    status = `Au tour des ${who}`;
                    if (game.in_check()) status += ' <span style="color:var(--danger)">(échec)</span>';
                }
                setStatusHtml(status);
                if (!isBrowsing()) renderEval(state.currentEvalCp);
                maybeShowEndOverlay();
            }

            function resetGame() {
                state.botToken++;
                state.isBotThinking = false;
                state.endShown = false;
                state.endedAt = null;
                state.startedAt = Date.now();
                state.selectedSquare = null;
                state.selectedAsPremove = false;
                state.premoveQueue = [];
                clearArrows();
                removeHighlights();
                renderPremoves();
                els.browsingBadge.classList.remove('visible');
                els.endOverlay.classList.remove('visible');
                els.endOverlay.setAttribute('aria-hidden', 'true');
                if (state.mode === 'puzzle') {
                    if (state.puzzleStep >= puzzles[state.puzzleIndex].seq.length) {
                        state.puzzleIndex = (state.puzzleIndex + 1) % puzzles.length;
                    }
                    state.puzzleStep = 0;
                    game.load(puzzles[state.puzzleIndex].fen);
                } else {
                    game.reset();
                }
                game.header(
                    'Event', "Guy's Game",
                    'Site', 'Local',
                    'Date', new Date().toISOString().slice(0, 10),
                    'White', state.mode === 'bot' && humanColor() === 'b' ? selectedBot().name : 'Blancs',
                    'Black', state.mode === 'bot' && humanColor() === 'w' ? selectedBot().name : 'Noirs'
                );
                createBoard();
                initHistory();
                initClocks();
                updateModeUI();
                updateStatus();
                if (state.mode === 'bot') {
                    setTimeout(maybeRunBot, 250);
                }
            }

            function selectedBot() {
                return botProfiles[els.botProfile.value] || botProfiles.keeper;
            }

            function updateModeUI() {
                [...els.modeTabs.querySelectorAll('button')].forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.mode === state.mode);
                });
                const isBot = state.mode === 'bot';
                els.botProfileWrap.style.display = isBot ? 'block' : 'none';
                els.botCard.classList.toggle('visible', isBot);
                els.timeWhite.disabled = state.mode === 'puzzle';
                els.timeBlack.disabled = state.mode === 'puzzle';
                const bot = selectedBot();
                els.botAvatar.textContent = bot.avatar;
                els.botName.textContent = bot.name;
                els.botElo.textContent = `${bot.elo} Elo`;
                els.botPersona.textContent = bot.persona;
            }

            function setMode(mode) {
                state.mode = mode;
                updateModeUI();
                resetGame();
            }

            function showGameFromIntro() {
                state.mode = state.introMode;
                els.playerSide.value = els.introSide.value;
                els.introScreen.classList.add('is-hidden');
                els.gameShell.classList.add('is-visible');
                setBoardFocus(isMobileViewport());
                updateModeUI();
                resetGame();
                setTimeout(() => {
                    board.resize();
                    resizeArrowSVG();
                    lucide.createIcons();
                }, 120);
            }

            function showIntro() {
                state.botToken++;
                state.isBotThinking = false;
                clearInterval(state.timer);
                state.clockRunning = false;
                setBoardFocus(false);
                els.gameShell.classList.remove('is-visible');
                els.introScreen.classList.remove('is-hidden');
            }

             function isMobileViewport() {
                return window.matchMedia('(max-width: 680px)').matches;
            }

            function setBoardFocus(enabled) {
                state.boardFocus = Boolean(enabled);
                if (!state.boardFocus) state.mobilePanelOpen = false;
                document.body.classList.toggle('board-focus', state.boardFocus);
                document.body.classList.toggle('mobile-panel-open', state.mobilePanelOpen);
                updateFocusButton();
                setTimeout(() => {
                    if (board) board.resize();
                    resizeArrowSVG();
                }, 40);
            }

            function toggleBoardFocus() {
                setBoardFocus(!state.boardFocus);
            }

            function toggleMobilePanels() {
                if (!state.boardFocus) setBoardFocus(true);
                state.mobilePanelOpen = !state.mobilePanelOpen;
                document.body.classList.toggle('mobile-panel-open', state.mobilePanelOpen);
                updateFocusButton();
                setTimeout(() => {
                    if (board) board.resize();
                    resizeArrowSVG();
                }, 40);
            }

            function updateFocusButton() {
                if (!els.focusBoardBtn) return;
                const icon = state.boardFocus ? 'minimize-2' : 'maximize-2';
                const label = state.boardFocus ? 'Normal' : 'Plateau';
                els.focusBoardBtn.innerHTML = `<i data-lucide="${icon}"></i>${label}`;
                if (els.mobilePanelBtn) {
                    els.mobilePanelBtn.innerHTML = `<i data-lucide="${state.mobilePanelOpen ? 'x' : 'panel-right'}"></i>${state.mobilePanelOpen ? 'Masquer' : 'Panneau'}`;
                }
                lucide.createIcons();
            }

            function registerPwa() {
                if (!('serviceWorker' in navigator)) return;
                if (!['http:', 'https:'].includes(window.location.protocol)) return;
                navigator.serviceWorker.register('./sw.js').catch(() => {
                    // L'app reste jouable même si le cache offline est indisponible.
                });
                window.addEventListener('beforeinstallprompt', event => {
                    event.preventDefault();
                    state.deferredInstallPrompt = event;
                    updateInstallButton();
                });
                window.addEventListener('appinstalled', () => {
                    state.deferredInstallPrompt = null;
                    updateInstallButton();
                });
                updateInstallButton();
            }

            function isStandaloneApp() {
                return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            }

            function updateInstallButton() {
                if (!els.installAppBtn) return;
                const canInstall = Boolean(state.deferredInstallPrompt) && !isStandaloneApp();
                els.installAppBtn.classList.toggle('hidden', !canInstall);
            }

            async function installPwaApp() {
                if (!state.deferredInstallPrompt) {
                    setStatusHtml('Sur mobile, utilisez le menu du navigateur puis <span style="color:var(--accent)">Ajouter à l’écran d’accueil</span>.');
                }
                const promptEvent = state.deferredInstallPrompt;
                state.deferredInstallPrompt = null;
                updateInstallButton();
                promptEvent.prompt();
                await promptEvent.userChoice.catch(() => null);
            }

            function maybeShowEndOverlay() {
                if (state.endShown) return;
                const puzzleDone = state.mode === 'puzzle' && state.puzzleStep >= puzzles[state.puzzleIndex].seq.length;
                if (!state.isTimeout && !game.game_over() && !puzzleDone) return;
                state.endShown = true;
                state.endedAt = state.endedAt || Date.now();
                const result = getResultText();
                els.endTitle.textContent = result.title;
                els.endResult.textContent = result.detail;
                els.statMoves.textContent = String(state.moves.length);
                els.statDuration.textContent = formatDuration((state.endedAt - state.startedAt) / 1000);
                els.statQuality.textContent = qualitySummary();
                setTimeout(() => {
                    els.endOverlay.classList.add('visible');
                    els.endOverlay.setAttribute('aria-hidden', 'false');
                }, 280);
            }

            function getResultText() {
                if (state.isTimeout) {
                    const winner = state.timeW <= 0 ? 'Noirs' : 'Blancs';
                    return { title: 'Temps écoulé', detail: `${winner} gagne à la pendule.` };
                }
                if (game.in_checkmate()) {
                    const winner = game.turn() === 'w' ? 'Noirs' : 'Blancs';
                    return { title: 'Échec et mat', detail: `${winner} gagne.` };
                }
                if (game.in_stalemate()) return { title: 'Pat', detail: 'La partie est nulle.' };
                if (game.in_threefold_repetition()) return { title: 'Répétition', detail: 'La partie est nulle.' };
                if (game.insufficient_material()) return { title: 'Matériel insuffisant', detail: 'La partie est nulle.' };
                if (state.mode === 'puzzle' && state.puzzleStep >= puzzles[state.puzzleIndex].seq.length) {
                    return { title: 'Problème résolu', detail: puzzles[state.puzzleIndex].desc };
                }
                return { title: 'Partie terminée', detail: 'La partie est terminée.' };
            }

            function qualitySummary() {
                const scored = state.moves.filter(move => move.quality);
                if (!scored.length) return '--';
                const good = scored.filter(move => move.quality === 'good' || move.quality === 'brilliant').length;
                return Math.round((good / scored.length) * 100) + '%';
            }

            function formatDuration(seconds) {
                seconds = Math.max(0, Math.floor(seconds));
                const min = Math.floor(seconds / 60);
                const sec = seconds % 60;
                return `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }

            function computeResultCode() {
                if (state.isTimeout) return state.timeW <= 0 ? '0-1' : '1-0';
                if (game.in_checkmate()) return game.turn() === 'w' ? '0-1' : '1-0';
                if (game.in_draw()) return '1/2-1/2';
                return '*';
            }

            function buildPGN() {
                const result = computeResultCode();
                game.header('Result', result);
                const pgn = game.pgn({ max_width: 80, newline_char: '\n' });
                return pgn.endsWith(result) || result === '*' ? pgn : `${pgn} ${result}`;
            }

            function exportPGN() {
                const blob = new Blob([buildPGN()], { type: 'application/x-chess-pgn;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `guys-game-${new Date().toISOString().slice(0, 10)}.pgn`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(url);
            }

            async function copyPGN() {
                const pgn = buildPGN();
                const copied = await writeClipboard(pgn);
                if (copied) {
                    els.analysisOutput.textContent = 'PGN copié.';
                } else {
                    els.analysisOutput.textContent = pgn;
                }
            }

            async function writeClipboard(text) {
                try {
                    if (!navigator.clipboard?.writeText) return false;
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (err) {
                    return false;
                }
            }

            async function analyzeGameOnline() {
                if (!state.moves.length) {
                    els.endOnlineStatus.textContent = 'Aucun PGN à analyser.';
                    return;
                }
                const pgn = buildPGN();
                els.endOnlineBtn.disabled = true;
                els.endOnlineStatus.textContent = 'Envoi du PGN à Lichess...';
                let analysisWindow = null;
                try {
                    analysisWindow = window.open('about:blank', '_blank');
                    if (analysisWindow) {
                        analysisWindow.opener = null;
                        analysisWindow.document.title = 'Analyse Lichess';
                        analysisWindow.document.body.style.fontFamily = 'system-ui, sans-serif';
                        analysisWindow.document.body.style.padding = '24px';
                        analysisWindow.document.body.textContent = 'Import de la partie vers Lichess...';
                    }
                } catch (err) {
                    analysisWindow = null;
                }
                try {
                    const response = await fetch('https://lichess.org/api/import', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({ pgn }).toString()
                    });
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    const data = await response.json();
                    const url = data.url || (data.id ? `https://lichess.org/${data.id}` : 'https://lichess.org/paste');
                    openOnlineAnalysisUrl(url, analysisWindow);
                    els.endOnlineStatus.textContent = 'Analyse Lichess ouverte.';
                } catch (err) {
                    const copied = await writeClipboard(pgn);
                    openOnlineAnalysisUrl('https://lichess.org/paste', analysisWindow);
                    els.endOnlineStatus.textContent = copied
                        ? 'Import automatique bloqué. PGN copié, page Lichess ouverte.'
                        : 'Import automatique bloqué. PGN affiché dans le panneau analyse.';
                    if (!copied) els.analysisOutput.textContent = pgn;
                } finally {
                    els.endOnlineBtn.disabled = false;
                }
            }

            function openOnlineAnalysisUrl(url, targetWindow) {
                if (targetWindow && !targetWindow.closed) {
                    targetWindow.location.href = url;
                } else {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            }

            async function runClaudeAnalysis() {
                const endpoint = els.claudeEndpoint.value.trim();
                const key = els.claudeKey.value.trim();
                localStorage.setItem('guysGameClaudeEndpoint', endpoint);
                if (!endpoint) {
                    els.analysisOutput.textContent = 'Ajoutez un endpoint Claude ou un proxy local, puis relancez.';
                    return;
                }
                const result = getResultText();
                const prompt = [
                    'Tu es un coach d echecs francophone.',
                    'Analyse cette partie coup par coup avec des commentaires courts.',
                    'Pour chaque phase, signale les coups brillants, bons, inexacts et les erreurs.',
                    'Termine par trois conseils concrets.',
                    '',
                    'PGN:',
                    buildPGN()
                ].join('\n');
                const payload = {
                    provider: 'anthropic',
                    task: 'chess_post_game_analysis',
                    prompt,
                    game: {
                        result: result.detail,
                        pgn: buildPGN(),
                        moves: state.moves.map((move, index) => ({
                            ply: index + 1,
                            san: move.san,
                            from: move.from,
                            to: move.to,
                            color: move.color,
                            quality: move.qualityLabel,
                            centipawns: move.afterCp
                        })),
                        stats: {
                            moves: state.moves.length,
                            duration: state.endedAt ? formatDuration((state.endedAt - state.startedAt) / 1000) : formatDuration((Date.now() - state.startedAt) / 1000),
                            quality: qualitySummary()
                        }
                    }
                };
                els.analysisOutput.textContent = 'Analyse Claude en cours...';
                try {
                    const headers = { 'Content-Type': 'application/json' };
                    if (key) {
                        headers.Authorization = 'Bearer ' + key;
                        headers['x-api-key'] = key;
                    }
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    const data = await response.json();
                    const text = data.analysis
                        || data.text
                        || data.content?.map(part => part.text || '').join('\n')
                        || data.message?.content?.map(part => part.text || '').join('\n')
                        || data.choices?.[0]?.message?.content
                        || JSON.stringify(data, null, 2);
                    els.analysisOutput.textContent = text;
                } catch (err) {
                    els.analysisOutput.textContent = 'Analyse indisponible : ' + err.message;
                }
            }

            function playMoveSound(move) {
                if (move.san.includes('#')) playSoundPattern('mate');
                else if (move.san.includes('+')) playSoundPattern('check');
                else if (move.captured) playSoundPattern('capture');
                else playSoundPattern('move');
            }

            function playSoundPattern(type) {
                if (!state.soundEnabled) return;
                if (type === 'move') playTone(520, 0.05, 'sine');
                if (type === 'capture') {
                    playTone(260, 0.06, 'triangle');
                    setTimeout(() => playTone(420, 0.05, 'triangle'), 55);
                }
                if (type === 'check') {
                    playTone(740, 0.08, 'sine');
                    setTimeout(() => playTone(960, 0.08, 'sine'), 85);
                }
                if (type === 'mate') {
                    playTone(240, 0.16, 'sawtooth');
                    setTimeout(() => playTone(180, 0.2, 'sawtooth'), 150);
                }
            }

            function playTone(frequency, duration, type) {
                if (!state.soundEnabled) return;
                try {
                    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    oscillator.type = type || 'sine';
                    oscillator.frequency.value = frequency;
                    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
                    oscillator.connect(gain);
                    gain.connect(audioCtx.destination);
                    oscillator.start();
                    oscillator.stop(audioCtx.currentTime + duration + 0.02);
                } catch (err) {
                    state.soundEnabled = false;
                    els.toggleSound.checked = false;
                }
            }

            function playTrack(index) {
                if (!state.playlist.length) return;
                state.currentTrack = ((index % state.playlist.length) + state.playlist.length) % state.playlist.length;
                const track = state.playlist[state.currentTrack];
                if (state.currentMusicObjectUrl) {
                    URL.revokeObjectURL(state.currentMusicObjectUrl);
                    state.currentMusicObjectUrl = null;
                }
                const src = track.source === 'local' ? URL.createObjectURL(track.file) : track.url;
                if (track.source === 'local') state.currentMusicObjectUrl = src;
                els.audioPlayer.src = src;
                els.audioPlayer.play().then(() => {
                    els.currentTrackName.textContent = track.artist ? `${track.name} - ${track.artist}` : track.name;
                    els.playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
                    lucide.createIcons();
                }).catch(() => {
                    els.currentTrackName.textContent = track.artist ? `${track.name} - ${track.artist}` : track.name;
                });
            }

            function addOnlineTrack(track, playNow = false) {
                const existing = state.playlist.findIndex(item => item.source === 'online' && item.url === track.url);
                const index = existing >= 0 ? existing : state.playlist.push(track) - 1;
                els.musicSearchStatus.textContent = playNow ? 'Lecture de l’aperçu en ligne.' : 'Morceau ajouté à la playlist.';
                if (playNow || state.playlist.length === 1) playTrack(index);
            }

            async function searchOnlineMusic() {
                const term = els.musicSearchInput.value.trim();
                if (!term) {
                    els.musicSearchStatus.textContent = 'Entrez un titre, artiste ou album.';
                    return;
                }
                els.musicSearchStatus.textContent = 'Recherche en ligne...';
                els.musicSearchBtn.disabled = true;
                els.musicSearchResults.innerHTML = '';
                try {
                    const url = 'https://itunes.apple.com/search?media=music&entity=song&limit=12&country=FR&term=' + encodeURIComponent(term);
                    const data = await fetchItunesResults(url);
                    state.onlineMusicResults = (data.results || [])
                        .filter(item => item.previewUrl)
                        .map(item => ({
                            source: 'online',
                            name: item.trackName || 'Titre inconnu',
                            artist: item.artistName || 'Artiste inconnu',
                            album: item.collectionName || '',
                            url: item.previewUrl,
                            artwork: item.artworkUrl100 || '',
                            storeUrl: item.trackViewUrl || item.collectionViewUrl || ''
                        }));
                    renderOnlineMusicResults();
                } catch (err) {
                    els.musicSearchStatus.textContent = 'Recherche indisponible : ' + err.message;
                } finally {
                    els.musicSearchBtn.disabled = false;
                }
            }

            async function fetchItunesResults(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return await response.json();
                } catch (fetchError) {
                    return fetchItunesJsonp(url);
                }
            }

            function fetchItunesJsonp(url) {
                return new Promise((resolve, reject) => {
                    const callbackName = 'itunesSearchCB_' + Date.now() + '_' + Math.random().toString(36).slice(2);
                    const script = document.createElement('script');
                    const cleanup = () => {
                        delete window[callbackName];
                        script.remove();
                    };
                    const timeout = setTimeout(() => {
                        cleanup();
                        reject(new Error('délai dépassé'));
                    }, 9000);
                    window[callbackName] = data => {
                        clearTimeout(timeout);
                        cleanup();
                        resolve(data);
                    };
                    script.onerror = () => {
                        clearTimeout(timeout);
                        cleanup();
                        reject(new Error('source en ligne inaccessible'));
                    };
                    script.src = url + '&callback=' + callbackName;
                    document.head.appendChild(script);
                });
            }

            function renderOnlineMusicResults() {
                els.musicSearchResults.innerHTML = '';
                if (!state.onlineMusicResults.length) {
                    els.musicSearchStatus.textContent = 'Aucun aperçu trouvé.';
                    return;
                }
                els.musicSearchStatus.textContent = `${state.onlineMusicResults.length} aperçu(s) trouvé(s).`;
                state.onlineMusicResults.forEach((track, index) => {
                    const row = document.createElement('div');
                    row.className = 'music-result';

                    const art = document.createElement('img');
                    art.className = 'music-art';
                    art.alt = '';
                    art.src = track.artwork || '';

                    const meta = document.createElement('div');
                    meta.className = 'music-meta';
                    const title = document.createElement('strong');
                    title.textContent = track.name;
                    const artist = document.createElement('span');
                    artist.textContent = track.album ? `${track.artist} - ${track.album}` : track.artist;
                    meta.append(title, artist);

                    const actions = document.createElement('div');
                    actions.className = 'music-actions';
                    const play = document.createElement('button');
                    play.type = 'button';
                    play.className = 'icon-btn';
                    play.title = 'Lire';
                    play.innerHTML = '<i data-lucide="play"></i>';
                    play.addEventListener('click', () => addOnlineTrack(state.onlineMusicResults[index], true));
                    const add = document.createElement('button');
                    add.type = 'button';
                    add.className = 'icon-btn';
                    add.title = 'Ajouter';
                    add.innerHTML = '<i data-lucide="plus"></i>';
                    add.addEventListener('click', () => addOnlineTrack(state.onlineMusicResults[index], false));
                    actions.append(play, add);
                    if (track.storeUrl) {
                        const link = document.createElement('a');
                        link.className = 'icon-btn';
                        link.title = 'Voir sur iTunes';
                        link.href = track.storeUrl;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.innerHTML = '<i data-lucide="external-link"></i>';
                        actions.append(link);
                    }

                    row.append(art, meta, actions);
                    els.musicSearchResults.appendChild(row);
                });
                lucide.createIcons();
            }

            function squareFromEvent(event) {
                const rect = els.board.getBoundingClientRect();
                const size = rect.width / 8;
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
                const fileIndex = Math.floor(x / size);
                const rankIndex = Math.floor(y / size);
                const files = board.orientation() === 'black' ? 'hgfedcba' : 'abcdefgh';
                const rank = board.orientation() === 'black' ? rankIndex + 1 : 8 - rankIndex;
                return files[fileIndex] + rank;
            }

            function squareCenter(square) {
                const orientation = board.orientation();
                const fileRaw = 'abcdefgh'.indexOf(square[0]);
                const rankRaw = parseInt(square[1], 10);
                const file = orientation === 'black' ? 7 - fileRaw : fileRaw;
                const rank = orientation === 'black' ? rankRaw - 1 : 8 - rankRaw;
                const size = els.board.getBoundingClientRect().width / 8;
                return { x: (file + 0.5) * size, y: (rank + 0.5) * size };
            }

            function resizeArrowSVG() {
                const rect = els.board.getBoundingClientRect();
                if (rect.width && rect.height) els.arrowLayer.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
            }

            function clearArrows() {
                const defs = els.arrowLayer.querySelector('defs')?.outerHTML || '';
                els.arrowLayer.innerHTML = defs;
            }

            function arrowTargets(square) {
                const piece = game.get(square);
                if (!piece) return null;
                if (piece.color === game.turn()) return game.moves({ square, verbose: true }).map(move => move.to);
                const tokens = game.fen().split(' ');
                tokens[1] = piece.color;
                tokens[3] = '-';
                const tmp = new Chess();
                return tmp.load(tokens.join(' ')) ? tmp.moves({ square, verbose: true }).map(move => move.to) : null;
            }

            function startArrow(event) {
                if (event.button !== 2) return;
                event.preventDefault();
                event.stopPropagation();
                const square = squareFromEvent(event);
                if (!square) return;
                state.drawingArrow = true;
                state.arrowStart = square;
                state.allowedArrowTargets = arrowTargets(square);
                const piece = game.get(square);
                const isEnemy = piece && piece.color !== game.turn();
                const color = isEnemy ? 'rgba(104,211,145,0.88)' : 'rgba(239,90,77,0.88)';
                const marker = isEnemy ? 'url(#ah-green)' : 'url(#ah-red)';
                const start = squareCenter(square);
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', start.x);
                line.setAttribute('y1', start.y);
                line.setAttribute('x2', start.x);
                line.setAttribute('y2', start.y);
                line.setAttribute('stroke', color);
                line.setAttribute('stroke-width', '10');
                line.setAttribute('stroke-linecap', 'round');
                line.setAttribute('marker-end', marker);
                els.arrowLayer.appendChild(line);
                state.currentArrowLine = line;
            }

            function moveArrow(event) {
                if (!state.drawingArrow || !state.currentArrowLine) return;
                const rect = els.board.getBoundingClientRect();
                state.currentArrowLine.setAttribute('x2', event.clientX - rect.left);
                state.currentArrowLine.setAttribute('y2', event.clientY - rect.top);
            }

            function endArrow(event) {
                if (!state.drawingArrow) return;
                state.drawingArrow = false;
                const endSquare = squareFromEvent(event);
                if (!endSquare || endSquare === state.arrowStart || (state.allowedArrowTargets && !state.allowedArrowTargets.includes(endSquare))) {
                    state.currentArrowLine?.remove();
                    state.currentArrowLine = null;
                    return;
                }
                const start = squareCenter(state.arrowStart);
                const end = squareCenter(endSquare);
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                state.currentArrowLine.setAttribute('x2', end.x - (dx / len) * 18);
                state.currentArrowLine.setAttribute('y2', end.y - (dy / len) * 18);
                state.currentArrowLine = null;
            }

            function lockBoardTouch(event) {
                if (!event.target.closest('#board')) return;
                state.touchBoardLocked = true;
                document.body.classList.add('board-touch-lock');
            }

            function preventBoardTouchScroll(event) {
                if (!state.touchBoardLocked) return;
                if (event.cancelable) event.preventDefault();
            }

            function unlockBoardTouch() {
                state.touchBoardLocked = false;
                document.body.classList.remove('board-touch-lock');
            }

            function applyTheme() {
                const theme = boardThemes[els.boardTheme.value] || boardThemes.forest;
                document.documentElement.style.setProperty('--board-light', theme.light);
                document.documentElement.style.setProperty('--board-dark', theme.dark);
                document.body.classList.toggle('colorblind', state.colorblind);
            }

            function bindEvents() {
                els.introModeGrid.addEventListener('click', event => {
                    const card = event.target.closest('.mode-card');
                    if (!card) return;
                    state.introMode = card.dataset.mode;
                    els.introModeGrid.querySelectorAll('.mode-card').forEach(btn => btn.classList.remove('is-selected'));
                    card.classList.add('is-selected');
                });
                els.enterGameBtn.addEventListener('click', showGameFromIntro);
                els.homeBtn.addEventListener('click', showIntro);
                els.modeTabs.addEventListener('click', event => {
                    const btn = event.target.closest('button[data-mode]');
                    if (btn) setMode(btn.dataset.mode);
                });
                els.resetBtn.addEventListener('click', resetGame);
                els.newGameTopBtn.addEventListener('click', resetGame);
                els.focusBoardBtn.addEventListener('click', toggleBoardFocus);
                els.mobilePanelBtn.addEventListener('click', toggleMobilePanels);
                els.installAppBtn.addEventListener('click', installPwaApp);
                els.endNewBtn.addEventListener('click', resetGame);
                els.undoBtn.addEventListener('click', doUndo);
                els.exportBtn.addEventListener('click', exportPGN);
                els.exportTopBtn.addEventListener('click', exportPGN);
                els.endExportBtn.addEventListener('click', exportPGN);
                els.copyPgnBtn.addEventListener('click', copyPGN);
                els.claudeBtn.addEventListener('click', runClaudeAnalysis);
                els.endAnalyzeBtn.addEventListener('click', () => {
                    els.endOverlay.classList.remove('visible');
                    runClaudeAnalysis();
                });
                els.endOnlineBtn.addEventListener('click', analyzeGameOnline);
                els.navFirst.addEventListener('click', () => goToMove(0));
                els.navPrev.addEventListener('click', () => goToMove(state.browseIndex - 1));
                els.navNext.addEventListener('click', () => isBrowsing() ? goToMove(state.browseIndex + 1) : goToEnd());
                els.navLast.addEventListener('click', goToEnd);
                [els.timeWhite, els.timeBlack, els.botProfile].forEach(el => el.addEventListener('change', resetGame));
                els.playerSide.addEventListener('change', () => {
                    createBoard();
                    if (state.mode === 'bot') resetGame();
                });
                els.boardTheme.addEventListener('change', () => {
                    state.colorblind = els.boardTheme.value === 'colorblind';
                    els.toggleColorblind.checked = state.colorblind;
                    applyTheme();
                });
                els.pieceColor.addEventListener('change', applyPieceFilter);
                els.toggleEval.addEventListener('change', () => {
                    state.evalEnabled = els.toggleEval.checked;
                    els.evalBar.classList.toggle('hidden', !state.evalEnabled);
                    if (state.evalEnabled) requestEval(isBrowsing() ? state.fenHistory[state.browseIndex] : game.fen(), true);
                    setTimeout(() => {
                        board.resize();
                        resizeArrowSVG();
                    }, 40);
                });
                els.togglePremove.addEventListener('change', () => {
                    state.premoveEnabled = els.togglePremove.checked;
                    if (!state.premoveEnabled) {
                        state.premoveQueue = [];
                        renderPremoves();
                    }
                });
                els.toggleSound.addEventListener('change', () => {
                    state.soundEnabled = els.toggleSound.checked;
                });
                els.toggleColorblind.addEventListener('change', () => {
                    state.colorblind = els.toggleColorblind.checked;
                    if (state.colorblind) els.boardTheme.value = 'colorblind';
                    else if (els.boardTheme.value === 'colorblind') els.boardTheme.value = 'forest';
                    applyTheme();
                });
                els.musicFiles.addEventListener('change', event => {
                    const files = Array.from(event.target.files || []);
                    if (!files.length) return;
                    const wasEmpty = state.playlist.length === 0;
                    state.playlist = state.playlist.concat(files.map(file => ({
                        source: 'local',
                        name: file.name,
                        file
                    })));
                    if (wasEmpty) playTrack(0);
                });
                els.musicSearchBtn.addEventListener('click', searchOnlineMusic);
                els.musicSearchInput.addEventListener('keydown', event => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        searchOnlineMusic();
                    }
                });
                els.playPauseBtn.addEventListener('click', () => {
                    if (!state.playlist.length) return;
                    if (els.audioPlayer.paused) {
                        els.audioPlayer.play();
                        els.playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
                    } else {
                        els.audioPlayer.pause();
                        els.playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
                    }
                    lucide.createIcons();
                });
                els.nextTrackBtn.addEventListener('click', () => playTrack(state.currentTrack + 1));
                els.audioPlayer.addEventListener('ended', () => playTrack(state.currentTrack + 1));
                els.boardWrapper.addEventListener('contextmenu', event => event.preventDefault());
                els.boardWrapper.addEventListener('mousedown', event => {
                    if (event.button === 2) startArrow(event);
                    if (event.button === 0) clearArrows();
                }, true);
                els.boardWrapper.addEventListener('touchstart', lockBoardTouch, { passive: true });
                els.boardWrapper.addEventListener('touchmove', preventBoardTouchScroll, { passive: false });
                els.boardWrapper.addEventListener('touchend', unlockBoardTouch, { passive: true });
                els.boardWrapper.addEventListener('touchcancel', unlockBoardTouch, { passive: true });
                els.boardWrapper.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
                document.addEventListener('touchmove', preventBoardTouchScroll, { passive: false });
                document.addEventListener('touchend', unlockBoardTouch, { passive: true });
                document.addEventListener('touchcancel', unlockBoardTouch, { passive: true });
                document.addEventListener('mousemove', moveArrow);
                document.addEventListener('mouseup', endArrow);
                els.board.addEventListener('mousedown', event => {
                    if (event.button !== 0 || !state.selectedSquare) return;
                    const squareEl = event.target.closest('.square-55d63');
                    if (!squareEl) return;
                    const square = squareEl.dataset.square;
                    if (!square || square === state.selectedSquare) return;
                    const piece = game.get(square);
                    if (isHumanTurn()) {
                        if (piece && piece.color === game.turn()) return;
                    } else if (state.premoveEnabled) {
                        if (piece && piece.color === premoveColor()) return;
                    }
                    handleClickOnSquare(square);
                    event.preventDefault();
                    event.stopPropagation();
                }, true);
                document.addEventListener('mousedown', event => {
                    if (!event.target.closest('#boardWrapper') && !event.target.closest('.end-overlay')) {
                        clearSelectionAndPremoves();
                    }
                });
                document.addEventListener('keydown', event => {
                    const tag = event.target.tagName;
                    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return;
                    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
                        event.preventDefault();
                        doUndo();
                        return;
                    }
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        goToMove(state.browseIndex - 1);
                    }
                    if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        isBrowsing() ? goToMove(state.browseIndex + 1) : goToEnd();
                    }
                    if (event.key === 'Home') {
                        event.preventDefault();
                        goToMove(0);
                    }
                    if (event.key === 'End') {
                        event.preventDefault();
                        goToEnd();
                    }
                });
                window.addEventListener('resize', () => {
                    if (!isMobileViewport() && state.boardFocus) {
                        setBoardFocus(false);
                        return;
                    }
                    if (board) board.resize();
                    resizeArrowSVG();
                });
            }

            function doUndo() {
                if (isBrowsing()) {
                    goToEnd();
                    return;
                }
                if (state.mode === 'puzzle' || state.isTimeout || !state.moves.length) return;
                state.botToken++;
                state.isBotThinking = false;
                state.premoveQueue = [];
                clearSelection();
                clearArrows();
                const count = Math.min(state.mode === 'bot' ? 2 : 1, state.moves.length);
                for (let i = 0; i < count; i++) game.undo();
                state.moves.splice(-count);
                state.fenHistory.splice(-count);
                state.browseIndex = state.fenHistory.length - 1;
                state.currentEvalCp = state.moves.length ? state.moves[state.moves.length - 1].afterCp : 0;
                board.position(game.fen(), false);
                renderMoveHistory();
                updateNavButtons();
                updateLastMove(state.moves[state.moves.length - 1] || null);
                updateClockUI();
                updateStatus();
            }

            function loadStoredSettings() {
                const endpoint = localStorage.getItem('guysGameClaudeEndpoint');
                if (endpoint) els.claudeEndpoint.value = endpoint;
            }

            renderIntroBoard();
            bindEvents();
            loadStoredSettings();
            registerPwa();
            updateModeUI();
            game.reset();
            createBoard();
            initHistory();
            initClocks();
            updateStatus();
            lucide.createIcons();
        });

