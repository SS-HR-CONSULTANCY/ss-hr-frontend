export const cleanEmptyFields = <T extends Record<string, string | number | boolean | "" | undefined | null | string[]>>(data: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([, v]) => v !== "" && v !== undefined && v !== null
        )
    ) as Partial<T>;
};
