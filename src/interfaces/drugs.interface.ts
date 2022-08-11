import { Timestamps } from './timestamps.interface';
import { Substance } from './substacne.interface';

export interface Drug extends Timestamps {
    _id?: string;
    name: string;
    country: string;
    composition: Array<Substance>;
    cost?: number;
}
