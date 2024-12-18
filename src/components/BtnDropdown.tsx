interface Props {
  text: string;
  dropdown: [string, () => any][];
  btnGroupClassName: string;
  btnClassName: string;
  id: string;
}

function BtnDropdown({
  text,
  dropdown,
  btnGroupClassName,
  btnClassName,
  id,
}: Props) {
  return (
    <div className={`btn-group ${btnGroupClassName}`}>
      <button type="button" className={btnClassName}>
        {text}
      </button>
      <button
        className={`${btnClassName} dropdown-toggle dropdown-toggle-split`}
        type="button"
        id={id}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      />
      <ul className="dropdown-menu" aria-labelledby={id}>
        {dropdown.map(([event, handler], index) => (
          <li key={`${id}-${index}`}>
            <a className="dropdown-item" href="#" onClick={handler}>
              {event}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BtnDropdown;
