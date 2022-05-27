export default function getIconToDisplay<TU, TD, R, Q>(
  sentiment: number | null,
  trendup: TU,
  trenddown: TD,
  right: R,
  question: Q
) {
  if (sentiment === null) {
    return question;
  } else if (sentiment < -0.1) {
    return trenddown;
  } else if (sentiment > -0.1 && sentiment < 0.1) {
    return right;
  } else {
    return trendup;
  }
}
