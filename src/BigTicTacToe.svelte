<script lang="ts">

	import { Board } from './Board'
	import { BigBoard } from './BigBoard'
	import { BigPos } from './BigPos'
	import { Pos } from './Pos'
    
    let playerzahl = $state(2)
    let player = $state(Math.floor(Math.random() * playerzahl) + 1)
    let playerstring = $state('O')
    let sizex = $state(3)
    let sizey = $state(3)
    let winnerzahl = $state(3)
    let winnerdir :Pos[] = []
    let winnerdir2 :Pos[] = []
    let winnertext = $state('spiel läuft')
    let spielmodus = $state('3x3')
    //let zuege :BigPos[] = []
    let aktuellesx2 :number | undefined = $state(undefined)
    let aktuellesy2 :number | undefined = $state(undefined)

    let text = $state('f')
    if (player === 1) {
        playerstring = 'O'
    } else {
        playerstring = 'X'
    }

    function createboard (sizex :number, sizey :number) :number[][] {
        let newmatrix :number[][] = []
        for (let i = 0; i < sizex; i++) {
            newmatrix.push([])
            for (let j = 0; j < sizey; j++) {
                newmatrix[i].push(0)
            }
        }
        return newmatrix
    }

    let matrix = $state(createboard(sizex, sizey))
    let bigboard = new Board(matrix)

    function createbigboard (sizex :number, sizey :number) :number[][][][] {
        let newmatrix :number[][][][] = []
        for (let i = 0; i < sizex; i++) {
            newmatrix.push([])
            for (let j = 0; j < sizey; j++) {
                newmatrix[i].push([])
                for (let k = 0; k < sizex; k++) {
                    newmatrix[i][j].push([])
                    for (let l = 0; l < sizey; l++) {
                        newmatrix[i][j][k].push(0)
                    }
                }
            }
        }
        return newmatrix
    }

    let bigmatrix = $state(createbigboard(sizex, sizey))
    let board = new BigBoard(bigmatrix)

    resetGame()
    bigboard.setAll(0)

    function valuezaehler (x2 :number, y2 :number, pos :Pos, richtung :Pos) :boolean {
        let newpos = pos
        let value = 0
        newpos = newpos.add(richtung)
        text = board.get(new BigPos(x2, y2, newpos.x, newpos.y)),toString()
        while (board.get(new BigPos(x2, y2, newpos.x, newpos.y)) !== undefined && board.get(new BigPos(x2, y2, newpos.x, newpos.y)) === player) {
            value++
            newpos = newpos.add(richtung)
        }
        newpos = pos
        newpos = newpos.add(richtung.neg())
        while (board.get(new BigPos(x2, y2, newpos.x, newpos.y)) !== undefined && board.get(new BigPos(x2, y2, newpos.x, newpos.y)) === player) {
            value++
            newpos = newpos.add(richtung.neg())
        }
        if (value >= winnerzahl - 1) {
            winnerdir.push(richtung)
            return true
        }
        return false
    }

    let dir = [new Pos(1, 1), new Pos(0, 1), new Pos(-1, 1), new Pos(1, 0)]

    function iswinner (x2 :number, y2 :number, x :number, y :number) :boolean {
        let pos = new Pos(x, y)
        let winner = false
        for (let i = 0; i < dir.length; i++) {
            if (valuezaehler(x2, y2, pos, dir[i])) {
                winnerdir.push(dir[i])
                board.setwinner(player)
                winner = true
            }
        }
        if (winner === true) {
            let bigboardpos = new Pos(x2, y2)
            bigboard.set(bigboardpos, player)
        }
        return winner
    }

    function winnermark (x2 :number, y2:number, x :number, y :number) :void { //geht aktuell nur eins weiter
        let pos = new BigPos(x2, y2, x, y)
        board.set(pos, -player)
        let newpos = pos
        for (let i = 0; i < winnerdir.length; i++) {
            newpos = pos
            let addpos = new BigPos(0, 0, winnerdir[i].x, winnerdir[i].y)
            newpos = newpos.add(addpos)
            while (board.inside(newpos) && board.get(newpos) === player) {
                board.set(newpos, -player)
                newpos = newpos.add(addpos)
            }
            newpos = pos
            newpos = newpos.add(addpos.neg())
            while (board.inside(newpos) && board.get(newpos) === player) {
                board.set(newpos, -player)
                newpos = newpos.add(addpos.neg())
            }
        }
    }

    function valuezaehler2 (pos :Pos, richtung :Pos) :boolean { 
        let newpos = pos
        let value = 0
        newpos = newpos.add(richtung)
        while (bigboard.inside(newpos) && bigboard.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung)
        }
        newpos = pos
        newpos = newpos.add(richtung.neg())
        while (bigboard.inside(newpos) && bigboard.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung.neg())
        }
        if (value >= winnerzahl - 1) {
            return true
        }
        return false
    }

    function iswinner2 (x :number, y :number) :boolean {
        let pos = new Pos(x, y)
        let winner = false
        for (let i = 0; i < dir.length; i++) {
            if (valuezaehler2(pos, dir[i])) {
                winnerdir2.push(dir[i])
                winnertext = 'gewonnen' + player.toString()
                bigboard.setwinner(player)
                winner = true
            }
        }
        return winner
    }

    function winnermark2 (x :number, y :number) :void {
        let pos = new Pos(x, y)
        bigboard.set(pos, -player)
        let newpos = pos
        for (let i = 0; i < winnerdir2.length; i++) {
            newpos = pos
            newpos = newpos.add(winnerdir2[i])
            while (bigboard.inside(newpos) && bigboard.get(newpos) === player) {
                bigboard.set(newpos, -player)
                newpos = newpos.add(winnerdir2[i])
            }
            newpos = pos
            newpos = newpos.add(winnerdir2[i].neg())
            while (bigboard.inside(newpos) && bigboard.get(newpos) === player) {
                bigboard.set(newpos, -player)
                newpos = newpos.add(winnerdir2[i].neg())
            }
        }
    }


    function handleClick (x2 :number, y2 :number, x :number, y :number) :void {
        if (bigboard.get(new Pos(x2, y2)) !== 0) return 
        if ((aktuellesx2 !== x2 || aktuellesy2 !== y2) && (aktuellesx2 !== undefined && aktuellesy2 !== undefined)) return
        if (winnertext !== 'spiel läuft') return
        let pos = new BigPos(x2, y2, x, y)
        if (board.get(pos) !== 0) return
        if (board.get(pos) === 0) {
            text = board.get(pos).toString()
            board.set(pos, player)           
            if (iswinner(x2, y2, x, y)) {
                winnermark(x2, y2, x, y)
                aktuellesx2 = x
                aktuellesy2 = y
                if (bigboard.get(new Pos(x, y)) !== 0) {
                    aktuellesx2 = undefined
                    aktuellesy2 = undefined
                }
                bigboard.set(new Pos(x2, y2), player)
                if (iswinner2(x2, y2)) {
                    text = bigboard.get(new Pos(x2, y2)).toString()
                    winnermark2(x2, y2)
                    //player = (player % playerzahl) + 1
                    let winner = '-'
                    if (player === 1) {
                        winner = 'O'
                    } else if (player === 2) {
                        winner = 'X'
                    }
                    winnertext = 'gewonnen hat ' + winner
                    return
                }
                player = (player % playerzahl) + 1
                if (player === 1) {
                    playerstring = 'O'
                } else {
                    playerstring = 'X'
                }
                return
            } 
            if (board.smallfull(x2, y2)) {
                bigboard.set(new Pos(x2, y2), 3)
            }
            player = (player % playerzahl) + 1
            if (player === 1) {
                playerstring = 'O'
            } else {
                playerstring = 'X'
            }
        }
        aktuellesx2 = x
        aktuellesy2 = y
        if (bigboard.get(new Pos(x, y)) !== 0) {
            aktuellesx2 = undefined
            aktuellesy2 = undefined
        }
    }

    function resetGame () :void {
        board.setAll(0)
        winnertext = 'spiel läuft'
        player = Math.floor(Math.random() * playerzahl) + 1
        if (player === 1) {
            playerstring = 'O'
        } else {
            playerstring = 'X'
        }
        aktuellesx2 = undefined
        aktuellesy2 = undefined
        bigboard.setAll(0)
    } 

</script>

<div class="flex justify-center gap-2 p-2">

    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={resetGame} >
	    reset
    </button>

    <p class="px-5 py-2.5">Spieler: Player {playerstring}</p>
    <p class="px-5 py-2.5">{winnertext}</p>


</div>

<div class="align-items-center flex flex-col gap-10 pt-10 text-center">
    <div class="m-auto w-fit border-4 border-black p-2">
        {#each bigmatrix as boardRow, x2}
            <div class="flex">
                {#each boardRow as smallBoard, y2}
                    <div class={[
                        "relative", // wichtig für die Zentrierung des absoluten Elements
                        x2 === aktuellesx2 && y2 === aktuellesy2
                            ? "m-1 border-2 border-green-500"
                            : "m-1 border-2 border-gray-700"
                    ]}>
                        <!-- Anzeige des Gewinners im großen Feld -->
                        {#if bigboard.get(new Pos(x2, y2)) === 1}
                            <div class="absolute inset-0 z-10 flex items-center justify-center text-8xl font-extrabold text-blue-500">
                                O
                            </div>
                        {:else if bigboard.get(new Pos(x2, y2)) === 2}
                            <div class="absolute inset-0 z-10 flex items-center justify-center text-8xl font-extrabold text-red-500">
                                X
                            </div>
                        {:else if bigboard.get(new Pos(x2, y2)) === -1}
                            <div class="absolute inset-0 z-10 flex items-center justify-center text-8xl font-extrabold text-blue-500 bg-blue-300 bg-opacity-50">
                                O
                            </div>
                        {:else if bigboard.get(new Pos(x2, y2)) === -2}
                            <div class="absolute inset-0 z-10 flex items-center justify-center text-8xl font-extrabold text-red-500 bg-red-300 bg-opacity-50">
                                X
                            </div>
                        {:else if bigboard.get(new Pos(x2, y2)) === 3}
                            <div class="absolute inset-0 z-10 flex items-center justify-center text-8xl font-extrabold text-gray-500 bg-gray-300 bg-opacity-50">
                                -
                            </div>
                        {/if}

                        <!-- Das kleine Board -->
                        <div class="relative">
                            {#each smallBoard as row, x}
                                <div class="flex">
                                    {#each row as value, y}
                                        <button
                                            class={[
                                                'size-10 border border-gray-200 align-middle enabled:hover:bg-slate-100',
                                                value === 1 && 'text-blue-500 font-extrabold text-2xl',
                                                value === 2 && 'text-red-500 font-extrabold text-2xl',
                                                value === -1 && 'bg-blue-300 text-blue-500 font-extrabold',
                                                value === -2 && 'bg-red-300 text-red-500 font-extrabold',
                                            ]}
                                            onclick={() => handleClick(x2, y2, x, y)}
                                        >
                                            {#if value === 1 || value === -1}
                                                O
                                            {:else if value === 2 || value === -2}
                                                X
                                            {/if}
                                        </button>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<!--
[
  [ <-- i = 0
    [[0,0,0],[0,0,0],[0,0,0]], <-- j = 0 
    [[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0]],
  ],
  [
    [[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0]],
  ],
  [
    [[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0]],
    [[0,0,0],[0,0,0],[0,0,0]],
  ],
]
-->