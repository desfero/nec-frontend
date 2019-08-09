import { List } from "lodash";

type pairZip = <T, K>(arrayOfT: List<T>, arrayofK: List<K>) => [T, K][];
type tripleZip = <T, K, L>(arrayOfT: List<T>, arrayofK: List<K>, arrayofL: List<L>) => [T, K, L][];
