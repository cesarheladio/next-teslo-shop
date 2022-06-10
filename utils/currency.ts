export const format = (value: number) => {
    //crear formateador
    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    });
    return formatter.format(value);
}