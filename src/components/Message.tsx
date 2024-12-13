import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

function Message({ children = "" }: Props) {
  return <h1>{children}</h1>;
}

export default Message;
