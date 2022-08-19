import { GroupBy, Status, ThemeMode } from '../constants/enums';
import { Message } from '../constants/types';
import { Country } from '../interfaces/countries.interface';
import { Drug } from '../interfaces/drugs.interface';

export interface ThemeState {
    mode: ThemeMode;
}

export interface AppState {
    selectedDrugsIds: Array<string>;
    favoriteDrugsIds: Array<string>;
    selectedCountryId: string | null;
    countriesCount: number;
    drugsCount: number;
    readonly: boolean;
    groupBy: GroupBy;
}

interface FetchState {
    status: Status;
    message: Message;
}

export interface CountriesState extends FetchState {
    countries: Array<Country>;
}

export interface DrugsState extends FetchState {
    drugs: Array<Drug>;
}
