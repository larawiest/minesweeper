export class LinkedListNode<T> {

    value: T
    next: LinkedListNode<T> | undefined

    constructor(value: T, next?: LinkedListNode<T>) {
        this.value = value
        this.next = next
    }
    
}