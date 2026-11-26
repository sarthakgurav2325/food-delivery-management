
import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";
import {
  LayoutDashboard,
  Utensils,
  Users,
  ShoppingBag,
  Bike,
  MapPin,
  Menu,
  Bell,
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock,
  RefreshCw,
  X,
  CheckCircle,
  LogOut,
  Eye,
  EyeOff,
 
} from "lucide-react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

axios.defaults.withCredentials = true;

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

const emptyFood = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true
};

const emptyCustomer = {
  fullName: "",
  email: "",
  phone: "",
  address: ""
};

const emptyPartner = {
  fullName: "",
  phone: "",
  vehicleType: "",
  vehicleNumber: "",
  available: true
};

const emptyOrder = {
  customerId: "",
  deliveryPartnerId: "",
  totalAmount: "",
  deliveryAddress: "",
  orderStatus: "Pending"
};

const emptyTracking = {
  currentLocation: "",
  latitude: "",
  longitude: "",
  deliveryStatus: ""
};

const emptyAuthForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  invitationCode: ""
};

function App() {
  // AUTHENTICATION
  const [currentView, setCurrentView] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authPage, setAuthPage] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [authForm, setAuthForm] = useState(emptyAuthForm);

  // DASHBOARD
  const [activePage, setActivePage] = useState("Dashboard");
  const [foods, setFoods] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const [foodSearch, setFoodSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [foodForm, setFoodForm] = useState(emptyFood);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [partnerForm, setPartnerForm] = useState(emptyPartner);
  const [orderForm, setOrderForm] = useState(emptyOrder);

  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState("");
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [trackingForm, setTrackingForm] = useState(emptyTracking);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const [globalSearch, setGlobalSearch] = useState("");

  // AUTHENTICATION FUNCTIONS

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        await axios.get(`${API}/admin/me`);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminSession();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (authPage === "register") {
      if (authForm.password !== authForm.confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }

      if (authForm.password.length < 8) {
        setAuthError("Password must contain at least 8 characters.");
        return;
      }
    }

    setAuthLoading(true);

    try {
      if (authPage === "login") {
        await axios.post(`${API}/admin/login`, {
          email: authForm.email,
          password: authForm.password
        });

        setIsAuthenticated(true);
        setAuthForm(emptyAuthForm);
      } else {
        await axios.post(`${API}/admin/register`, {
          fullName: authForm.fullName,
          email: authForm.email,
          password: authForm.password,
          confirmPassword: authForm.confirmPassword,
          invitationCode: authForm.invitationCode
        });

        setAuthPage("login");
        setAuthForm({
          ...emptyAuthForm,
          email: authForm.email
        });
        setAuthSuccess("Account created successfully. Please log in.");
      }
    } catch (error) {
      setAuthError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/admin/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setAuthPage("login");
      setAuthForm(emptyAuthForm);
      setAuthError("");
      setAuthSuccess("");
    }
  };

  const switchAuthPage = (page) => {
    setAuthPage(page);
    setAuthError("");
    setAuthSuccess("");
    setAuthForm(emptyAuthForm);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // LOAD DASHBOARD DATA

  const loadFoods = async () => {
    const res = await axios.get(`${API}/foods`);
    setFoods(res.data);
  };

  const loadCustomers = async () => {
    const res = await axios.get(`${API}/customers`);
    setCustomers(res.data);
  };

  const loadPartners = async () => {
    const res = await axios.get(`${API}/delivery-partners`);
    setDeliveryPartners(res.data);
  };

  const loadOrders = async () => {
    const res = await axios.get(`${API}/orders`);
    setOrders(res.data);
  };

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadFoods(),
        loadCustomers(),
        loadPartners(),
        loadOrders()
      ]);
    } catch (error) {
      console.error("Unable to load application data:", error);
      alert("Unable to load data. Check that your Spring Boot backend is running.");
    }
  };

  useEffect(() => {
  if (!isAuthenticated) return;

  const fetchDashboardData = async () => {
    await loadAllData();
  };

  fetchDashboardData();
}, [isAuthenticated]);
  // FOOD MANAGEMENT

  const handleFoodSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...foodForm,
        price: Number(foodForm.price)
      };

      if (editingFoodId) {
        await axios.put(`${API}/foods/${editingFoodId}`, data);
      } else {
        await axios.post(`${API}/foods`, data);
      }

      await loadFoods();
      setShowFoodForm(false);
      setEditingFoodId(null);
      setFoodForm(emptyFood);
    } catch (error) {
      console.error(error);
      alert("Unable to save food.");
    }
  };

  const editFood = (food) => {
    setFoodForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      category: food.category || "",
      imageUrl: food.imageUrl || "",
      available: food.available ?? true
    });

    setEditingFoodId(food.id);
    setShowFoodForm(true);
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food item?")) return;

    try {
      await axios.delete(`${API}/foods/${id}`);
      await loadFoods();
    } catch {
      alert("Unable to delete food.");
    }
  };

  // CUSTOMER MANAGEMENT

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCustomerId) {
        await axios.put(`${API}/customers/${editingCustomerId}`, customerForm);
      } else {
        await axios.post(`${API}/customers`, customerForm);
      }

      await loadCustomers();
      setShowCustomerForm(false);
      setEditingCustomerId(null);
      setCustomerForm(emptyCustomer);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save customer.");
    }
  };

  const editCustomer = (customer) => {
    setCustomerForm({
      fullName: customer.fullName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || ""
    });

    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await axios.delete(`${API}/customers/${id}`);
      await loadCustomers();
    } catch {
      alert("Unable to delete customer. It may be linked to an order.");
    }
  };

  // DELIVERY PARTNER MANAGEMENT

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPartnerId) {
        await axios.put(
          `${API}/delivery-partners/${editingPartnerId}`,
          partnerForm
        );
      } else {
        await axios.post(`${API}/delivery-partners`, partnerForm);
      }

      await loadPartners();
      await loadOrders();

      setShowPartnerForm(false);
      setEditingPartnerId(null);
      setPartnerForm(emptyPartner);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save delivery partner.");
    }
  };

  const editPartner = (partner) => {
    setPartnerForm({
      fullName: partner.fullName || "",
      phone: partner.phone || "",
      vehicleType: partner.vehicleType || "",
      vehicleNumber: partner.vehicleNumber || "",
      available: partner.available ?? true
    });

    setEditingPartnerId(partner.id);
    setShowPartnerForm(true);
  };

  const deletePartner = async (id) => {
    if (!window.confirm("Delete this delivery partner?")) return;

    try {
      await axios.delete(`${API}/delivery-partners/${id}`);
      await loadPartners();
    } catch {
      alert("Unable to delete this partner. They may be assigned to an order.");
    }
  };

  // ORDER MANAGEMENT

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    try {
      const customer = customers.find(
        (item) => item.id === Number(orderForm.customerId)
      );

      const partner = deliveryPartners.find(
        (item) => item.id === Number(orderForm.deliveryPartnerId)
      );

      if (!customer) {
        alert("Please select a customer.");
        return;
      }

      if (orderForm.deliveryPartnerId && !partner) {
        alert("Please select a valid delivery partner.");
        return;
      }

      const data = {
        customer: { id: customer.id },
        deliveryPartner: partner ? { id: partner.id } : null,
        totalAmount: Number(orderForm.totalAmount),
        deliveryAddress: orderForm.deliveryAddress,
        orderStatus: orderForm.orderStatus
      };

      if (editingOrderId) {
        await axios.put(`${API}/orders/${editingOrderId}`, data);
      } else {
        await axios.post(`${API}/orders`, data);
      }

      await Promise.all([loadOrders(), loadPartners()]);

      setShowOrderForm(false);
      setEditingOrderId(null);
      setOrderForm(emptyOrder);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to save order.");
    }
  };

  const editOrder = (order) => {
    setOrderForm({
      customerId: order.customer?.id || "",
      deliveryPartnerId: order.deliveryPartner?.id || "",
      totalAmount: order.totalAmount ?? "",
      deliveryAddress: order.deliveryAddress || "",
      orderStatus: order.orderStatus || "Pending"
    });

    setEditingOrderId(order.id);
    setShowOrderForm(true);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/orders/${id}/status`, { status });
      await loadOrders();
      await loadPartners();
    } catch (error) {
      console.error(error);
      alert("Unable to update order status.");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    await updateOrderStatus(id, "Cancelled");
  };

  const availablePartners = deliveryPartners.filter(
    (partner) => partner.available
  );

  // ORDER TRACKING

  const loadTracking = async (orderId) => {
    if (!orderId) {
      setTrackingHistory([]);
      return;
    }

    setLoadingTracking(true);

    try {
      const res = await axios.get(`${API}/tracking/${orderId}`);
      setTrackingHistory(res.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load tracking history.");
    } finally {
      setLoadingTracking(false);
    }
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTrackingOrder) {
      alert("Select an order first.");
      return;
    }

    try {
      const data = {
        currentLocation: trackingForm.currentLocation,
        latitude:
          trackingForm.latitude === "" ? null : Number(trackingForm.latitude),
        longitude:
          trackingForm.longitude === "" ? null : Number(trackingForm.longitude),
        deliveryStatus: trackingForm.deliveryStatus || undefined
      };

      await axios.post(
        `${API}/tracking/${selectedTrackingOrder}`,
        data
      );

      await loadTracking(selectedTrackingOrder);
      setTrackingForm(emptyTracking);
      alert("Tracking update added successfully.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to add tracking update.");
    }
  };

  // HELPERS

  const estimateDelivery = (status) => {
    const estimates = {
      Pending: "Not estimated yet",
      Confirmed: "About 45–60 minutes",
      Preparing: "About 30–45 minutes",
      "Picked Up": "About 20–30 minutes",
      "Out for Delivery": "About 10–20 minutes",
      Delivered: "Delivered",
      Cancelled: "Cancelled"
    };

    return estimates[status] || "To be confirmed";
  };

  const statusClass = (status) =>
    `status-badge status-${(status || "pending").toLowerCase().replaceAll(" ", "-")}`;

  const filteredFoods = foods.filter((item) =>
    `${item.name} ${item.category || ""}`
      .toLowerCase()
      .includes(foodSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((item) =>
    `${item.fullName} ${item.email} ${item.phone}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase())
  );

  const filteredPartners = deliveryPartners.filter((item) =>
    `${item.fullName} ${item.phone} ${item.vehicleNumber}`
      .toLowerCase()
      .includes(partnerSearch.toLowerCase())
  );

  const activeOrders = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.orderStatus)
  ).length;

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Food Management", icon: Utensils },
    { name: "Customers", icon: Users },
    { name: "Orders", icon: ShoppingBag },
    { name: "Delivery Partners", icon: Bike },
    { name: "Order Tracking", icon: MapPin }
  ];

  // AUTHENTICATION LOADING SCREEN

  if (checkingAuth) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="brand-icon">
            <Utensils size={30} />
          </div>
          <h2>FoodExpress</h2>
          <p>Checking your admin session...</p>
          <div className="auth-loader"></div>
        </div>
      </div>
    );
  }

  // PUBLIC HOME PAGE

if (!isAuthenticated && currentView === "home") {
  return (
    <HomePage
      onAdminLogin={() => {
        setCurrentView("admin-login");
        switchAuthPage("login");
      }}
    />
  );
}

  // LOGIN AND REGISTRATION SCREEN

  
if (!isAuthenticated) {
  return (
    <div className="auth-container">
      <div className="auth-layout">

        {/* LEFT IMAGE */}
        <div className="auth-image-section">
          <img
            src="/images/foodexpress-admin-login.png"
            alt="FoodExpress Admin Login"
            className="auth-hero-image"
          />
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Utensils size={30} />
            </div>
            <h1>FoodExpress</h1>
            <p>Management System</p>
          </div>

          <div className="auth-heading">
            <h2>
              {authPage === "login"
                ? "Admin Login"
                : "Create Admin Account"}
            </h2>
            <p>
              {authPage === "login"
                ? "Sign in to manage your food delivery business."
                : "Register using your administrator invitation code."}
            </p>
          </div>

          {authError && (
            <div className="auth-error">{authError}</div>
          )}

          {authSuccess && (
            <div className="auth-success">{authSuccess}</div>
          )}

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authPage === "register" && (
              <div className="auth-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={authForm.fullName}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      fullName: e.target.value
                    })
                  }
                  maxLength={100}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      password: e.target.value
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {authPage === "register" && (
              <>
                <div className="auth-field">
                  <label>Confirm Password</label>
                  <div className="auth-password">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={authForm.confirmPassword}
                      onChange={(e) =>
                        setAuthForm({
                          ...authForm,
                          confirmPassword: e.target.value
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword
                        ? <EyeOff size={19} />
                        : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label>Invitation Code</label>
                  <input
                    type="password"
                    placeholder="Enter admin invitation code"
                    value={authForm.invitationCode}
                    onChange={(e) =>
                      setAuthForm({
                        ...authForm,
                        invitationCode: e.target.value
                      })
                    }
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={authLoading}
            >
              {authLoading
                ? "Please wait..."
                : authPage === "login"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            {authPage === "login" ? (
              <>
                Don't have an admin account?{" "}
                <button
                  type="button"
                  onClick={() => switchAuthPage("register")}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchAuthPage("login")}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          <p className="auth-footer">
            FoodExpress Admin Portal
          </p>

        </div>
      </div>
    </div>
  );
}


  // MAIN DASHBOARD

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Utensils size={25} />
          </div>
          <div>
            <h2>FoodExpress</h2>
            <span>Management System</span>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`menu-item ${activePage === item.name ? "active" : ""}`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setActivePage("Dashboard")}
            >
              <Menu size={22} />
            </button>

            <div>
              <h3>{activePage}</h3>
              <p>Welcome to FoodExpress Management</p>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                placeholder="Search orders..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            <button className="notification-button" title="Notifications">
              <Bell size={21} />
            </button>

            <div className="profile-avatar">A</div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <section className="page-content">

          {/* DASHBOARD */}

          {activePage === "Dashboard" && (
            <>
              <div className="welcome-section">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p>Monitor your food delivery business at a glance.</p>
                </div>

                <button className="primary-button" onClick={loadAllData}>
                  <RefreshCw size={17} /> Refresh Data
                </button>
              </div>

              <div className="stats-grid">
                {[
                  {
                    title: "Total Foods",
                    value: foods.length,
                    icon: Utensils,
                    color: "orange"
                  },
                  {
                    title: "Total Customers",
                    value: customers.length,
                    icon: Users,
                    color: "blue"
                  },
                  {
                    title: "Total Orders",
                    value: orders.length,
                    icon: ShoppingBag,
                    color: "green"
                  },
                  {
                    title: "Available Partners",
                    value: availablePartners.length,
                    icon: Bike,
                    color: "purple"
                  }
                ].map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div className="stat-card" key={stat.title}>
                      <div className={`stat-icon ${stat.color}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p>{stat.title}</p>
                        <h2>{stat.value}</h2>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="stats-grid secondary-stats">
                <div className="stat-card">
                  <div className="stat-icon orange">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p>Active Orders</p>
                    <h2>{activeOrders}</h2>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p>Delivered Orders</p>
                    <h2>
                      {orders.filter(
                        (o) => o.orderStatus === "Delivered"
                      ).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Welcome to FoodExpress</h3>
                    <p>Your food delivery management workspace.</p>
                  </div>
                </div>

                <div className="quick-actions">
                  {menuItems.slice(1).map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        className="quick-action"
                        onClick={() => setActivePage(item.name)}
                      >
                        <Icon size={23} />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Orders</h3>
                    <p>Latest customer orders</p>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer?.fullName || "N/A"}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <span className={statusClass(order.orderStatus)}>
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* FOOD MANAGEMENT */}

          {activePage === "Food Management" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h3>Food Management</h3>
                  <p>Manage your restaurant food items.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setFoodForm(emptyFood);
                    setEditingFoodId(null);
                    setShowFoodForm(true);
                  }}
                >
                  <Plus size={17} /> Add Food
                </button>
              </div>

              <input
                className="form-control mb-3"
                placeholder="Search food by name or category..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
              />

              {showFoodForm && (
                <form className="form-panel" onSubmit={handleFoodSubmit}>
                  <h5>{editingFoodId ? "Edit Food" : "Add New Food"}</h5>

                  <input
                    className="form-control"
                    placeholder="Food Name"
                    value={foodForm.name}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, name: e.target.value })
                    }
                    required
                  />

                  <textarea
                    className="form-control"
                    placeholder="Description"
                    value={foodForm.description}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, description: e.target.value })
                    }
                  />

                  <input
                    className="form-control"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Price"
                    value={foodForm.price}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, price: e.target.value })
                    }
                    required
                  />

                  <input
                    className="form-control"
                    placeholder="Category"
                    value={foodForm.category}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, category: e.target.value })
                    }
                  />

                  <input
                    className="form-control"
                    placeholder="Image URL"
                    value={foodForm.imageUrl}
                    onChange={(e) =>
                      setFoodForm({ ...foodForm, imageUrl: e.target.value })
                    }
                  />

                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={foodForm.available}
                      onChange={(e) =>
                        setFoodForm({
                          ...foodForm,
                          available: e.target.checked
                        })
                      }
                    />
                    Available
                  </label>

                  <FormActions
                    editing={editingFoodId}
                    noun="Food"
                    onCancel={() => setShowFoodForm(false)}
                  />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Food Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.map((food) => (
                      <tr key={food.id}>
                        <td>{food.id}</td>
                        <td>{food.name}</td>
                        <td>{food.category}</td>
                        <td>₹{food.price}</td>
                        <td>
                          {food.available ? "Available" : "Unavailable"}
                        </td>
                        <td>
                          <ActionButtons
                            onEdit={() => editFood(food)}
                            onDelete={() => deleteFood(food.id)}
                          />
                        </td>
                      </tr>
                    ))}

                    {filteredFoods.length === 0 && (
                      <EmptyRow cols={6} text="No food items found." />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}

          {activePage === "Customers" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h3>Customer Management</h3>
                  <p>Manage your registered customers.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setCustomerForm(emptyCustomer);
                    setEditingCustomerId(null);
                    setShowCustomerForm(true);
                  }}
                >
                  <Plus size={17} /> Add Customer
                </button>
              </div>

              <input
                className="form-control mb-3"
                placeholder="Search by name, email or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />

              {showCustomerForm && (
                <form className="form-panel" onSubmit={handleCustomerSubmit}>
                  <h5>
                    {editingCustomerId ? "Edit Customer" : "Add New Customer"}
                  </h5>

                  <input
                    className="form-control"
                    placeholder="Full Name"
                    value={customerForm.fullName}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        fullName: e.target.value
                      })
                    }
                    required
                  />

                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email Address"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        email: e.target.value
                      })
                    }
                    required
                  />

                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone: e.target.value
                      })
                    }
                  />

                  <textarea
                    className="form-control"
                    placeholder="Address"
                    value={customerForm.address}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        address: e.target.value
                      })
                    }
                  />

                  <FormActions
                    editing={editingCustomerId}
                    noun="Customer"
                    onCancel={() => setShowCustomerForm(false)}
                  />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.fullName}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td>
                          <ActionButtons
                            onEdit={() => editCustomer(customer)}
                            onDelete={() => deleteCustomer(customer.id)}
                          />
                        </td>
                      </tr>
                    ))}

                    {filteredCustomers.length === 0 && (
                      <EmptyRow cols={6} text="No customers found." />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}

          {activePage === "Orders" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h3>Order Management</h3>
                  <p>Create orders, assign partners and manage order progress.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setOrderForm(emptyOrder);
                    setEditingOrderId(null);
                    setShowOrderForm(true);
                  }}
                >
                  <Plus size={17} /> Create Order
                </button>
              </div>

              {showOrderForm && (
                <form className="form-panel" onSubmit={handleOrderSubmit}>
                  <h5>
                    {editingOrderId ? "Edit Order" : "Create New Order"}
                  </h5>

                  <label>Customer</label>
                  <select
                    className="form-control"
                    value={orderForm.customerId}
                    onChange={(e) => {
                      const customer = customers.find(
                        (c) => c.id === Number(e.target.value)
                      );

                      setOrderForm({
                        ...orderForm,
                        customerId: e.target.value,
                        deliveryAddress:
                          customer?.address || orderForm.deliveryAddress
                      });
                    }}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} — {c.phone}
                      </option>
                    ))}
                  </select>

                  <label>Delivery Partner</label>
                  <select
                    className="form-control"
                    value={orderForm.deliveryPartnerId}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        deliveryPartnerId: e.target.value
                      })
                    }
                  >
                    <option value="">Not assigned</option>
                    {deliveryPartners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.available ? "Available" : "Unavailable"})
                      </option>
                    ))}
                  </select>

                  <input
                    className="form-control"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Total Amount (₹)"
                    value={orderForm.totalAmount}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        totalAmount: e.target.value
                      })
                    }
                    required
                  />

                  <textarea
                    className="form-control"
                    placeholder="Delivery Address"
                    value={orderForm.deliveryAddress}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        deliveryAddress: e.target.value
                      })
                    }
                    required
                  />

                  <label>Order Status</label>
                  <select
                    className="form-control"
                    value={orderForm.orderStatus}
                    onChange={(e) =>
                      setOrderForm({
                        ...orderForm,
                        orderStatus: e.target.value
                      })
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>

                  <FormActions
                    editing={editingOrderId}
                    noun="Order"
                    onCancel={() => setShowOrderForm(false)}
                  />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Delivery Partner</th>
                      <th>Status</th>
                      <th>Estimated Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) =>
                        `${o.id} ${o.customer?.fullName || ""} ${o.orderStatus || ""}`
                          .toLowerCase()
                          .includes(globalSearch.toLowerCase())
                      )
                      .map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            {order.customer?.fullName || "N/A"}
                            <small className="cell-subtitle">
                              {order.deliveryAddress}
                            </small>
                          </td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            {order.deliveryPartner?.fullName || "Not assigned"}
                            {order.deliveryPartner && (
                              <small className="cell-subtitle">
                                {order.deliveryPartner.vehicleNumber}
                              </small>
                            )}
                          </td>
                          <td>
                            <select
                              className="status-select"
                              value={order.orderStatus}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                            >
                              {STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td>{estimateDelivery(order.orderStatus)}</td>
                          <td>
                            <div className="action-group">
                              <button
                                className="icon-button edit"
                                title="Edit"
                                onClick={() => editOrder(order)}
                              >
                                <Pencil size={16} />
                              </button>

                              {order.orderStatus !== "Cancelled" &&
                                order.orderStatus !== "Delivered" && (
                                  <button
                                    className="icon-button delete"
                                    title="Cancel order"
                                    onClick={() => cancelOrder(order.id)}
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}

                    {orders.length === 0 && (
                      <EmptyRow cols={7} text="No orders found." />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DELIVERY PARTNERS */}

          {activePage === "Delivery Partners" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h3>Delivery Partner Management</h3>
                  <p>Manage your delivery team and availability.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => {
                    setPartnerForm(emptyPartner);
                    setEditingPartnerId(null);
                    setShowPartnerForm(true);
                  }}
                >
                  <Plus size={17} /> Add Partner
                </button>
              </div>

              <input
                className="form-control mb-3"
                placeholder="Search by name, phone or vehicle..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
              />

              {showPartnerForm && (
                <form className="form-panel" onSubmit={handlePartnerSubmit}>
                  <h5>
                    {editingPartnerId
                      ? "Edit Delivery Partner"
                      : "Add Delivery Partner"}
                  </h5>

                  <input
                    className="form-control"
                    placeholder="Full Name"
                    value={partnerForm.fullName}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        fullName: e.target.value
                      })
                    }
                    required
                  />

                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    value={partnerForm.phone}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        phone: e.target.value
                      })
                    }
                    required
                  />

                  <select
                    className="form-control"
                    value={partnerForm.vehicleType}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        vehicleType: e.target.value
                      })
                    }
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    {["Bike", "Scooter", "Car", "Bicycle"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>

                  <input
                    className="form-control"
                    placeholder="Vehicle Number"
                    value={partnerForm.vehicleNumber}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        vehicleNumber: e.target.value
                      })
                    }
                    required
                  />

                  <label>Availability</label>
                  <select
                    className="form-control"
                    value={String(partnerForm.available)}
                    onChange={(e) =>
                      setPartnerForm({
                        ...partnerForm,
                        available: e.target.value === "true"
                      })
                    }
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>

                  <FormActions
                    editing={editingPartnerId}
                    noun="Partner"
                    onCancel={() => setShowPartnerForm(false)}
                  />
                </form>
              )}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Vehicle</th>
                      <th>Vehicle Number</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPartners.map((partner) => (
                      <tr key={partner.id}>
                        <td>{partner.id}</td>
                        <td>{partner.fullName}</td>
                        <td>{partner.phone}</td>
                        <td>{partner.vehicleType}</td>
                        <td>{partner.vehicleNumber}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              partner.available
                                ? "status-delivered"
                                : "status-cancelled"
                            }`}
                          >
                            {partner.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td>
                          <ActionButtons
                            onEdit={() => editPartner(partner)}
                            onDelete={() => deletePartner(partner.id)}
                          />
                        </td>
                      </tr>
                    ))}

                    {filteredPartners.length === 0 && (
                      <EmptyRow cols={7} text="No delivery partners found." />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDER TRACKING */}

          {activePage === "Order Tracking" && (
            <div className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h3>Order Tracking</h3>
                  <p>View delivery progress and add location updates.</p>
                </div>
              </div>

              <div className="tracking-selector">
                <label>Select Order</label>
                <select
                  className="form-control"
                  value={selectedTrackingOrder}
                  onChange={(e) => {
                    setSelectedTrackingOrder(e.target.value);
                    loadTracking(e.target.value);
                  }}
                >
                  <option value="">Choose an order to track</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} — {order.customer?.fullName || "Customer"} (
                      {order.orderStatus})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTrackingOrder && (
                <>
                  {(() => {
                    const order = orders.find(
                      (o) => o.id === Number(selectedTrackingOrder)
                    );

                    if (!order) return null;

                    return (
                      <div className="tracking-summary">
                        <div>
                          <span>Customer</span>
                          <strong>{order.customer?.fullName || "N/A"}</strong>
                        </div>
                        <div>
                          <span>Delivery Partner</span>
                          <strong>
                            {order.deliveryPartner?.fullName || "Not assigned"}
                          </strong>
                        </div>
                        <div>
                          <span>Order Status</span>
                          <strong className={statusClass(order.orderStatus)}>
                            {order.orderStatus}
                          </strong>
                        </div>
                        <div>
                          <span>Estimated Time</span>
                          <strong>{estimateDelivery(order.orderStatus)}</strong>
                        </div>
                      </div>
                    );
                  })()}

                  <form
                    className="form-panel"
                    onSubmit={handleTrackingSubmit}
                  >
                    <h5>
                      <MapPin size={18} /> Add Tracking Update
                    </h5>

                    <input
                      className="form-control"
                      placeholder="Current Location"
                      value={trackingForm.currentLocation}
                      onChange={(e) =>
                        setTrackingForm({
                          ...trackingForm,
                          currentLocation: e.target.value
                        })
                      }
                      required
                    />

                    <input
                      className="form-control"
                      type="number"
                      step="any"
                      placeholder="Latitude (optional)"
                      value={trackingForm.latitude}
                      onChange={(e) =>
                        setTrackingForm({
                          ...trackingForm,
                          latitude: e.target.value
                        })
                      }
                    />

                    <input
                      className="form-control"
                      type="number"
                      step="any"
                      placeholder="Longitude (optional)"
                      value={trackingForm.longitude}
                      onChange={(e) =>
                        setTrackingForm({
                          ...trackingForm,
                          longitude: e.target.value
                        })
                      }
                    />

                    <select
                      className="form-control"
                      value={trackingForm.deliveryStatus}
                      onChange={(e) =>
                        setTrackingForm({
                          ...trackingForm,
                          deliveryStatus: e.target.value
                        })
                      }
                    >
                      <option value="">
                        Select Delivery Status (optional)
                      </option>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    <button className="primary-button" type="submit">
                      <Plus size={17} /> Add Update
                    </button>
                  </form>

                  <div className="tracking-history">
                    <div className="panel-heading">
                      <div>
                        <h3>Tracking History</h3>
                        <p>Location and delivery updates for this order.</p>
                      </div>

                      <button
                        className="secondary-button"
                        onClick={() => loadTracking(selectedTrackingOrder)}
                      >
                        <RefreshCw size={16} /> Refresh
                      </button>
                    </div>

                    {loadingTracking ? (
                      <p>Loading tracking history...</p>
                    ) : trackingHistory.length > 0 ? (
                      <div className="timeline">
                        {trackingHistory.map((item) => (
                          <div className="timeline-item" key={item.id}>
                            <div className="timeline-dot">
                              <MapPin size={16} />
                            </div>

                            <div className="timeline-content">
                              <strong>
                                {item.currentLocation || "Location not provided"}
                              </strong>
                              <p>{item.deliveryStatus || "Update"}</p>

                              {item.latitude != null &&
                                item.longitude != null && (
                                  <small>
                                    Coordinates: {item.latitude},{" "}
                                    {item.longitude}
                                  </small>
                                )}

                              <small>
                                {item.updatedAt
                                  ? new Date(item.updatedAt).toLocaleString()
                                  : "Time unavailable"}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-message">
                        No tracking updates have been added for this order.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// REUSABLE COMPONENTS

function FormActions({ editing, noun, onCancel }) {
  return (
    <div className="form-actions">
      <button className="primary-button" type="submit">
        {editing ? `Update ${noun}` : `Save ${noun}`}
      </button>

      <button
        className="secondary-button"
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="action-group">
      <button
        className="icon-button edit"
        title="Edit"
        onClick={onEdit}
      >
        <Pencil size={16} />
      </button>

      <button
        className="icon-button delete"
        title="Delete"
        onClick={onDelete}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function EmptyRow({ cols, text }) {
  return (
    <tr>
      <td colSpan={cols} className="text-center py-4">
        {text}
      </td>
    </tr>
  );
}

export default App;
