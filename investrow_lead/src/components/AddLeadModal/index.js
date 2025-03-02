import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { AddLead } from "../../actions";
import axios from "../../helpers/axios";
import { useSelector } from "react-redux";

const AddLeadForm = ({
  editLead,
  setEditLead = () => {}, // Default to an empty function if not provided
  removeEditLead = () => {}, // Default to an empty function if not provided
  toggleModal = () => {}, // Default to an empty function if not provided
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const users = useSelector((state) => state.leads.users);

  const modalRef = useRef(null);

  // Close the modal if a click outside the modal is detected
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleModal();
        removeEditLead();
        console.log("Edit lead after handle click", editLead);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleModal, removeEditLead]);

  useEffect(() => {
    console.log("This is the damn lead ", editLead);
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
        follow_up_date_time:
          editLead.follow_up_date_time ||
          /* ? new Date(editLead.follow_up_date_time).toISOString().slice(0, 16) */ // Ensure the datetime format is 'YYYY-MM-DDTHH:mm'
          "",
        action: editLead.action || "",
        assignTo: `${editLead.user_id}:${editLead.user_name}` || "",
      });
    }
  }, [editLead, reset]);

  const onSubmit = (data) => {
    // console.log("console from modal", data);
    const assigned = data.assignTo;
    var userId
    var userName
    if (assigned) {
      userId = assigned.split(":")[0];
      userName = assigned.split(":")[1];
    } else {
      userId = null;
      userName = null;
    }
    const { assignTo, ...userLead } = data;
    userLead.userId = userId;
    userLead.userName = userName;
    //console.log("Only Add Data",data)
    console.log("or from modal", userLead);
    AddLead(userLead, editLead?.lead_id);
    removeEditLead();
    toggleModal();
    reset();
  };

  return (
    <div
      ref={modalRef}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-2/5 bg-white p-4 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto"
    >
      <AiOutlineCloseSquare
        className="cursor-pointer absolute top-4 right-4 text-xl"
        onClick={() => {
          toggleModal();
          removeEditLead();
        }}
      />
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Add Lead
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-gray-700 text-sm">
            Full Name
          </label>
          <input
            id="full_name"
            type="text"
            {...register("full_name", { required: "Full Name is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs">{errors.full_name.message}</p>
          )}
        </div>

        {/* Mobile No */}
        <div>
          <label htmlFor="mobile_no" className="block text-gray-700 text-sm">
            Mobile No
          </label>
          <input
            id="mobile_no"
            type="text"
            {...register("mobile_no", {
              required: "Mobile No is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid Mobile No, must be 10 digits",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.mobile_no && (
            <p className="text-red-500 text-xs">{errors.mobile_no.message}</p>
          )}
        </div>

        {/* Email ID */}
        <div>
          <label htmlFor="email_id" className="block text-gray-700 text-sm">
            Email ID
          </label>
          <input
            id="email_id"
            type="email"
            {...register("email_id", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email_id && (
            <p className="text-red-500 text-xs">{errors.email_id.message}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <label htmlFor="service" className="block text-gray-700 text-sm">
            Service
          </label>
          <select
            id="service"
            {...register("service", { required: "Service is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Service</option>
            <option value="Mutual Fund">Mutual Fund</option>
            <option value="Insurance">Insurance</option>
            <option value="Shares Trading">Shares Trading</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
            <option value="Bond">Bond</option>
            <option value="Income Tax">Income Tax</option>
          </select>
          {errors.service && (
            <p className="text-red-500 text-xs">{errors.service.message}</p>
          )}
        </div>

        {/* Client */}
        <div>
          <label htmlFor="client" className="block text-gray-700 text-sm">
            Client
          </label>
          <select
            id="client"
            {...register("client", { required: "Client is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Client </option>
            <option value="New">New</option>
            <option value="Existing">Existing</option>
          </select>
          {errors.client && (
            <p className="text-red-500 text-xs">{errors.client.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-gray-700 text-sm">
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address", { required: "Address is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-xs">{errors.address.message}</p>
          )}
        </div>

        {/* Reference Name/No. */}
        <div>
          <label
            htmlFor="reference_name_no"
            className="block text-gray-700 text-sm"
          >
            Reference Name/No.
          </label>
          <input
            id="reference"
            type="text"
            {...register("reference_name_no", {
              required: "Reference is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.reference_name_no && (
            <p className="text-red-500 text-xs">
              {errors.reference_name_no.message}
            </p>
          )}
        </div>

        {/* Remarks */}
        <div>
          <label htmlFor="remarks" className="block text-gray-700 text-sm">
            Remarks
          </label>
          <textarea
            id="remarks"
            {...register("remarks", { required: "Remarks are required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.remarks && (
            <p className="text-red-500 text-xs">{errors.remarks.message}</p>
          )}
        </div>

        {/* Follow Up Date/Time */}
        <div>
          <label
            htmlFor="follow_up_date_time"
            className="block text-gray-700 text-sm"
          >
            Follow Up Date/Time
          </label>
          <input
            id="follow_up"
            type="datetime-local"
            {...register("follow_up_date_time", {
              required: "Follow Up Date/Time is required",
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.follow_up_date_time && (
            <p className="text-red-500 text-xs">
              {errors.follow_up_date_time.message}
            </p>
          )}
        </div>

        {/* Action */}
        {/* <div>
          <label htmlFor="action" className="block text-gray-700 text-sm">
            Action
          </label>
          <textarea
            id="action"
            {...register("action", { required: "Action is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.action && (
            <p className="text-red-500 text-xs">{errors.action.message}</p>
          )}
        </div> */}

        {/* Action */}
        <div>
          <label htmlFor="action" className="block text-gray-700 text-sm">
            Lead Status
          </label>
          <select
            id="action"
            {...register("action", { required: "Action is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Action</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Deal Final">Deal Final</option>
            <option value="Not Connected">Not Connected</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Closed">Closed</option>
          </select>
          {errors.action && (
            <p className="text-red-500 text-xs">{errors.action.message}</p>
          )}
        </div>

        {/* Assigned To */}
        <div>
          <label htmlFor="action" className="block text-gray-700 text-sm">
            Assign To
          </label>
          <select
            id="assignTo"
            {...register("assignTo", {
              required: false /* "Asssign is required" */,
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select User</option>
            {users.map((item, index) => (
              <option key={item.user_id} value={`${item.user_id}:${item.name}`}>
                {item.name}
              </option>
            ))}
            {/* <option value="Follow Up">Follow Up</option>
            <option value="Deal Final">Deal Final</option>
            <option value="Not Connected">Not Connected</option>
            <option value="Not Interested">Not Interested</option> */}
          </select>
          {errors.assign && (
            <p className="text-red-500 text-xs">{errors.assign.message}</p>
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

export default AddLeadForm;
