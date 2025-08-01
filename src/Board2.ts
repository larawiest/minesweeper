import { Pos } from './Pos.js'

export class Board2 {

    readonly board :number[][]
    readonly sizex :number
    readonly sizey :number
    public winner :number
    public winnervalue :number
    public winnerdir :Pos[] = []

    constructor (board :number[][]) {
        this.board = board
        this.sizex = board.length
        this.sizey = board[0].length
        this.winner = 0
        this.winnervalue = 3
    }

    inside (pos :Pos) :boolean {
        return pos.x >= 0 && pos.x < this.sizex && pos.y >= 0 && pos.y < this.sizey
    }

    get (pos :Pos) :number | undefined {
        if (! this.inside(pos)) return undefined
        return this.board[pos.x][pos.y]
    }

    set (pos :Pos, value :number) :boolean {
      if (! this.inside(pos)) return false
      this.board[pos.x][pos.y] = value
      return true
    }

    setAll (value :number) :void {
        for (let i = 0; i < this.sizex; i++) {
            for (let j = 0; j < this.sizey; j++) {
                this.board[i][j] = value
            }
        }
    }

    changeAll (oldvalue :number, newvalue :number) :void {
        for (let i = 0; i < this.sizex; i++) {
            for (let j = 0; j < this.sizey; j++) {
                if (this.board[i][j] === oldvalue) {
                    this.board[i][j] = newvalue
                }
            }
        }
    }

    setwinner (winner :number) :void {
        this.winner = winner
    }

    getwinner () :number {
        return this.winner
    }

    setwinnerval (winnerval :number) :void {
        this.winnervalue = winnerval
    }

    dir = [new Pos(1, 1), new Pos(0, 1), new Pos(-1, 1), new Pos(1, 0)]

    valuezaehler (pos :Pos, richtung :Pos, player :number) :boolean { 
        let newpos = pos
        let value = 0
        newpos = newpos.add(richtung)
        while (this.inside(newpos) && this.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung)
        }
        newpos = pos
        newpos = newpos.add(richtung.neg())
        while (this.inside(newpos) && this.get(newpos) === player) {
            value++
            newpos = newpos.add(richtung.neg())
        }
        if (value >= this.winnervalue - 1) {
            return true
        }
        return false
    }

    iswinner (x :number, y :number, player :number) :boolean {
        let pos = new Pos(x, y)
        let winner = false
        for (let i = 0; i < this.dir.length; i++) {
            if (this.valuezaehler(pos, this.dir[i], player)) {
                this.winnerdir.push(this.dir[i])
                //winnertext = 'gewonnen'
                this.setwinner(player)
                winner = true
            }
        }
        return winner
    }

}