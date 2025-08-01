export class BigPos {

    readonly x2 :number
    readonly y2 :number
    readonly x :number
    readonly y :number

    constructor (x2 :number, y2 :number, x :number, y :number) {
        this.x2 = x2
        this.y2 = y2
        this.x = x
        this.y = y
    }

    add (pos :BigPos) :BigPos {
        return new BigPos (this.x2 + pos.x2, this.y2 + pos.y2, this.x + pos.x, this.y + pos.y)
    }

    neg () :BigPos {
        return new BigPos (-this.x2, -this.y2, -this.x, -this.y)
    }

}