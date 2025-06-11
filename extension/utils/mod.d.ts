export type ModStatus = boolean | null;
export declare const APPROVED = true, UNDECIDED: null, CENSORED = false;
export declare function tripleState<T>(v: ModStatus, appVal: T, undecVal: T, cenVal: T): T;
//# sourceMappingURL=mod.d.ts.map