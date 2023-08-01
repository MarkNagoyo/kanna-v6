import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <Link
      className="border-box max-width-2 stretch flex justify-center align-center py1 border header rounded cursor-pointer hoverable text-decoration-none unselectable"
      to="/"
    >
      <span className="h2">Kanna</span>
    </Link>
  );
};
