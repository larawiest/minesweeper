<script lang="ts">

	import { Board } from './Board.ts'
	import { Pos } from './Pos.ts'

    let playerzahl = $state(2)
    let player = $state(Math.floor(Math.random() * playerzahl) + 1)
    let sizex = $state(3)
    let sizey = $state(3)
    let winnerzahl = $state(3)
    let winnerdir :Pos[] = []
    let winnertext = $state('spiel läuft')
    let spielmodus = $state('3x3')
    let zuege :Pos[] = []

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
    let board = new Board(matrix)

    resetGame()

    let dir = [new Pos(1, 1), new Pos(0, 1), new Pos(-1, 1), new Pos(1, 0)]

    function valuezaehler (pos :Pos, richtung :Pos) :boolean { 
        let newpos = pos
        let value = 0
        newpos = newpos.add(richtung)
        while (board.inside(newpos) && board.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung)
        }
        newpos = pos
        newpos = newpos.add(richtung.neg())
        while (board.inside(newpos) && board.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung.neg())
        }
        if (value >= winnerzahl - 1) {
            return true
        }
        return false
    }

    function iswinner (x :number, y :number) :boolean {
        let pos = new Pos(x, y)
        let winner = false
        for (let i = 0; i < dir.length; i++) {
            if (valuezaehler(pos, dir[i])) {
                winnerdir.push(dir[i])
                winnertext = 'gewonnen'
                board.setwinner(player)
                winner = true
            }
        }
        return winner
    }

    function winnermark (x :number, y :number) :void {
        let pos = new Pos(x, y)
        board.set(pos, -player)
        let newpos = pos
        for (let i = 0; i < winnerdir.length; i++) {
            newpos = pos
            newpos = newpos.add(winnerdir[i])
            while (board.inside(newpos) && board.get(newpos) === player) {
                board.set(newpos, -player)
                newpos = newpos.add(winnerdir[i])
            }
            newpos = pos
            newpos = newpos.add(winnerdir[i].neg())
            while (board.inside(newpos) && board.get(newpos) === player) {
                board.set(newpos, -player)
                newpos = newpos.add(winnerdir[i].neg())
            }
        }
    }

    function handleClick (x :number, y :number) :void {
        if (winnertext !== 'spiel läuft') return
        let pos = new Pos(x, y)
        if (board.get(pos) === 0) {
            board.set(pos, player)
            if (iswinner(x, y)) {
                winnermark(x, y)
                return
            }
            player = (player % playerzahl) + 1
            zuege.push(pos)
        }
    }

    function takeback () :void {
        if (zuege.length === 0) return
        board.set(zuege[zuege.length - 1], 0)
        if (player === 1) {
            player = playerzahl
        } else {
            player = player - 1
        }
        zuege.pop()
    }

    function resetGame () :void {
        board.setAll(0)
        winnertext = 'spiel läuft'
        player = Math.floor(Math.random() * playerzahl) + 1
    }

    function moduschange () {
        if (spielmodus === '3x3') {
            sizex = 3
            sizey = 3
            winnerzahl = 3
        }
        if (spielmodus === '5x5') {
            sizex = 5
            sizey = 5
            winnerzahl = 5
        }
        if (spielmodus === '10x10') {
            sizex = 10
            sizey = 10
            winnerzahl = 10
        }
        matrix = createboard(sizex, sizey)
        board = new Board(matrix)
    }

</script>

<div class="flex justify-center gap-2 p-2">

    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={takeback} >
	    back
    </button>

    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={resetGame} >
	    reset
    </button>

    <select bind:value={spielmodus} onchange={moduschange} class="mb-2 me-2 rounded-lg">
      <option value="3x3">3x3</option>
      <option value="5x5">5x5</option>
      <option value="10x10">10x10</option>
    </select>

    <p class="px-5 py-2.5">Spieler: Player {player}</p>

</div>

<div class="align-items-center flex flex-col gap-10 pt-10 text-center">
	<div class="m-auto w-fit border-2 border-gray-200">
		{#each matrix as row, x}
			<div class="block w-fit whitespace-nowrap">
				{#each row as value, y}
					<button
						class={[
							'size-10 border align-middle enabled:hover:bg-slate-100',
							value === 1 && 'text-blue-500',
                            value === 2 && 'text-red-500',
							value === -1 && 'bg-blue-300',
                            value === -2 && 'bg-red-300',
							value === -1 && 'text-blue-500',
                            value === -2 && 'text-red-500',
						]}
						onclick={() => handleClick(x, y)} > 
						{#if value === 1}
							O
                        {:else if value === 2}
                            X
                        {:else if value === -1}
                            O
                        {:else if value === -2}
                            X
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>