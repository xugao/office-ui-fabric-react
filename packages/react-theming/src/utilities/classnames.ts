export const cx = (...classes: (string | false | undefined | null)[]) =>
  classes.filter((c: string | false | undefined | null) => c && c !== '').join(' ');
