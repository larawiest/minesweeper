<script lang="ts">

	import { Board } from './Board'
	import { LinkedList } from './LinkedList.js'
	import { LinkedListNode } from './LinkedListNode.js'
	import { Pos } from './Pos'

    let sizex = $state(10) 
    let sizey = $state(10) 
    let matrix :number[][] = $state([])
    let richtung = $state(1) // 0: Rechts, 1: Unten, 2: Links, 3: Oben
    let zuege = $state(new LinkedList<Pos>)
    let aktuellepos :Pos = $state(new Pos(0, 0))
    let winnertext = $state('spiel läuft')
    let spielmodus = $state('10x10')
    let speedstr = $state('1000')
    let speed = $state(1000)

    let richtungen = [
        new Pos(1, 0), //unten
        new Pos(0, 1),  //rechts
        new Pos(-1, 0), //oben
        new Pos(0, -1)  //links
    ]

    zuege.append(new Pos(0,0))

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

    matrix = createboard(sizex, sizey)
    let board = new Board (matrix)

    board.setAll(0)
    board.set(aktuellepos, 2)

    let emptyfields = board.getempty()
    let apfel = emptyfields[Math.floor(Math.random() * emptyfields.length)]
    board.set(apfel, 10)

    function handleKey(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
            richtung = 2
        } else if (event.key === 'ArrowDown') {
            richtung = 0
        } else if (event.key === 'ArrowLeft') {
            richtung = 3
        } else if (event.key === 'ArrowRight') {
            richtung = 1
        }
    }

    function move(direction: string) {
        if (direction === 'up') {
            richtung = 2
        } else if (direction === 'down') {
            richtung = 0
        } else if (direction === 'left') {
            richtung = 3
        } else if (direction === 'right') {
            richtung = 1
        }
    }

    window.addEventListener('keydown', handleKey)


    function movehead() :void{
        aktuellepos = aktuellepos.add(richtungen[richtung])
        if (board.get(aktuellepos) === 1) {
            richtung = 5
            stopGame()
            winnertext = 'verloren'
            return
        }
        if (board.inside(aktuellepos) === false) { //pack das woanders hin später
            stopGame()
            winnertext = 'verloren'
            return
        }
        board.setAll(0)
        board.set(apfel, 10)
        zuege.append(aktuellepos)
        for (let i = 0; i < zuege.length(); i++) {
            board.set(zuege.getvalue(i), 1)
        }
        board.set(aktuellepos, 2)
        if (aktuellepos.x === apfel.x && aktuellepos.y === apfel.y) {
            if (zuege.length() === (sizex * sizey) - 1) {
                winnertext = 'gewonnen'
                stopGame()
            }
            emptyfields = board.getempty()
            apfel = emptyfields[Math.floor(Math.random() * emptyfields.length)]
            board.set(apfel, 10)
            return
        }
        board.set(zuege.getvalue(0), 0)
        zuege.removeat(0)
    }

    let intervalId: number

    function startgame () :void {
        intervalId = setInterval(movehead, speed)
    }

    function stopGame() :void {
        clearInterval(intervalId);
    }

    function reset () :void {
        stopGame()
        richtung = 1
        board.setAll(0)
        aktuellepos = new Pos(0,0)
        board.set(aktuellepos, 2)
        emptyfields = board.getempty()
        apfel = emptyfields[Math.floor(Math.random() * emptyfields.length)]
        board.set(apfel, 10)
        zuege = new LinkedList<Pos>
        zuege.append(aktuellepos)
        winnertext = 'spiel läuft'
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
        matrix = createboard(sizex, sizey)
        board = new Board(matrix)
        reset()
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
        reset()
    }
    

</script>

<div class="flex justify-center gap-2 p-2">

    <button
	    class="mb-2 me-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"
	    onclick={reset} >
	    reset
    </button>

    <button
	    class="mb-2 me-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
	    onclick={startgame} >
	    start game
    </button>

    <select bind:value={spielmodus} onchange={moduschange} class="mb-2 me-2 rounded-lg">
      <option value='10x10'>10x10</option>
      <option value="15x10">15x10</option>
      <option value="20x20">20x20</option>
    </select>

    <select bind:value={speedstr} onchange={speedchange} class="mb-2 me-2 rounded-lg">
      <option value='1000'>1000</option>
      <option value='750'>750</option>
      <option value='500'>500</option>
      <option value='250'>250</option>
    </select>

    <p class="px-5 py-2.5">{winnertext}</p>

</div>

<div class="flex justify-center gap-4 p-4">

  <!-- Spielfeld -->
  <div style="display: inline-block; border: 2px solid #333;">
    <div style="display: flex; flex-direction: column; gap: 0;">
      {#each matrix as row, x}
        <div style="display: flex; gap: 0;">
          {#each row as value, y}
            <button
                style="
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    margin: 0;
                    border: none;
                    display: inline-block;
                    "
                class = {["enabled:hover:bg-green-200",
                    (x + y) % 2 === 0 && 'bg-green-300',
                    (x + y) % 2 === 1 && 'bg-green-400',
                    value === 1 && 'bg-blue-400',
                    value === 2 && 'bg-blue-600',
                    value === 10 && 'bg-red-400'
                    ]}>
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Pfeilsteuerung -->
  <div class="flex flex-col items-center justify-center gap-2">
    <button
      class="rounded-lg bg-yellow-500 px-4 py-2 hover:bg-yellow-600"
      onclick={() => move('up')}>
        ↑
    </button>

    <div class="flex gap-2">
      <button
        class="rounded-lg bg-yellow-500 px-4 py-2 hover:bg-yellow-600"
        onclick={() => move('left')}>
        ←
      </button>

      <button
        class="rounded-lg bg-yellow-500 px-4 py-2 hover:bg-yellow-600"
        onclick={() => move('right')}>
        →
      </button>
    </div>

    <button
      class="rounded-lg bg-yellow-500 px-4 py-2 hover:bg-yellow-600"
      onclick={() => move('down')}>
      ↓
    </button>
  </div>
</div>
