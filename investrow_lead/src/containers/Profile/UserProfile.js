// components/UserProfile.js

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./UserProfile.css";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { SideNav } from "../../components/SideNav";
import { Layout } from "../../components/Layout";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserProfile = () => {
  const userData = useSelector((state) => state.auth.user);
  const leads = useSelector((state) => state.leads.leads);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData.name) {
      navigate("/signin");
    }
  }, [userData]);

  const assignedLeadsCount = (leads) => {
    let count = 0;
    for (let lead of leads) {
      if (lead.user_id === userData.user_id) {
        count++;
      }
    }
    return count;
  };
  const closedLeadsCount = (leads) => {
    let count = 0;
    for (let lead of leads) {
      if (lead.user_id === userData.user_id && lead.action === "Closed") {
        count++;
      }
    }
    return count;
  };
  const totalLeadsCount = (leads) => {
    let count = 0;
    for (let lead of leads) {
      if (lead.user_id === userData.user_id) {
        count++;
      }
    }
    return count;
  };

  const data = {
    labels: ["Assigned Leads", "Closed Leads"],
    datasets: [
      {
        label: "Leads Distribution",
        data: [assignedLeadsCount(leads), closedLeadsCount(leads)],
        backgroundColor: ["#4db8ff", "#ff6347"],
        hoverBackgroundColor: ["#338bcc", "#f02c26"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    console.log("This is user Info", userData);
  });

  return (
    <Layout>
      
      <div className="profile-container user-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="profile-img"
            />
          </div>
          <div className="profile-info">
            <h2>{userData.name}</h2>
            <p className="email">{userData.email}</p>
            <p className="role">{userData.role.toUpperCase()}</p>
            <p className="mobile">{userData.mob}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-card">
            <h4>Total Leads</h4>
            <p>{leads.length}</p>
          </div>
          <div className="stat-card">
            <h4>Assigned Leads</h4>
            <p>{assignedLeadsCount(leads)}</p>
          </div>
          <div className="stat-card">
            <h4>Closed Leads</h4>
            <p>{closedLeadsCount(leads)}</p>
          </div>
        </div>

        {/* Leads Graph */}
        <div className="graph">
          <h3>Leads Performance</h3>
          <Doughnut data={data} />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
