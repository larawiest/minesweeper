import { LinkedListNode } from './LinkedListNode';

export class LinkedList<T> {

    public head: LinkedListNode<T> | undefined

    constructor() {
        this.head = undefined
    }

    getvalue (index :number) :T {
        if (this.head === undefined) {
            throw new Error
        }
        return this.getvaluerecursive(this.head, index)
    }

    getvaluerecursive (node : LinkedListNode<T>, index :number) :T {
        if (index === 0) {
            return node.value
        }
        if (node.next === undefined) {
            throw new Error
        }
        return this.getvaluerecursive(node.next, index - 1)
    }

    length () :number { 
        if (this.head === undefined) {
            return 0
        }
        return this.lengthrecursive(this.head, 0)
    }

    lengthrecursive (node :LinkedListNode<T>, length :number) :number {
        if (node.next === undefined) {
            return length + 1
        }
        return this.lengthrecursive(node.next, length + 1)
    }

    append (value :T) :boolean {
        if (this.head === undefined) {
            this.head = new LinkedListNode (value, undefined)
            return true
        }
        return this.appendrecursive(this.head, value)
    }

    appendrecursive (node :LinkedListNode<T>, value :T) :boolean {
        if (node.next === undefined) {
            node.next = new LinkedListNode(value, undefined)
            return true
        }
        return this.appendrecursive(node.next, value)
    }

    insertat (index :number, value :T) :boolean {
        if (index === 0) {
            this.head = new LinkedListNode(value, this.head)
            return true
        }
        if (this.head === undefined) {
            return false
        }
        return this.insertatrecursive(this.head, index, value)
    }

    insertatrecursive (node :LinkedListNode<T>, index :number, value :T) :boolean {
        if (index === 1) {
            node.next = new LinkedListNode(value, node.next)
            return true
        }
        if (node.next === undefined) {
            return false
        }
        return this.insertatrecursive(node.next, index - 1, value)
    }

    removeat (index :number) :boolean {
        if (this.head === undefined) {
            return false
        }
        if (index === 0) {
            this.head = this.head.next
            return true
        }
        if (index >= this.length()) {
            return false
        }
        return this.removeatrecursive(this.head, index)
    }

    removeatrecursive (node :LinkedListNode<T>, index :number) :boolean {   
        if (node.next === undefined) {
            return false
        }
        if (index === 1) {
            node.next = node.next.next
            return true
        }
        return this.removeatrecursive(node.next, index - 1)
    }

}