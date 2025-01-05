import { BiMenu, BiPowerOff } from "react-icons/bi";
import { Offcanvas } from "react-bootstrap";
import useFetchData from "../hooks/fetchData";
import { getCategories } from "../config/api";
import { NavLink } from "react-bootstrap";
import { useState } from "react";
import { useStore } from "../config/store";
import Loader from "../utils/Loader";

export default function Sidebar() {
  const [show, setShow] = useState(false);
  const { data, error, loading } = useFetchData(getCategories);
  const { currentUser, links, adminLinks, logOut } = useStore();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <BiMenu
        style={{ cursor: "pointer" }}
        size="24px"
        className="me-2 d-md-none"
        onClick={handleShow}
      />
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <NavLink className="fs-3 fw-bold" to="/">
              SHOP
            </NavLink>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <hr />
            <h1 className="mb-2 fs-4 pb-3">Collections</h1>
            {error && <p className="fs-5">Failed to fetch collections</p>}
            {loading ? (
              <Loader />
            ) : (
              <>
                {data.map((category) => (
                  <div key={category._id} className="mb-3">
                    <NavLink
                      to={`/collections/${category.name}`}
                      className={({ isActive }) =>
                        isActive
                          ? "text-success fw-bold fs-5"
                          : "text-black fw-medium"
                      }
                      onClick={handleClose}
                    >
                      {category.name}
                    </NavLink>
                  </div>
                ))}
              </>
            )}
          </div>
          {currentUser && (
            <>
              <hr />
              <h1 className="fs-3 fw-bold">Account</h1>
              {links.map((item, i) => (
                <div key={i} className="mb-3">
                  <NavLink
                    to={`account/${item.path}`}
                    className={({ isActive }) =>
                      isActive
                        ? "text-success fw-bold fs-5"
                        : "text-black fw-medium"
                    }
                    onClick={handleClose}
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}
              {currentUser?.user?.isAdmin === true && (
                <>
                  {adminLinks.map((item, i) => (
                    <div key={i} className="mb-3">
                      <NavLink
                        to={`account/${item.path}`}
                        className={({ isActive }) =>
                          isActive
                            ? "text-success fw-bold fs-5"
                            : "text-black fw-medium"
                        }
                        onClick={handleClose}
                      >
                        {item.name}
                      </NavLink>
                    </div>
                  ))}
                </>
              )}
              <hr />
              <div className="d-flex align-items-center" onClick={logOut}>
                <div>
                  <BiPowerOff className="me-2" size="24px" />
                  <span className="fw-medium fs-5"> Logout</span>
                </div>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
