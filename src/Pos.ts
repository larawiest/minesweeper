export class Pos {

    readonly x :number
    readonly y : number

    constructor (x :number, y :number) {
        this.x = x
        this.y = y
    }

    add (pos :Pos) :Pos {
        return new Pos (this.x + pos.x, this.y + pos.y)
    }

    neg () :Pos {
        return new Pos (-this.x, -this.y)
    }

}