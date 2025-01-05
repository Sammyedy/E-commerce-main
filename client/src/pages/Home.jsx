import { Link } from "react-router-dom";
import useFetchData from "../hooks/fetchData";
import { useEffect } from "react";
import { getIsFeaturedProducts, getProductByCondition } from "../config/api";
import Loader from "../utils/Loader";
import { Featuredproduct, Conditionalproduct } from "../component";
import PreorderProduct from "../component/PreorderProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const {
    data: featured, //placeholder
    error,
    loading,
  } = useFetchData(getIsFeaturedProducts);

  const {
    data: condition, //placeholder
  } = useFetchData(getProductByCondition);

  useEffect(() => {
    document.title = "Home";
  }, []);
  return (
    <section className="py-5">
      <div className="bannerBody">
        <div className="banner banner-font">
          <div className="background-overlay"></div>
          <div className="layout-container centered-div d-flex flex-column justify-content-center align-items-center h-100">
            <p className="text-uppercase fw-medium">New season</p>
            <h1 className="fs-1 fw-bold text-center">The Summer Edit</h1>
            <p className="text-center fs-5 fw-bold mb-4">
              Joyful products here to get you <br />
              spending. Hurry!
              
            </p>
            <Link to="/collections" className="banner-font fw-medium pb-5">
                CONTINUE BROWSING
              </Link>

            <FontAwesomeIcon icon={faArrowUp} bounce size="6x" />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="layout-container mt-3 py-5 px-3">
            <Featuredproduct data={featured} />
          </div>
          <div className="layout-container mt-3 py-5 px-3">
            <Conditionalproduct data={condition} />
          </div>
          <div className="bannerB my-4 d-flex justify-content-center align-items-center">
            <div className="layout-container w-100 text-white text-center px-4">
              <h1 className="fs-1 fw-bold">SHOP N BUY</h1>
              <p className="fs-3">Your one stop shop for all things</p>
            </div>
          </div>
          <div className="layout-container mt-3 py-5 px-3">
            <PreorderProduct data={condition} />
          </div>
        </>
      )}
    </section>
  );
}
