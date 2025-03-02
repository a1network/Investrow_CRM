import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminProfile = () => {
  const leads = useSelector((state) => state.leads.leads);
  const users = useSelector((state) => state.leads.users);
  const adminData = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminData.name) {
      navigate("/signin");
    }
  }, [adminData]);
  useEffect(() => {
    console.log("Data from admin profile", leads, users);
  }, [leads, users]);

  const totalLeads = leads.length;

  const userPerformanceData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Assigned Leads",
        data: users.map(
          (user) => leads.filter((lead) => lead.user_id === user.user_id).length
        ),
        backgroundColor: "#4db8ff",
      },
      {
        label: "Closed Leads",
        data: users.map(
          (user) =>
            leads.filter(
              (lead) =>
                lead.user_id === user.user_id && lead.status === "closed"
            ).length
        ),
        backgroundColor: "#ff6347",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "User Performance Comparison",
      },
    },
  };

  return (
    <Layout>
      <div className="profile-container admin-profile">
        {/* Admin Profile Section */}
        <div className="profile-header">
          <div className="profile-image">
            <img
              src="https://via.placeholder.com/150"
              alt="Admin Profile"
              className="profile-img"
            />
          </div>
          <div className="profile-info">
            <h2>{adminData.name}</h2>
            <p className="email">{adminData.email}</p>
            <p className="role">{adminData.role.toUpperCase()}</p>
            <p className="mobile">{adminData.mob}</p>
          </div>
        </div>

        {/* Total Leads Section */}
        <div className="total-leads">
          <div className="stat-card">
            <h4>Total Leads Across Platform</h4>
            <p>{totalLeads}</p>
          </div>
        </div>

        {/* User Performance Graph */}
        <div className="graph">
          <h3>Lead Assignment vs Closure (User Comparison)</h3>
          <Bar data={userPerformanceData} options={options} />
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
