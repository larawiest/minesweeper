<script lang="ts">

    // -10: leeres unaufgedecktes Feld
    // -9: unaufgedeckte Bombe
    // -8 bis -1: unaufgedecktes Zahlenfeld
    // 1 bis 8: aufgedecktes Zahlenfeld
    // 9: aufgedeckte Bombe
    // 10: aufgedecktes leeres Feld
    // 90 bis 110: markieretes Feld

	import { Board } from './Board.ts'
	import { Pos } from './Pos.ts'

    let spielertext = $state('spiel läuft')
    let sizex = $state(10)
    let sizey = $state(10)
    let matrix :number[][] = $state([])
    let spielmodus = $state('10x10x10')

    let modus = $state(1)

    let bombenpositionen :Pos[] = $state([])
    let bombenzahl = $state(10)
    let bombcolor = $state('bg-gray-200')
    let color = $state('bg-black-200')
    let bombenval = $state(1)
    let uebrige = $state(bombenzahl)

    let dir = [new Pos(1,0), new Pos(1,1), new Pos(0,1), new Pos(-1, 0), new Pos(0,-1), new Pos(1,-1), new Pos(-1, -1), new Pos(-1, 1)]

    function createboard (sizex :number, sizey :number) :number[][] {
        let newmatrix = []
        for (let i = 0; i < sizex; i++) {
            newmatrix.push([])
            for (let j = 0; j < sizey; j++) {
                newmatrix[i].push(-10)
            }
        }
        return newmatrix
    }

    matrix = createboard(sizex, sizey)
    let board = new Board (matrix)

    board.setAll(-10)

    function inarr (arr :Pos[], x :number, y :number) :boolean {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].x === x && arr[i].y === y) return true
        }
        return false
    }

    function bombenpos () :void {
        let pos :Pos
        for (let i = 0; i < bombenzahl; i++) {
            pos = new Pos (Math.floor(Math.random() * sizex), Math.floor(Math.random() * sizey))
            while (inarr(bombenpositionen, pos.x, pos.y)) {
                pos = new Pos (Math.floor(Math.random() * sizex), Math.floor(Math.random() * sizey))
            }
            bombenpositionen.push(pos)
        }
    }

    bombenpos()

    function bombenmarkieren () :void {
        for (let i = 0; i < bombenpositionen.length; i++) {
            board.set(bombenpositionen[i], -9)
        }
    }

    bombenmarkieren()

    function markboard () :void {
        let value = 0
        let aktuellepos :Pos
        for (let i = 0; i < sizex; i++) {
            for (let j = 0; j < sizey; j++) {
                let value = 0
                let aktuellepos = new Pos(i,j)
                for (let k = 0; k < dir.length; k++) {
                    if (inarr(bombenpositionen, aktuellepos.add(dir[k]).x, aktuellepos.add(dir[k]).y )) value++
                }
                if (value !== 0 && board.get(aktuellepos) !== -9) board.set(aktuellepos, -value)
            }
        }
    }

    function calculatevalue (pos :Pos) :number {
        let value = 0
        let aktuellepos = pos
        for (let k = 0; k < dir.length; k++) {
            if (inarr(bombenpositionen, aktuellepos.add(dir[k]).x, aktuellepos.add(dir[k]).y )) value++
        }
        if (value === 0) value = 10
        return value
    }

    markboard()


    function tiefensuche (x :number, y :number) :void {
        let pos = new Pos(x, y)
        let newpos :Pos
        let tiefensuchearr = []
        tiefensuchearr.push(pos)
        while (tiefensuchearr.length !== 0) {
            pos = tiefensuchearr[tiefensuchearr.length - 1]
            tiefensuchearr.pop()
            board.set(pos, 10)
            

            for (let i = 0; i < dir.length; i++) {
                newpos = pos.add(dir[i])
                if (board.inside(newpos) && ( board.get(newpos) === -10)) {
                    tiefensuchearr.push(newpos)
                }
            } 

            for (let i = 0; i < dir.length; i++) {
                newpos = pos.add(dir[i])   
                if (board.inside(newpos) && board.get(newpos) < 0) {
                    board.set(newpos, -board.get(newpos))
                }
            } 
        }
    }

    function handleClick (x :number, y :number) :void {
        if (iswinner()) {
            spielertext = 'gewonnen'
            color = 'bg-green-600'
        }
        if (spielertext === 'verloren' || spielertext === 'gewonnen') return
        let pos = new Pos(x, y)
        if (! board.inside(pos)) return
        //Freilegen
        if (modus === 1) {
            if (board.get(pos) <= -1 && board.get(pos) >= -8) {
                board.set(pos,-board.get(pos))
            }
            if (board.get(pos) === -9) {
                spielertext = 'verloren'
                bombcolor = 'bg-red-300'
                color = 'bg-red-600'
            }
            if (board.get(pos) === -10) {
                tiefensuche(x, y)
            }
        //Markieren
        } else {
            if (board.get(pos) >= 90) {
                board.set(pos, board.get(pos) - 100)
                uebrige++
            } else if (board.get(pos) < 0) {
                if (uebrige === 0) return
                board.set(pos, board.get(pos) + 100)
                uebrige--
            }

        }
        if (iswinner()) {
            spielertext = 'gewonnen'
            color = 'bg-green-600'
        }
    }

    function handleRechtsklick (event :MouseEvent, x :number, y :number) :void {
        event.preventDefault()
        if (spielertext === 'verloren' || spielertext === 'gewonnen') return
        let pos = new Pos(x, y)
        if (board.get(pos) >= 90) {
                board.set(pos, board.get(pos) - 100)
                uebrige++
        } else if (board.get(pos) < 0) {
                if (uebrige === 0) return
                board.set(pos, board.get(pos) + 100)
                uebrige--
        }
        if (iswinner()) {
            spielertext = 'gewonnen'
            color = 'bg-green-600'
        }
    }

    function iswinner () :boolean {
        let value :number | undefined = 0
        for (let i = 0; i < sizex; i++) {
            for (let j = 0; j < sizey; j++) {
                value = board.get(new Pos (i,j))
                if (value !== undefined && value >= 90) {
                    value = value - 100
                }
                if (value === undefined) return false
                if (value < 0 && value !== -9) {
                    return false
                }
            }
        }
        return true
    }

    function resetGame () :void {
        board.setAll(-10)
        bombenpositionen = []
        bombenpos()
        bombenmarkieren()
        markboard()
        spielertext = 'spiel läuft'
        bombcolor = 'bg-gray-200'
        bombenval = 1
        modus = 1
        uebrige = bombenzahl
        color = 'bg-black-200'
    }

    function changemode () :void {
        modus = (modus % 2) + 1
    }

	function bombenmodus() {
        bombenval = (bombenval % 2) + 1
		if (bombenval === 1) {
			bombcolor = 'bg-gray-200'
		}
		if (bombenval === 2) {
			bombcolor = 'bg-blue-200'
		}
	}

    function moduschange () {
        if (spielmodus === '10x10x10') {
            sizex = 10
            sizey = 10
            bombenzahl = 10
        }
        if (spielmodus === '15x10x20') {
            sizex = 10
            sizey = 15
            bombenzahl = 20
        }
        if (spielmodus === '20x20x40') {
            sizex = 20
            sizey = 20
            bombenzahl = 40
        }
        matrix = createboard(sizex, sizey)
        board = new Board(matrix)
        resetGame()
    }



    //$effect(() => {



	//})

</script>

<div class="flex justify-center gap-2 p-2">
    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={resetGame} >
	    reset
    </button>

	<button
		class="mb-2 me-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600"
		onclick={bombenmodus} >
		Bomben anzeigen
	</button>

    <button
	    class="mb-2 me-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
	    onclick={changemode} >
	    {#if modus === 1 }
        Freilegen
        {:else if modus === 2}
        Bomben markieren
        {/if}
    </button>

    <select bind:value={spielmodus} onchange={moduschange} class="mb-2 me-2 rounded-lg">
      <option value="10x10x10">10x10x10</option>
      <option value="15x10x20">15x10x20</option>
      <option value="20x20x40">20x20x40</option>
    </select>

    <p class = "px-5 py-2.5"> {bombenzahl - uebrige} / {bombenzahl} </p>


    <p class = "px-5 py-2.5 {color}"> {spielertext} </p>


</div>

<div class="align-items-center flex flex-col gap-5 pt-5 text-center">
	<div class="m-auto w-fit border-2 border-gray-200">
		{#each matrix as row, x}
			<div class="block w-fit whitespace-nowrap">
				{#each row as value, y}
					<button
						class={[
							'size-10 border align-middle enabled:hover:bg-slate-100',
							value === 1 && 'text-blue-500',
							value === 2 && 'text-red-500',
							value === 3 && 'text-green-500',
							value === 4 && 'text-orange-300',
							value === 5 && 'text-blue-300',
							value === 6 && 'text-yellow-500',
							value === 7 && 'text-rose-500',
							value === 8 && 'text-lightgreen-500',
							value === -1 && 'bg-gray-200',
							value === -2 && 'bg-gray-200',
							value === -3 && 'bg-gray-200',
							value === -4 && 'bg-gray-200',
							value === -5 && 'bg-gray-200',
							value === -6 && 'bg-gray-200',
							value === -7 && 'bg-gray-200',
							value === -8 && 'bg-gray-200',
                            value === -9 && bombcolor,
							value === -10 && 'bg-gray-200',
							value >= 90 && 'bg-rose-300',
						]}
						onclick={() => handleClick(x, y)} 
                        oncontextmenu = {(event) => handleRechtsklick(event, x, y)} >
						{#if value === 1 }
							1
						{:else if value === 2}
							2
						{:else if value === 3}
							3
						{:else if value === 4}
							4
						{:else if value === 5}
							5
						{:else if value === 6}
							6
						{:else if value === 7}
							7
						{:else if value === 8}
							8
						{:else if value === 9}
							9
                        {:else if value >= 90}
							!
						<!--{:else if value !== 0}-->
							
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>
