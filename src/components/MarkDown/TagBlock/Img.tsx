import "./Img.scss";
const Img = ({ src, alt }: { src?: string; alt?: string }) => {
  return (
    <div className="mdImageWrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mdImage" src={src} alt={alt} />
      {!alt?.toLowerCase().startsWith("untitled") && <span className="mdImageCaption">{alt}</span>}
    </div>
  );
};

export default Img;
