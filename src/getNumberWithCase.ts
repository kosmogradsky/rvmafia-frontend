export function getNumberWithCase(
  num: number,
  forOne: string,
  forTwoPlus: string,
  forFivePlus: string
) {
  if (num > 10 && num < 21) {
    return num + " " + forFivePlus;
  }

  const mod = num % 10;

  if (mod === 1) {
    return num + " " + forOne;
  }

  if (mod >= 5 || mod === 0) {
    return num + " " + forFivePlus;
  }

  return num + " " + forTwoPlus;
}
