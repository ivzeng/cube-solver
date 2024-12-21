interface Props {
  textMain: string;
  textContent: string;
  btnClassName: string;
  collapseClassName: string;
  id: string;
  onClick: () => void;
}

function Collapse({
  textMain,
  textContent,
  btnClassName,
  collapseClassName,
  id,
  onClick,
}: Props) {
  return (
    <>
      <p className="mx-2" style={{ width: "20%" }}>
        <button
          className={`btn ${btnClassName} btn-block`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded="false"
          aria-controls={id}
          style={{ width: "100%" }}
          onClick={onClick}
        >
          {textMain}
        </button>
      </p>
      <div style={{ height: "50px", width: "75%" }} className="mx-2">
        <div className={`collapse ${collapseClassName}`} id={id}>
          <div
            className="card card-body overflow-y-scroll"
            style={{ height: "50px" }}
          >
            {textContent}
          </div>
        </div>
      </div>
    </>
  );
}

export default Collapse;
