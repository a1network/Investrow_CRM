import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { AddLead } from "../../actions";
import axios from "../../helpers/axios";
import { useSelector } from "react-redux";

const AddUsersForm = ({ toggleUserModal = () => {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const modalRef = useRef(null);

  const token = useSelector((state) => state.auth.token);

  // Close the modal if a click outside the modal is detected
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleUserModal();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleUserModal]);

  /* useEffect(() => {
    console.log("This is the damn lead ", editLead.follow_up_date_time);
    if (editLead) {
      reset({
        full_name: editLead.full_name || "",
        mobile_no: editLead.mobile_no || "",
        email_id: editLead.email_id || "",
        service: editLead.service || "",
        client: editLead.client || "",
        address: editLead.address || "",
        reference_name_no: editLead.reference_name_no || "",
        remarks: editLead.remarks || "",
        follow_up_date_time: editLead.follow_up_date_time || "",
        action: editLead.action || "",
        assignTo: `${editLead.user_id}:${editLead.user_name}` || "",
      });
    }
  }, [editLead, reset]); */

  const onSubmit = async (data) => {
    try {
      if (!token) {
        console.error("Token is missing. Cannot make the request.");
        return;
      }
      const response = await axios.post("/add-user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toggleUserModal()

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      ref={modalRef}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-2/5 bg-white p-4 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto"
    >
      <AiOutlineCloseSquare
        className="cursor-pointer absolute top-4 right-4 text-xl"
        onClick={() => {
          toggleUserModal();
        }}
      />
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Add User
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile No */}
        <div>
          <label htmlFor="mob" className="block text-gray-700 text-sm">
            Mobile No
          </label>
          <input
            id="mob"
            type="number"
            {...register("mob", {
              required: "Mobile No is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid Mobile No, must be 10 digits",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.mob && (
            <p className="text-red-500 text-xs">{errors.mob.message}</p>
          )}
        </div>

        {/* Email ID */}
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm">
            Email ID
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-gray-700 text-sm">
            Role
          </label>
          <select
            id="role"
            {...register("role", { required: "Role is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                /* value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, */
                message: "Invalid password",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsersForm;
