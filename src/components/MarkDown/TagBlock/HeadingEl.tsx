import Link from "next/link";
import "./HeadingEl.scss";

type HeadingElNumber = "h1" | "h2" | "h3";
const HeadingEl = ({ children, tag }: { children: React.ReactNode & React.ReactNode[]; tag: HeadingElNumber }) => {
  if (children.length > 1) {
    if (tag === "h1") return <h1>{children}</h1>;
    if (tag === "h2") return <h2>{children}</h2>;
    if (tag === "h3") return <h3>{children}</h3>;
  }

  const hrefId = children[0]?.toString().replaceAll(" ", "_");

  if (tag === "h1") {
    return (
      <h1 id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h1>
    );
  }
  if (tag === "h2") {
    return (
      <h2 id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h2>
    );
  }
  if (tag === "h3") {
    return (
      <h3 id={hrefId}>
        <Link className="hashAnchor" href={`#${hrefId}`}>
          {children}
        </Link>
      </h3>
    );
  }
  return <h1>{children}</h1>;
};

export default HeadingEl;
