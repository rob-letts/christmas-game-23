export default function Photo (props) {
  function capitalise (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getImageUrl (name) {
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  return <img
    class={props.class}
    height={props.size}
    width={props.size}
    src={getImageUrl(props.name)}
    alt={`profile photo of ${capitalise(props.name)}`}
  />;
}