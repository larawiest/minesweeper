import { Pos } from './Pos'
import { BigPos } from './BigPos'
import { Board2 } from './Board2'

export class BigBoard {

    readonly board :Board2[][]
    readonly sizex :number
    readonly sizey :number
    public winner :number
    readonly dir = [new Pos(1, 0), new Pos(0, 1), new Pos(1, 1), new Pos(-1, 1)]

    constructor (board :number[][][][]) {
        this.board = board
        this.sizex = board.length
        this.sizey = board[0].length
        this.winner = 0
    }

    inside (pos :BigPos) :boolean {
        return pos.x2 >= 0 && pos.x2 < this.sizex && pos.y2 >= 0 && pos.y2 < this.sizey && pos.x >= 0 && pos.x < this.sizex && pos.y >= 0 && pos.y < this.sizey
    }

    get (pos :BigPos) :number | undefined {
        if (! this.inside(pos)) return undefined
        return this.board[pos.x2][pos.y2][pos.x][pos.y]
    }

    set (pos :BigPos, value :number) :boolean {
      if (! this.inside(pos)) return false
      this.board[pos.x2][pos.y2][pos.x][pos.y] = value
      return true
    }

    setAll (value :number) :void {
        for (let i = 0; i < this.sizex; i++) {
            for (let j = 0; j < this.sizey; j++) {
                for (let k = 0; k < this.sizex; k++) {
                    for (let l = 0; l < this.sizey; l++) {
                        this.board[i][j][k][l] = value
                    }
                }
            }
        }
    }

    full () :boolean {
        for (let i = 0; i < this.sizex; i++) {
            for (let j = 0; j < this.sizey; j++) {
                for (let k = 0; k < this.sizex; k++) {
                    for (let l = 0; l < this.sizey; l++) {
                        if (this.board[i][j][k][l] === 0) {
                            return false
                        }
                    }
                }
            }
        }
        return true
    }

    smallfull (x2 :number, y2 :number) :boolean {
        for (let k = 0; k < this.sizex; k++) {
            for (let l = 0; l < this.sizey; l++) {
                 if (this.board[x2][y2][k][l] === 0) {
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

    tostring () :string {
        return this.board.toString()
    }
}