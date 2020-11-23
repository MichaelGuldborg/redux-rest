// const stableSort = (array, cmp) => {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = cmp(a[0], b[0]);
//         if (order !== 0) return order;
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// };
//
// const descendingCompare = (a, b, key: string): number => {
//     if (b[key] < a[key]) {
//         return -1;
//     }
//     if (b[key] > a[key]) {
//         return 1;
//     }
//     return 0;
// };
//
// const compareByKey = (key: string, ascending = true) => {
//     return ascending ? (a, b) => -descendingCompare(a, b, key) : (a, b) => descendingCompare(a, b, key);
// };
//
//
// export const stableSortByKey = (array: Record<string, any>[], orderBy: string, orderAscending = true) => {
//     return stableSort(array, compareByKey(orderBy, orderAscending));
// };
//
// export default stableSortByKey;
export {}