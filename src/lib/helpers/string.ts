export const s = (num: number, singular: string, plural?: string) => {
  if (num === 1) {
    return singular;
  }
  return plural || `${singular}s`;
};
