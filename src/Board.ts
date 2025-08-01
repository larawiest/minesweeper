import { Pos } from './Pos'

export class Board {

    readonly board :number[][]
    readonly sizex :number
    readonly sizey :number
    public winner :number

    constructor (board :number[][]) {
        this.board = board
        this.sizex = board.length
        this.sizey = board[0].length
        this.winner = 0
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

    full () :boolean {
        for (let i = 0; i < this.sizex; i++) {
            for (let j = 0; j < this.sizey; j++) {
                if (this.board[i][j] === 0) {
                    return false
                }
            }
        }
        return true
    }

    setwinner (winner :number) :void {
        this.winner = winner
    }

    getwinner () :number {
        return this.winner
    }

}