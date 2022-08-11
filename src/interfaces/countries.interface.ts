import { Timestamps } from './timestamps.interface';

export interface Country extends Timestamps {
    _id?: string;
    name: string;
}
