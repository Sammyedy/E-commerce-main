import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useStore } from "../../../config/store";
import { toast } from "react-hot-toast";
import Loader from "../../../utils/Loader";
import { createNewProduct, uploadToCloudinary } from "../../../config/api";
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extra, setExtra] = useState("");
  const [seeExtra, setSeeExtra] = useState([]);
  const { currentUser } = useStore();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    document.title = "Add new product to database";
  }, []);

  const addExtra = () => {
    if (extra !== "") {
      setSeeExtra(seeExtra, seeExtra.push(extra));
      setExtra("");
    }
  };
  const onSubmitHandler = async (data) => {
    setLoading(true);
    let productImgs = [];
    try {
      for (let i = 0; i < data.productpics.length; i++) {
        const upload = await uploadToCloudinary(data.productpics[i]);
        const uploadedImgs = upload.data.secure_url;
        // newProductImgs = [...productImgs, uploadedImgs]
        productImgs.push(uploadedImgs);
      }
      const newProduct = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        color: data.color,
        brand: data.brand,
        condition: data.condition,
        isFeatured: data.isFeatured,
        extra: seeExtra,
        images: productImgs,
      };
      const res = await createNewProduct(newProduct, currentUser.access_token);
      if (res.status === 201) {
        toast.success("Product created successfully");
        reset(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("There was problem creating the product");
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="py-3">
      <h1 className="fs-5 fw-bold mb-4 text-center">
        Add new product to database
      </h1>
      {loading ? (
        <Loader title='Uploading Product....'/>
      ) : (
        <>
          <form className="w-100" onSubmit={handleSubmit(onSubmitHandler)}>
            <Row>
              <Col md={6} className="mb-4">
                <div className="mb-4 inputRegBox">
                  <input
                    type="text"
                    placeholder="Title"
                    id="title"
                    name="title"
                    className="w-100 mb-0 inputReg"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-danger fs-6">{errors.title.message}</p>
                  )}
                </div>
                <div className="mb-4 inputRegBox">
                  <textarea
                    name="description"
                    id="description"
                    className="w-100 mb-0 inputReg"
                    placeholder="description"
                    {...register("description", {
                      required: "Please fill in the product description",
                    })}
                  />
                  {errors.description && (
                    <p className="text-danger fs-6">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 inputRegBox">
                  <label htmlFor="productpics">Upload product images</label>
                  <input
                    type="file"
                    name="productpics"
                    id="productpics"
                    multiple={true}
                    className="mb-0 w-100 p-2 border"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    {...register("productpics", {
                      required: "Product image is required",
                    })}
                  />
                  {errors.productpics && (
                    <p className="text-danger fs-6">
                      {errors.productpics.message}
                    </p>
                  )}
                </div>
                <div className="mb-4 inputRegBox">
                  <input
                    type="number"
                    placeholder="Price"
                    name="price"
                    id="price"
                    multiple={true}
                    className="mb-0 w-100 inputReg"
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    {...register("price", {
                      required: "Price is required",
                    })}
                  />
                  {errors.price && (
                    <p className="text-danger fs-6">{errors.price.message}</p>
                  )}
                </div>
                <div className="mb-4 inputRegBox">
                  <label htmlFor="category">Select Category</label>
                  <select
                    name="category"
                    id="v"
                    className="px-3 py-1 mx-2"
                    {...register("category", {
                      required: "Select a category",
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Watch">Watch</option>
                  </select>

                  {errors.productpics && (
                    <p className="text-danger fs-6">
                      {errors.productpics.message}
                    </p>
                  )}
                </div>
              </Col>
              <Col md={6} className="mb-4">
                <div className="mb-4 inputRegBox">
                  <input
                    type="text"
                    placeholder="Brand"
                    id="brand"
                    name="brand"
                    className="w-100 mb-0 inputReg"
                    {...register("brand", { required: "Brand is required" })}
                  />
                  {errors.brand && (
                    <p className="text-danger fs-6">{errors.brand.message}</p>
                  )}
                </div>
                <div className="mb-4 inputRegBox">
                  <input
                    name="color"
                    id="color"
                    className="w-100 mb-0 inputReg"
                    placeholder="Color"
                    type="text"
                    {...register("color")}
                  />
                </div>
                <div className="mb-4 inputRegBox">
                  <label htmlFor="Condition">Condition</label>
                  <select
                    name="condition"
                    id="condition"
                    className="px-3 py-1 mx-2"
                    {...register("condition")}
                  >
                    <option value="">Select...</option>
                    <option value="New">New</option>
                    <option value="Preorder">Preorder</option>
                  </select>
                </div>
                <div className="mb-4 inputRegBox">
                  <h1 className="fs-5">Is product featured?</h1>
                  <input
                    type="radio"
                    name="isFeatured"
                    id="featuredyes"
                    value={true}
                    {...register("isFeatured", {
                      required: true,
                    })}
                  />
                  <label htmlFor="featuredyes" className="mx-2">
                    True
                  </label>
                </div>
                <div className="mb-4 inputRegBox">
                  <input
                    type="radio"
                    name="isFeatured"
                    id="featuredno"
                    value={false}
                    {...register("isFeatured", {
                      required: true,
                    })}
                  />
                  <label htmlFor="featuredno" className="mx-2">
                    False
                  </label>
                </div>
                <div>
                  <div className="d-flex gap-3 mb-0 inputRegBox">
                    <input
                      type="text"
                      placeholder="Extra info"
                      id="extra"
                      name="extra"
                      className="w-100 mb-2 inputReg"
                      value={extra}
                      onChange={(e) => setExtra(e.target.value)}
                    />
                  </div>
                  <div className="d-flex  gap-2 mb-0">
                    {seeExtra.map((item, i) => (
                      <p
                        key={i}
                        className="fs-6 p-1 text-white rounded-2 bg-success"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                  <Button variant="dark" type="button" onClick={addExtra}>
                    Add Extra
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="my-5 inputRegBox mx-auto">
              <Button type="submit " variant="dark" className="w-100">
                Create Product
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
