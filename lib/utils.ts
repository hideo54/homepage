export const sortBy = <T>(arr: T[], func: (arg: T) => number) => (
    arr.sort((a, b) => func(a) - func(b))
);
