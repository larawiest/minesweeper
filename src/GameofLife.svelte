<script lang="ts">

    //null: tot
    //ein lebender nachbar: tot
    //zwei oder drei: bleibt lebendig
    //drei: wird lebendig
    //vier: tot

	import { Zellen } from './Zellen.js'
	import { Pos } from './Pos.js'

    let sizex = $state(10)
    let sizey = $state(10)

    let speedstr = $state('1000')
    let speed = $state(1000)
    let spielmodus = $state('10x10')

    let text = $state('spiel pausiert')

    let richtungen = [
	    new Pos(-1, -1), // oben links
	    new Pos(-1,  0), // oben
	    new Pos(-1,  1), // oben rechts
	    new Pos( 0, -1), // links
	    new Pos( 0,  1), // rechts
	    new Pos( 1, -1), // unten links
	    new Pos( 1,  0), // unten
	    new Pos( 1,  1)  // unten rechts
    ]

    function createboard (sizex :number, sizey :number) :number[][] {
        let newmatrix = []
        for (let i = 0; i < sizex; i++) {
            newmatrix.push([])
            for (let j = 0; j < sizey; j++) {
                newmatrix[i].push(0)
            }
        }
        return newmatrix
    }

    let matrix = $state(createboard(sizex, sizey))
    let board = new Zellen(matrix)

    let nextmatrix = $state(createboard(sizex, sizey))
    let next = new Zellen(nextmatrix)

    function changeboard () :void {
        let status = 0
        let value = 0
        let pos :Pos
        for (let i = 0; i < sizex; i++) {
            for (let j = 0; j < sizey; j++) {
                value = 0
                pos = new Pos(i, j)
                for (let k = 0; k < richtungen.length; k++) {
                    if (board.get(pos.add(richtungen[k])) === 1) {
                        value++
                    }
                }
                if (board.get(pos) === 0) {
                    if (value === 3) {
                        next.set(pos, 1)
                    } else {
                        next.set(pos, 0)
                    }
                } else if (board.get(pos) === 1) {
                    if (value === 2 || value === 3) {
                        next.set(pos, 1)
                    } else {
                        next.set(pos, 0)
                    }
                }
            }
        }
        for (let l = 0; l < sizex; l++) {
            for (let m = 0; m < sizey; m++) {
                board.set(new Pos(l, m), next.get(new Pos(l, m)))
            }
        }
        next.setAll(0)
    }

    board.setAll(0)

    function handleClick (x :number, y :number) :void {
        let pos = new Pos(x, y)
        if (board.get(pos) === 0) {
            board.set(pos, 1)
        }
        else if (board.get(pos) === 1) {
            board.set(pos, 0)
        }
    }

    let intervalId: number

    function startgame() :void {
        text = 'spiel läuft'
        intervalId = setInterval(changeboard, speed)
    }

    function stopGame() :void {
        text = 'spiel pausiert'
        clearInterval(intervalId);
    }

    function resetGame () :void {
        stopGame()
        board.setAll(0)
    } 

    function moduschange () {
        if (spielmodus === '10x10') {
            sizex = 10
            sizey = 10
        }
        if (spielmodus === '15x10') {
            sizex = 10
            sizey = 15
        }
        if (spielmodus === '20x20') {
            sizex = 20
            sizey = 20
        }
        if (spielmodus === '30x30') {
            sizex = 30
            sizey = 30
        }
        matrix = createboard(sizex, sizey)
        board = new Zellen(matrix)
        nextmatrix = createboard(sizex, sizey)
        next = new Zellen(nextmatrix)
        resetGame()
    }

    function speedchange () {
        if (speedstr === '1000') {
            speed = 1000
        }
        if (speedstr === '750') {
            speed = 750
        }
        if (speedstr === '500') {
            speed = 500
        }
        if (speedstr === '250') {
            speed = 250
        }
        resetGame()
    }

</script>

{text}

<div class="flex justify-center gap-2 p-2">
    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={resetGame} >
	    reset
    </button>

	<button
		class="mb-2 me-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600"
		onclick={startgame} >
		start
	</button>

	<button
		class="mb-2 me-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
		onclick={stopGame} >
		stop
	</button>

    <select bind:value={spielmodus} onchange={moduschange} class="mb-2 me-2 rounded-lg">
      <option value='10x10'>10x10</option>
      <option value='15x10'>15x10</option>
      <option value="20x20">20x20</option>
    <option value="30x30">30x30</option>
    </select>

    <select bind:value={speedstr} onchange={speedchange} class="mb-2 me-2 rounded-lg">
      <option value='1000'>1000</option>
      <option value='750'>750</option>
      <option value='500'>500</option>
      <option value='250'>250</option>
    </select>

</div>

<div class="align-items-center flex flex-col gap-5 pt-5 text-center">
	<div class="m-auto w-fit border-2 border-gray-200">
		{#each matrix as row, x}
			<div class="block w-fit whitespace-nowrap">
				{#each row as value, y}
					<button
                        style="
                            width: 32px;
                            height: 32px"
						class={[
							'size-10 align-middle enabled:hover:bg-slate-500',
							value === 0 && 'bg-black',
                            value === 1 && 'bg-white'
						]}
						onclick={() => handleClick(x, y)} >
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>