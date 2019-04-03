import { Moment } from 'moment';

export interface IAuthor {
    id?: number;
    name?: string;
    birthDate?: Moment;
}

export class Author implements IAuthor {
    constructor(public id?: number, public name?: string, public birthDate?: Moment) {}
}
