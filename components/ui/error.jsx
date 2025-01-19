export function Error({ error, touched }) {
    if (!touched || !error) return null;
    return <p className='absolute -bottom-4 text-xs text-red-600'>{error}</p>;
}
