import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Button, Spinner } from "react-bootstrap";
import { useStore } from "../config/store";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import registerOptions from "../utils/formValidation";
import { updateUserProfile, uploadToCloudinary } from "../config/api";

export default function UpdateProfile() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [imgPic, setImgPic] = useState(""); //send to cloudinary
  const [imgLink, setImgLink] = useState(""); //get cloudinary
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.user?.username,
      email: currentUser?.user?.email,
    },
  });

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  useEffect(() => {
    if (imgPic !== "") {
      const handleImgUpload = async () => {
        try {
          const upload = await uploadToCloudinary(imgPic);
          console.log("cloud", upload);
          const updatedProfileImg = upload.data.secure_url;
          setImgLink(updatedProfileImg);
        } catch (error) {
          console.log(error);
          toast.error("Error uploading profile image");
        }
      };

      handleImgUpload();
    }
  }, [imgPic]);

  const onSubmitHandler = async (data) => {
    setLoading(true);
    const UpdatedProfile = {
      _id: currentUser?.user?._id,
      username: data.username,
      email: data.email,
      password: data.password,
      profileImg: imgLink,
    };
    try {
      const res = await updateUserProfile(
        UpdatedProfile,
        currentUser.access_token
      );
      console.log("formres", res);
      setCurrentUser(res.data);
      toast.success("Your Profile was updated successfully");

      navigate(`/account/user-profile/${res.data?.user?.username}`);
    } catch (error) {
      console.log(error);
      toast.error("Error updating your profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="inputRegBox mx-auto">
        <h1 className="text-center">UpdateProfile</h1>
      </div>
      <form
        className="d-flex flex-column align-items-center w-100"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className="mb-3 inputRegBox">
          <input
            type="text"
            placeholder="Username"
            name="username"
            id="username"
            className="w-100 mb-0 inputReg"
            autoFocus
            {...register("username", registerOptions.username)}
          />
          {errors?.username?.message && (
            <p className="text-danger fs-6">{errors.username.message}</p>
          )}
        </div>
        <div className="mb-3 inputRegBox">
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            className="w-100 mb-0 inputReg"
            {...register("email", registerOptions.email)}
          />
          {errors?.email?.message && (
            <p className="text-danger fs-6">{errors.email.message}</p>
          )}
        </div>
        <div
          className="inputRegBox mb-1 fs-6"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPass(!showPass)}
        >
          Update password?{" "}
          <span
            className={
              showPass
                ? "text-success fw-medium fs-5"
                : "text-black fw-medium fs-5"
            }
          >
            {showPass ? "Hide" : "Click to Update"}
          </span>
        </div>
        {showPass && (
          <div className="mb-3 inputRegBox position-relative">
            <input
              type={passwordShown ? "text" : "password"}
              placeholder="password"
              name="password"
              id="password"
              className="w-100 mb-0 inputReg"
              {...register("password", registerOptions.password)}
            />
            {passwordShown ? (
              <AiFillEye
                className="position-absolute end-0 translate-middle"
                style={{ top: "50%", cursor: "pointer" }}
                onClick={togglePassword}
              />
            ) : (
              <AiFillEyeInvisible
                className="position-absolute end-0 translate-middle"
                style={{ top: "50%", cursor: "pointer" }}
                onClick={togglePassword}
              />
            )}
          </div>
        )}

        {errors?.password?.message && (
          <p className="text-danger fs-6">{errors.password.message}</p>
        )}
        <div className="my-3 inputRegBox">
          <label htmlFor="profilepic">Update profile image</label>
          <input
            type="file"
            name="profilepic"
            accept="imgage/png, image/jpeg, image/jpg, image/webp"
            id="profilepic"
            className="border p-2 w-100 mb-0 border-black"
            onChange={(e) => setImgPic(e.target.files[0])}
          />
        </div>
        <div className="mb-3 inputRegBox">
          <Button type="submit" variant="dark" className="w-100 rounded-0">
            {loading ? <Spinner animation="border" size="sm" /> : "Update"}
          </Button>
        </div>
      </form>
    </>
  );
}
