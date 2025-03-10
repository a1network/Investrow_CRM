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
import { Navbar } from "react-bootstrap";
import logo from "../../assets/images/Investrow_logo.png";
import { logout } from "../../actions";


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
  const signout = () => {
      dispatch(logout());
    };

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

<div className="sticky top-0 bg-white shadow-md border-b border-orange-500 z-50">
  <div className="flex justify-between items-center px-6 py-3 max-w-[1600px] mx-auto">
    
    {/* Left - Logo */}
    <div className="flex-shrink-0">
      <Navbar.Brand className="flex items-center text-gray-800 font-semibold text-lg">
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-10 w-auto mr-2" alt="Investrow Logo" />
        </Link>
      </Navbar.Brand>
    </div>

    {/* Center - Actions */}
    <div className="flex-1 flex justify-center items-center gap-10">
      <span
        onClick={() => setAddLeadsModal(true)}
        className="cursor-pointer flex items-center gap-1 font-semibold text-sky-500"
      >
        <IoMdAddCircle /> Add Lead
      </span>
      
      {userRole === "admin" && (
        <span
          onClick={() => setAddUserModal(true)}
          className="cursor-pointer flex items-center gap-1 font-semibold text-sky-500"
        >
          <IoMdAddCircle /> Add User
        </span>
      )}

      {/* Search Bar */}
      <div className="relative flex items-center">
        {showSearch && (
          <input
            className="search-input border border-gray-300 rounded-lg px-3 py-1"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for leads"
          />
        )}
        <i
          onClick={() => setShowSearch(!showSearch)}
          className="bi bi-search text-gray-600 cursor-pointer ml-2"
        ></i>
      </div>

      {/* Show Users Button */}
      <span
        className="text-sky-500 font-medium cursor-pointer"
        onClick={() => setShowUsers(!showUsers)}
      >
        Show Users
      </span>

      {/* User List */}
      {showUsers && (
        <div className="absolute right-10 top-12 bg-white border border-gray-300 shadow-md p-3 rounded-lg max-h-40 overflow-auto">
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

    {/* Right - User Info and Logout */}
    <div className="flex-shrink-0 flex items-center gap-4">
      {auth.user ? (
        <Navbar.Text className="text-gray-700 font-medium">
          Welcome, {" "}
          <Link to="/admin-profile" className="text-sky-500 hover:underline">
            {auth.user.name}
          </Link>
        </Navbar.Text>
      ) : (
        <Navbar.Text className="text-gray-500">Not Logged In</Navbar.Text>
      )}

      <i
        className="bi bi-box-arrow-right text-xl text-green-500 cursor-pointer hover:text-red-500 transition"
        onClick={signout}
      ></i>
    </div>

  </div>
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