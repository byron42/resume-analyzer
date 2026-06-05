import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="flex-shrink min-w-0">
        <p
          className="
            font-bold text-gradient
            text-2xl
            max-sm:text-[calc(1.2rem+0.4vw)]
            leading-tight
          "
        >
          RESUMELIZER
        </p>
      </Link>

      <Link
        to="/upload"
        className="
          primary-button w-fit
          text-base
          max-sm:text-[calc(0.8rem+0.3vw)]
          max-sm:px-[calc(0.6rem+0.2vw)]
          max-sm:py-[calc(0.3rem+0.1vw)]
          leading-tight
        "
      >
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
