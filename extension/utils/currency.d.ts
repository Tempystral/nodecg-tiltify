import type { Donation } from '../../types/schemas';
type ConversionRates = {
    [code: string]: number;
};
export declare var conversionRates: ConversionRates;
export declare function convertValue(dono: Donation): void;
export {};
//# sourceMappingURL=currency.d.ts.map