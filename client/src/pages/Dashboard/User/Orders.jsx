import { Button, Image, Row, Col } from "react-bootstrap";
import Loader from "../../../utils/Loader";
import { useStore } from "../../../config/store";
import useFetchData from "../../../hooks/fetchData";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { getUserOrders } from "../../../config/api";
export default function Orders() {
  const { username } = useParams();
  const { currentUser } = useStore();
  const location = useLocation();
  const {
    data: orders,
    error,
    loading,
  } = useFetchData(getUserOrders, currentUser?.access_token);
  error && <p className="mt-5 fs-5">{error.message}</p>;
  return (
    <>
      {location.pathname === `/account/${username}/orders` ? (
        <div>
          <h1 className="fs-5 fw-bold mb-4">Your orders</h1>
          {loading ? (
            <Loader />
          ) : (
            <>
              {orders.length > 0 ? (
                <>
                  {orders.map((order) => (
                    <Row
                      key={order._id}
                      className="p-2 mb-4 align-items-center border bg-white"
                    >
                      <Col xs={12} md={5} lg={6} className="mb-3">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <Link
                            to={`/collections/${order.orderItems[0]?.category}/${order.orderItems[0]?.slug}`}
                          >
                            <Image
                              src={order.orderItems[0].images[0]}
                              style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "contain",
                              }}
                            />
                          </Link>
                          <div>
                            <Link
                              className="mb-1 fs-5 text-black"
                              to={`/collections/${order.orderItems[0]?.category}/${order.orderItems[0]?.slug}`}
                            >
                              {order.orderItems[0]?.title?.length > 30
                                ? order.orderItems[0]?.title.slice(
                                    0,
                                    30 + "..."
                                  )
                                : order.orderItems[0]?.title}
                            </Link>
                            <p>
                              <span className="fw-bold me-1">OrderId: </span>
                              {order._id}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4} className="mb-3">
                        <div>
                          <p className="fs-6 mb-1">
                            <span className="fw-bold me-1">
                              Payment status:
                            </span>
                            {order.isPaid ? "Paid" : "Not paid"}
                          </p>
                          <p className="fs-6 mb-1">
                            <span className="fw-bold me-1">
                              Delivery status:
                            </span>
                            {order.isDelivered ? "Delivered" : "Not delivered"}
                          </p>
                        </div>
                      </Col>
                      <Col xs={12} md={3} lg={2} className="mb-3 text-center">
                        <Link to={`/account/${username}/orders/${order._id}`}>
                          <Button
                            variant="danger"
                            className="rounded-0 fw-medium"
                          >
                            See Details
                          </Button>
                        </Link>
                      </Col>
                      <hr />
                    </Row>
                  ))}
                </>
              ) : (
                <h1 className="fs-5">Sorry You have no orders. Start by purchasing an item.</h1>
              )}
            </>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
