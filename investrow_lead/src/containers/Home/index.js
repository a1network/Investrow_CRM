import React, { useEffect, useState } from "react";
import { Row, Col, Button, Table, Form } from "react-bootstrap";
import { Layout } from "../../components/Layout";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap-icons/bootstrap-icons.css";
import "../../assets/css/Home.css";
import {
  getAllLeads,
  deleteLead,
  getSingleLead,
  updateLeadClose,
} from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { HomeInput } from "../../components/UI/Input";
import { MdDelete } from "react-icons/md";
import AddLeadModal from "../../components/AddLeadModal";
import AddUserModal from "../../components/AddUserModal";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const auth = useSelector((state) => state.auth);
  const userName = auth.user.name;
  const userRole = auth.user.role;
  const _id = auth.user.user_id;
  const leads = useSelector((state) => state.leads.leads);
  const singleLeadItem = useSelector((state) => state.singleLead.singleLead);
  const dispatch = useDispatch();
  const [notes, setNotes] = useState("");
  const [addLeadsModal, setAddLeadsModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [editLead, setEditLead] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
    const users = useSelector((state) => state.leads.users);
   const [showUsers, setShowUsers] = useState(false);

  const  [closedLeadsCount ,setclosedLeadsCount ] = useState(0)

  useEffect(() => {
    dispatch(getAllLeads());
    let count = [];
    for (let lead of leads) {
      if (lead.action === "Closed") {
        count.push(lead);
      }
    }
    setclosedLeadsCount(count.length)
    console.log("leads from home index", leads);
  }, [leads]);

  useEffect(() => {
    if (!userName) {
      navigate("/signin");
    }
  }, [userName]);

  // Filter leads based on the search input
  useEffect(() => {
    if (searchInput === "") {
      setFilteredLeads(leads); // If search is empty, show all leads
    } else {
      const filtered = leads.filter((lead) =>
        Object.values(lead)
          .join(" ")
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      );
      setFilteredLeads(filtered); // Update the filtered leads
    }
  }, [searchInput, leads]); // Re-run this effect whenever searchInput or leads changes

  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }

  const deletelead = (id) => {
    deleteLead(id);
  };

  const assignLead = async (leadId, userId) => {
    const tempLead = await leads.find((item) => item.lead_id === leadId);
    setEditLead(tempLead);
    setAddLeadsModal(true);
  };

  const removeEditLead = () => {
    setEditLead(() => {});
  };

  const renderLeads = (leads) => {
    let leadItem = [];
    for (let lead of leads) {
      if (userRole === "admin") {
        leadItem.push(
          <tr className="table-content" key={lead.lead_id}>
            <td>
              <p className="home-edit" id="lead">
                {lead.lead_id}
              </p>
            </td>
            <td>{lead.full_name}</td>
            <td>{lead.mobile_no}</td>
            <td>{lead.email_id}</td>
            <td>{lead.service}</td>
            <td>{lead.client}</td>
            <td>{lead.address}</td>
            <td>{lead.reference_name_no}</td>
            <td>{lead.remarks}</td>
            <td>{lead.follow_up_date_time}</td>
            <td>{lead.action}</td>
            <td className="relative">
              {lead.user_name ? lead.user_name : "Not Assigned"}
            </td>
            <td>
              <FaEdit onClick={() => assignLead(lead.lead_id, _id)}
              style={{ cursor: "pointer", fontSize: "15px", color: "skyblue" }}
               />
            </td>
            <td>
              <MdDelete
                onClick={() => deletelead(lead.lead_id)}
                style={{ cursor: "pointer", fontSize: "15px", color: "red" }}
              />
            </td>
          </tr>
        );
      } else if (lead.user_id === _id) {
        leadItem.push(
          <tr className="table-content" key={lead.lead_id}>
            <td>
              <p className="home-edit" id="lead">
                {lead.lead_id}
              </p>
            </td>
            <td>{lead.full_name}</td>
            <td>{lead.mobile_no}</td>
            <td>{lead.email_id}</td>
            <td>{lead.service}</td>
            <td>{lead.client}</td>
            <td>{lead.address}</td>
            <td>{lead.reference_name_no}</td>
            <td>{lead.remarks}</td>
            <td>{lead.follow_up_date_time}</td>
            <td>{lead.action}</td>
            <td className="">
              {lead.user_name ? lead.user_name : "Not Assigned"}
            </td>
            <td>
              <FaEdit onClick={() => assignLead(lead.lead_id, _id)}
              style={{ cursor: "pointer", fontSize: "15px", color: "skyblue" }} />
            </td>
            <td>
              <MdDelete
                onClick={() => deletelead(lead.lead_id)}
                style={{ cursor: "pointer", fontSize: "15px", color: "red" }}
              />
            </td>
          </tr>
        );
      }
    }
    return leadItem;
  };

  const renderClosedLeads = (leads) => {
    let leadItem = [];
    for (let lead of leads) {
      if ( lead.action === "Closed") {
        leadItem.push(
          <tr className="table-content" key={lead.lead_id}>
            <td>{lead.lead_id}</td>
            <td>{lead.full_name}</td>
            <td>{lead.mobile_no}</td>
            <td>{lead.email_id}</td>
            <td>{lead.service}</td>
            <td>{lead.client}</td>
            <td>{lead.address}</td>
            <td>{lead.reference_name_no}</td>
            <td>{lead.remarks}</td>
            <td>{lead.follow_up_date_time}</td>
            <td>{lead.action}</td>
            <td>{lead.user_name}</td>
            <td>
              <FaEdit onClick={() => assignLead(lead.lead_id, _id)}
               style={{ cursor: "pointer", fontSize: "15px", color: "skyblue" }} />
            </td>
            <td>
              <MdDelete
                onClick={() => deletelead(lead.lead_id)}
                style={{ cursor: "pointer", fontSize: "15px", color: "red" }}
              />
            </td>
          </tr>
        );
      }
    }

    
    return leadItem;
  };

  const totalLeadsCount = (leads) => {
    return leads.length;
  };

  const assignedLeadsCount = (leads) => {
    let count = 0;
    for (let lead of leads) {
      if (lead.user_id === _id) {
        count++;
      }
    }
    return count;
  };

  // const closedLeadsCount = (leads) => {
   
  //   return count.length;
  // };

  const closeAddLeadModal = () => {
    setAddLeadsModal(false);
  };
  const closeAddUserModal = () => {
    setAddUserModal(false);
  };

  return (
    <Layout>
      {addLeadsModal && (
        <AddLeadModal
          removeEditLead={removeEditLead}
          editLead={editLead}
          setEditLead={setEditLead}
          toggleModal={closeAddLeadModal}
        />
      )}
      {addUserModal && userRole === "admin" && (
        <AddUserModal toggleUserModal={closeAddUserModal} />
      )}
      <div className="home" style={{ borderTop: "1px solid #efefef" }}>
        <div>
          <Row className="leads">
            {/* <h4 className="text-muted ml-7">Leads assigned to you:</h4>  */}
            {/* <p className="ml-7 mb-0 text-success">
              Select lead ID to populate form below for actioning.
            </p> */}

            <div className="flex justify-between mb-5 max-w-[1300px]">
              <span
                onClick={() => setAddLeadsModal(true)}
                className="cursor-pointer flex ml-7 mt-4 mb-0 items-center gap-1 font-semibold text-sky-500"
              >
                <IoMdAddCircle /> Add Lead
              </span>
              {userRole === "admin" && (
                <span
                  onClick={() => setAddUserModal(true)}
                  className="cursor-pointer flex ml-7 mt-4 mb-0 items-center gap-1 font-semibold text-sky-500"
                >
                  <IoMdAddCircle /> Add User
                </span>
              )}

<Row className="cursor-pointer mb-3 flex gap-8 mt-10 ml-5">
  <Col className="col-10 text-muted"></Col>
  <Col className="col-1">
    {showSearch && (
      <input
        className="search-input"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for leads"
      />
    )}
    <a
      className="btn-sm"
      variant="success"
      type="btn"
      style={{
        border: "1px solid rgb(194, 189, 189)",
        borderRadius: "5px",
      }}
    >
      <i
        onClick={() => setShowSearch(!showSearch)}
        className="bi bi-search text-white ms-2"
      ></i>
    </a>
  </Col>
</Row>
           {/* Show Users Button */}
           <span className="text-sky-500 font-medium mt-8 cursor-pointer" onClick={() => setShowUsers(!showUsers)}>
          Show Users
        </span>

        {/* User List (Visible when showUsers is true) */}
        {showUsers && (
          <div className="absolute bg-white border border-gray-300 shadow-md mt-2 p-3 rounded-lg max-h-40 overflow-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <p key={user.user_id} className="text-gray-700">
                  {user.name}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No users available</p>
            )}
          </div>
        )}


            </div>

            <Col className="scroller table-container">
              <Table striped bordered hover size="sm" className="table">
                <thead className="table-head">
                  <tr>
                    <th>Lead ID</th>
                    <th>Full Name</th>
                    <th>Mobile no.</th>
                    <th>Email ID</th>
                    <th>Service</th>
                    <th>Client</th>
                    <th>Address</th>
                    <th>Reference Name/No.</th>
                    <th>Remarks</th>
                    <th>Follow Up Date/Time</th>
                    <th>Action</th>
                    <th>Assigned To</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{renderLeads(filteredLeads)}</tbody>
              </Table>
            </Col>

            <Col
              className=""
              style={{
                marginLeft: "10px",
              }}
            >
              <h5 className="text-muted mt-2 text-sky-500 font-bold text-2xl mb-2 ml-5">Summary</h5>
              <Row
                style={{
                  borderTop: "1px solid rgb(194, 189, 189)",
                  borderBottom: "1px solid rgb(194, 189, 189)",
                  

                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Col className="summaries">
                  <p className="summary-figure text-info">
                    {totalLeadsCount(leads)}
                  </p>
                  <p className="summary-title  border-black">Total Leads</p>
                </Col>
                <Col className="summaries">
                  <p className="summary-figure text-warning">
                    {assignedLeadsCount(leads)}
                  </p>
                  <p className="summary-title">Assigned Leads</p>
                </Col>
                <Col className="summaries">
                  <p className="summary-figure text-success">
                    {closedLeadsCount}
                  </p>
                  <p className="summary-title">Closed Leads</p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="leads-details">
            <Col className="scroller table-container">
              <h5 className="text-muted mt-2 mb-3 ml-3 text-sky-500 font-bold text-2xl">
                Your Closed Leads 
              </h5>
              {closedLeadsCount  >= 1 ? (
                  <Table
                  striped
                  bordered
                  hover
                  className="scroller table-container table"
                >
                  <thead className="table-head">
                    <tr>
                      <th>Lead ID</th>
                      <th>Name</th>
                      <th>Mobile No.</th>
                      <th>Email Id.</th>
                      <th>Service</th>
                      <th>Client</th>
                      <th>Address</th>
                      <th>Reference Name/No.</th>
                      <th>Remarks</th>
                      <th>Follow Up Date/Time</th>
                      <th>Action</th>
                      <th>Assigned To</th>
                    </tr>
                  </thead>
                  <tbody>{renderClosedLeads(leads)}</tbody>
                </Table>
              
              ) : (
                <a className="ml-3 text-xl">Closed Leads will appear here</a>
              )}
              
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default Home;