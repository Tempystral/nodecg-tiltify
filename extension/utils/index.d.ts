import type NodeCG from '@nodecg/types';
import type { Configschema } from '../../types/schemas';
export declare function storeNodeCG(ncg: NodeCG.ServerAPI<Configschema>): void;
export declare function getNodeCG(): NodeCG.ServerAPI<Configschema>;
export declare function isEmpty(string: string | undefined | null): string is "" | null | undefined;
//# sourceMappingURL=index.d.ts.map